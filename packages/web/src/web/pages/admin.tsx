import { useState, type FormEvent } from "react";
import {
  LockKeyhole,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Save,
  Upload,
  X,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "../lib/auth";
import { client } from "../lib/api";
import {
  useContent,
  useAccess,
  useSave,
  useRemove,
  type ContentRow,
} from "../queries/content";
import { PageHeading, Loading, Empty } from "../components/site";
import { categories, levels } from "./quiz";
const sections = [
  ["event", "Eventos e calendário"],
  ["semeq", "Edições do SEMEQ"],
  ["member", "Equipe e cargos"],
  ["speaker", "Palestrantes"],
  ["question", "Banco de questões"],
  ["photo", "Galeria"],
  ["news", "Notícias e comunicados"],
  ["institution", "Conteúdo institucional"],
  ["faq", "Perguntas frequentes"],
];
const fields: Record<string, [string, string, string?][]> = {
  event: [
    ["title", "Título"],
    ["date", "Data completa confirmada", "date"],
    ["partialDate", "Data sem ano (referência)"],
    ["time", "Horário", "time"],
    ["speaker", "Palestrante"],
    ["theme", "Tema / categoria da atividade"],
    ["location", "Local"],
    ["status", "Situação", "status"],
    ["description", "Descrição", "textarea"],
  ],
  semeq: [
    ["title", "Título da edição"],
    ["period", "Período (ex.: 05 a 09 de outubro)"],
    ["year", "Ano confirmado"],
    ["location", "Local"],
    ["description", "Apresentação", "textarea"],
    ["program", "Programação por dia, horário e palestrantes", "textarea"],
    ["access", "Orientações de acesso", "textarea"],
    ["partners", "Parceiros e patrocinadores confirmados", "textarea"],
    ["thanks", "Agradecimentos oficiais", "textarea"],
  ],
  member: [
    ["title", "Nome completo"],
    ["role", "Cargo"],
    ["description", "Descrição opcional", "textarea"],
  ],
  speaker: [
    ["title", "Nome completo"],
    ["description", "Informações fornecidas pelo palestrante", "textarea"],
  ],
  question: [
    ["title", "Enunciado", "textarea"],
    ["category", "Categoria", "category"],
    ["level", "Dificuldade", "level"],
    ["options", "Quatro alternativas (uma por linha)", "textarea"],
    [
      "correct",
      "Índice da alternativa correta (0=A, 1=B, 2=C, 3=D)",
      "correct",
    ],
    ["explanation", "Explicação do gabarito", "textarea"],
    ["source", "Fonte bibliográfica ou URL"],
  ],
  photo: [
    ["title", "Legenda / título"],
    [
      "category",
      "Categoria (Palestras, Reuniões, Atividades práticas, SEMEQ, Extensão)",
    ],
    ["year", "Ano"],
    ["event", "Nome do evento"],
  ],
  news: [
    ["title", "Título"],
    ["date", "Data de publicação", "date"],
    ["description", "Texto do comunicado", "textarea"],
  ],
  institution: [
    ["title", "Título"],
    ["description", "Apresentação", "textarea"],
    ["mission", "Nossa missão", "textarea"],
    ["objectives", "Nossos objetivos", "textarea"],
    ["participate", "Por que participar?", "textarea"],
  ],
  faq: [
    ["title", "Pergunta"],
    ["description", "Resposta", "textarea"],
  ],
};
export default function Admin() {
  const { data: session, isPending } = authClient.useSession();
  const access = useAccess(Boolean(session));
  const q = useContent();
  const save = useSave();
  const remove = useRemove();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("event");
  const [edit, setEdit] = useState<ContentRow | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<ContentRow | null>(null);
  async function login(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = signup
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password });
      if (result.error)
        setError(result.error.message || "Não foi possível entrar.");
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    setBusy(true);
    setError("");
    try {
      const result = await authClient.managedAuth.signIn({
        provider: "google",
      });
      if (result.error && result.error.code !== "POPUP_CLOSED")
        setError(result.error.message || "Não foi possível entrar com Google.");
    } catch {
      setError("Não foi possível entrar com Google.");
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File) {
    if (!edit) return;
    setUploading(true);
    setError("");
    try {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
        throw Error("Use JPEG, PNG ou WebP.");
      const result = await client.contents.upload({
        type: file.type as "image/jpeg",
        size: file.size,
      });
      const response = await fetch(result.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!response.ok)
        throw Error(
          "O armazenamento recusou o envio. Verifique a configuração CORS do bucket.",
        );
      setEdit({ ...edit, data: { ...edit.data, imageKey: result.key } });
      setMessage("Imagem enviada. Salve o registro para publicá-la.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setError("");
    try {
      await save.mutateAsync({
        ...edit,
        kind: edit.kind as "event",
        data: Object.fromEntries(
          Object.entries(edit.data).filter(([key]) => key !== "image"),
        ),
      });
      setEdit(null);
      setMessage("Conteúdo salvo e publicado.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao salvar.");
    }
  }
  if (isPending) return <Loading />;
  if (!session)
    return (
      <>
        <PageHeading
          eyebrow="ACESSO RESTRITO"
          title="Área da gestão"
          description="Um espaço seguro para organizar e atualizar os conteúdos do GEMEDE."
        />
        <section className="container section login-grid">
          <div className="login-intro">
            <LockKeyhole size={40} />
            <h2>
              Cuidar do conhecimento.
              <br />
              <em>Organizar o próximo passo.</em>
            </h2>
            <p>
              Apenas integrantes autorizados podem editar eventos, conteúdos,
              fotografias e questões. Criar uma conta não concede acesso
              administrativo.
            </p>
          </div>
          <form className="login-form" onSubmit={login}>
            <h3>{signup ? "Criar conta de acesso" : "Entre na sua conta"}</h3>
            <button
              type="button"
              className="google-button"
              onClick={google}
              disabled={busy}
            >
              Continuar com Google <ArrowRight size={16} />
            </button>
            <span className="auth-divider">ou use seu e-mail</span>
            {signup && (
              <label>
                Nome
                <input
                  aria-label="Nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}
            <label>
              E-mail
              <input
                aria-label="E-mail"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Senha
              <input
                aria-label="Senha"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                minLength={10}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && (
              <p role="alert" className="error-message">
                {error}
              </p>
            )}
            <button className="button" disabled={busy}>
              {busy ? "Aguarde…" : signup ? "Criar conta" : "Entrar"}
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setSignup(!signup);
                setError("");
              }}
            >
              {signup ? "Já tenho uma conta" : "Ainda não tenho uma conta"}
            </button>
          </form>
        </section>
      </>
    );
  if (access.isLoading) return <Loading />;
  if (access.isError)
    return (
      <section className="container section">
        <div className="access-denied">
          <ShieldCheck size={44} />
          <h2>
            Conta autenticada.
            <br />
            Autorização pendente.
          </h2>
          <p>
            Esta conta não tem permissão para gerenciar o site. O responsável
            técnico deve liberar explicitamente seu identificador no cadastro de
            administradores.
          </p>
          <p className="note">
            Identificador da conta: <code>{session.user.id}</code>
          </p>
          <button
            className="button secondary"
            onClick={() => authClient.signOut()}
          >
            Sair da conta
            <LogOut size={16} />
          </button>
        </div>
      </section>
    );
  return (
    <>
      <PageHeading
        eyebrow="PAINEL ADMINISTRATIVO"
        title="Gestão do GEMEDE"
        description={`Olá, ${session.user.name}. Organize conteúdos e publique as próximas atividades.`}
      />
      <section className="container section admin-layout">
        <aside className="admin-nav">
          {sections.map(([key, title]) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => {
                setTab(key);
                setEdit(null);
                setMessage("");
                setError("");
              }}
            >
              {title}
            </button>
          ))}
          <button onClick={() => authClient.signOut()}>
            <LogOut size={15} />
            Sair
          </button>
        </aside>
        <div className="admin-content">
          <div className="section-title">
            <h3>{sections.find((s) => s[0] === tab)?.[1]}</h3>
            <button
              className="button"
              onClick={() => {
                setEdit({
                  id: crypto.randomUUID(),
                  kind: tab,
                  data:
                    tab === "event"
                      ? { status: "A confirmar" }
                      : tab === "question"
                        ? {
                            category: categories[0],
                            level: levels[0],
                            correct: "0",
                          }
                        : {},
                });
                setError("");
                setMessage("");
              }}
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>
          {message && (
            <output className="success-message">
              {message}
            </output>
          )}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {q.isLoading ? (
            <Loading />
          ) : q.isError ? (
            <p role="alert">Falha ao carregar registros.</p>
          ) : (
            <div className="admin-list">
              {q.data
                ?.filter((r) => r.kind === tab)
                .map((r) => (
                  <div key={r.id}>
                    <span>
                      <strong>{r.data.title}</strong>
                      <small>
                        {r.data.role ||
                          r.data.partialDate ||
                          r.data.category ||
                          r.data.year ||
                          r.data.date ||
                          r.data.description?.slice(0, 65)}
                      </small>
                    </span>
                    <button
                      aria-label={`Editar ${r.data.title}`}
                      onClick={() => {
                        setEdit(r);
                        setError("");
                        setMessage("");
                      }}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      aria-label={`Excluir ${r.data.title}`}
                      onClick={() => setDeleting(r)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              {!q.data?.some((r) => r.kind === tab) && (
                <Empty title="Nenhum registro ainda.">
                  Use Adicionar para publicar o primeiro conteúdo.
                </Empty>
              )}
            </div>
          )}
        </div>
        {edit && (
          <div className="modal-backdrop">
            <form
              className="modal edit-form"
              aria-label="Editar conteúdo"
              onSubmit={submit}
            >
              <button
                type="button"
                className="modal-close"
                onClick={() => setEdit(null)}
                aria-label="Fechar edição"
              >
                <X />
              </button>
              <span className="eyebrow">GESTÃO DE CONTEÚDO</span>
              <h2>{edit.data.title ? "Editar registro" : "Novo registro"}</h2>
              {fields[edit.kind]?.map(([key, label, type]) => (
                <label key={key}>
                  {label}
                  {type === "textarea" ? (
                    <textarea
                      aria-label={label}
                      rows={4}
                      required={
                        key === "title" ||
                        (edit.kind === "question" &&
                          ["options", "explanation"].includes(key))
                      }
                      value={edit.data[key] || ""}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          data: { ...edit.data, [key]: e.target.value },
                        })
                      }
                    />
                  ) : ["status", "category", "level", "correct"].includes(
                      type || "",
                    ) ? (
                    <>
                      <select
                        value={edit.data[key] || ""}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            data: { ...edit.data, [key]: e.target.value },
                          })
                        }
                      >
                        {(type === "status"
                          ? [
                              "A confirmar",
                              "Próximo",
                              "Em andamento",
                              "Realizado",
                            ]
                          : type === "category"
                            ? Array.from(
                                new Set([
                                  ...categories,
                                  ...(q.data || [])
                                    .filter((r) => r.kind === "question")
                                    .map((r) => r.data.category),
                                ]),
                              )
                            : type === "level"
                              ? Array.from(
                                  new Set([
                                    ...levels,
                                    ...(q.data || [])
                                      .filter((r) => r.kind === "question")
                                      .map((r) => r.data.level),
                                  ]),
                                )
                              : ["0", "1", "2", "3"]
                        ).map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                      {["category", "level"].includes(type || "") && (
                        <input
                          aria-label={`Nova opção: ${label}`}
                          placeholder="Ou informe uma nova categoria / dificuldade"
                          value={edit.data[key] || ""}
                          onChange={(e) =>
                            setEdit({
                              ...edit,
                              data: { ...edit.data, [key]: e.target.value },
                            })
                          }
                        />
                      )}
                    </>
                  ) : (
                    <input
                      aria-label={label}
                      type={type || "text"}
                      required={key === "title"}
                      value={edit.data[key] || ""}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          data: { ...edit.data, [key]: e.target.value },
                        })
                      }
                    />
                  )}
                </label>
              ))}
              {["event", "member", "photo", "semeq", "news"].includes(
                edit.kind,
              ) && (
                <label className="upload-field">
                  <Upload size={18} />{" "}
                  {uploading
                    ? "Enviando imagem…"
                    : edit.data.imageKey
                      ? "Imagem vinculada · substituir"
                      : "Adicionar cartaz ou fotografia (até 10 MB)"}
                  <input
                    aria-label="Adicionar imagem"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading}
                    onChange={(e) => {
                      if (e.target.files?.[0]) void upload(e.target.files[0]);
                    }}
                  />
                  {edit.data.image && (
                    <img src={edit.data.image} alt="Imagem atual" />
                  )}
                </label>
              )}
              {error && (
                <p className="error-message" role="alert">
                  {error}
                </p>
              )}
              {message && <p className="success-message">{message}</p>}
              <button className="button" disabled={save.isPending || uploading}>
                <Save size={16} />
                {save.isPending ? "Salvando…" : "Salvar e publicar"}
              </button>
            </form>
          </div>
        )}
        {deleting && (
          <div className="modal-backdrop">
            <dialog open
              className="modal"
              aria-modal="true"
              aria-label="Confirmar exclusão"
            >
              <h2>Excluir este registro?</h2>
              <p>{deleting.data.title}</p>
              <p>
                Esta ação remove o conteúdo publicado e não pode ser desfeita
                pelo painel.
              </p>
              <div className="result-actions">
                <button
                  className="button danger"
                  disabled={remove.isPending}
                  onClick={async () => {
                    try {
                      await remove.mutateAsync({ id: deleting.id });
                      setDeleting(null);
                      setMessage("Registro excluído.");
                    } catch (e) {
                      setError(
                        e instanceof Error ? e.message : "Falha ao excluir.",
                      );
                    }
                  }}
                >
                  {remove.isPending ? "Excluindo…" : "Confirmar exclusão"}
                </button>
                <button
                  className="button secondary"
                  onClick={() => setDeleting(null)}
                >
                  Cancelar
                </button>
              </div>
            </dialog>
          </div>
        )}
      </section>
    </>
  );
}
