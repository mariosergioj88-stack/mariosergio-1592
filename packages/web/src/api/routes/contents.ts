import { z } from "zod";
import { eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import { content, administrators } from "../database/schema";
import { auth } from "../auth";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const admin = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session) throw new ORPCError("UNAUTHORIZED");
  const [allowed] = await db
    .select()
    .from(administrators)
    .where(eq(administrators.userId, session.user.id));
  if (!allowed)
    throw new ORPCError("FORBIDDEN", {
      message: "Esta conta ainda não foi autorizada pela gestão.",
    });
  return next({ context: { user: session.user } });
});
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
const kind = z.enum([
  "event",
  "member",
  "question",
  "semeq",
  "photo",
  "news",
  "institution",
  "faq",
  "speaker",
]);
export const contents = {
  list: base.handler(async () => {
    const rows = await db.select().from(content);
    return Promise.all(
      rows.map(async (row) => ({
        ...row,
        data: {
          ...row.data,
          ...(row.data.imageKey
            ? {
                image: await getSignedUrl(
                  s3,
                  new GetObjectCommand({
                    Bucket: process.env.S3_BUCKET,
                    Key: row.data.imageKey,
                  }),
                  { expiresIn: 3600 },
                ),
              }
            : {}),
        },
      })),
    );
  }),
  access: admin.handler(({ context }) => ({ name: context.user.name })),
  save: admin
    .input(
      z.object({
        id: z.string().max(100),
        kind,
        data: z.record(z.string().max(100), z.string().max(20000)),
      }),
    )
    .handler(async ({ input }) => {
      if (input.kind === "question") {
        if (
          !input.data.title ||
          !input.data.explanation ||
          !input.data.options ||
          !input.data.category ||
          !input.data.level
        )
          throw new ORPCError("BAD_REQUEST", {
            message:
              "Complete a questão, categoria, nível, alternativas e explicação.",
          });
        const options = input.data.options.split("\n").filter(Boolean);
        if (
          options.length !== 4 ||
          !["0", "1", "2", "3"].includes(input.data.correct)
        )
          throw new ORPCError("BAD_REQUEST", {
            message:
              "Informe quatro alternativas e uma resposta correta de 0 a 3.",
          });
      }
      if (input.data.date && !/^\d{4}-\d{2}-\d{2}$/.test(input.data.date))
        throw new ORPCError("BAD_REQUEST", {
          message: "Use uma data completa no formato AAAA-MM-DD.",
        });
      await db
        .insert(content)
        .values(input)
        .onConflictDoUpdate({
          target: content.id,
          set: { kind: input.kind, data: input.data },
        });
      return { ok: true };
    }),
  remove: admin
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      await db.delete(content).where(eq(content.id, input.id));
      return { ok: true };
    }),
  upload: admin
    .input(
      z.object({
        type: z.enum(["image/jpeg", "image/png", "image/webp"]),
        size: z.number().max(10 * 1024 * 1024),
      }),
    )
    .handler(async ({ input }) => {
      const key = `gemede/${crypto.randomUUID()}.${input.type.split("/")[1]}`;
      const url = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          ContentType: input.type,
        }),
        { expiresIn: 600 },
      );
      return { key, url };
    }),
};
