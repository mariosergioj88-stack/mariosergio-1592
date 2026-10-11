import { useState } from "react";
import {
  Instagram,
  Mail,
  MapPin,
  ArrowUpRight,
  ImagePlus,
  Users,
  FlaskConical,
  Heart,
  X,
} from "lucide-react";
import { useContent } from "../queries/content";
import {
  PageHeading,
  Empty,
  Loading,
  ErrorState,
  ButtonLink,
} from "../components/site";
export function About() {
  const q = useContent();
  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState />;
  const d = q.data?.find((r) => r.id === "about")?.data || {};
  return (
    <>
      <PageHeading
        eyebrow="CIÊNCIA, PRÁTICA E CONEXÃO"
        title="Sobre o GEMEDE"
        description="Um espaço de aprendizado para quem acredita no futuro da medicina equina."
      />
      <section className="container section editorial">
        <div>
          <h2>
            Conhecimento construído
            <br />
            <em>em comunidade.</em>
          </h2>
          <p>{d.description}</p>
          <p>
            A medicina equina integra conhecimentos de clínica, cirurgia,
            reprodução, nutrição e manejo. Compreender suas particularidades
            contribui para uma atuação veterinária responsável, fundamentada em
            ciência e comprometida com o bem-estar dos animais.
          </p>
          <p>
            Os grupos de estudos complementam a formação universitária:
            favorecem a discussão de temas, a leitura crítica de materiais
            científicos e o diálogo entre estudantes, professores e
            profissionais.
          </p>
        </div>
        <figure>
          <img
            src="/images/horses.jpg"
            alt="Cavalos no campo — fotografia ilustrativa"
          />
          <figcaption>
            Um olhar atento aos equinos e ao seu bem-estar. Imagem ilustrativa.
          </figcaption>
        </figure>
      </section>
      <section className="container section values-grid">
        {[
          ["Nossa missão", d.mission, Heart],
          ["Nossos objetivos", d.objectives, FlaskConical],
          ["Por que participar?", d.participate, Users],
        ].map(([title, description, Icon]) => (
          <article key={String(title)}>
            <Icon size={28} />
            <h3>{String(title)}</h3>
            <p>{String(description || "Informações em preparação.")}</p>
          </article>
        ))}
      </section>
      <section className="join-section">
        <div className="container">
          <h2>Teoria, prática e novas possibilidades.</h2>
          <ButtonLink to="/contato">Faça parte dessa troca</ButtonLink>
        </div>
      </section>
    </>
  );
}
export function Team() {
  const q = useContent();
  return (
    <>
      <PageHeading
        eyebrow="QUEM FAZ ACONTECER"
        title="Nossa equipe"
        description="Conheça as integrantes da gestão do GEMEDE — Unijorge."
      />
      <section className="container section">
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState />
        ) : (
          <div className="team-grid">
            {q.data
              ?.filter((r) => r.kind === "member")
              .map((r) => (
                <article className="team-card" key={r.id}>
                  <div className="portrait">
                    {r.data.image ? (
                      <img src={r.data.image} alt={r.data.title} />
                    ) : (
                      <>
                        <Users size={32} />
                        <small>Fotografia em breve</small>
                      </>
                    )}
                  </div>
                  <span className="eyebrow">{r.data.role}</span>
                  <h3>{r.data.title}</h3>
                  {r.data.description && <p>{r.data.description}</p>}
                </article>
              ))}
          </div>
        )}
        <p className="note">
          Os retratos serão adicionados pela gestão. Não utilizamos fotografias
          fictícias de integrantes.
        </p>
      </section>
    </>
  );
}
export function Semeq() {
  const q = useContent();
  const [edition, setEdition] = useState("");
  const editions = q.data?.filter((r) => r.kind === "semeq") || [];
  const active = editions.find((r) => r.id === edition) || editions[0];
  const d = active?.data || {};
  return (
    <>
      <section className="semeq-hero">
        <div className="container">
          <span className="eyebrow">GEMEDE · UNIJORGE</span>
          <h1>
            SEMEQ<span>Semana de Medicina Equina</span>
          </h1>
          <p>
            Um encontro com a ciência.
            <br />
            Uma semana para ampliar horizontes.
          </p>
          <div className="semeq-date">
            <span>
              {d.period || "Período a confirmar"} {d.year && `· ${d.year}`}
            </span>
            <span>
              {d.year
                ? "Consulte a programação confirmada"
                : "Ano e programação a confirmar"}
            </span>
          </div>
        </div>
        <span className="semeq-big">S</span>
      </section>
      <section className="container section">
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState />
        ) : (
          <>
            <div className="section-title">
              <h2>Conhecimento que aproxima.</h2>
              {editions.length > 1 && (
                <select
                  value={active?.id}
                  onChange={(e) => setEdition(e.target.value)}
                  aria-label="Edição do SEMEQ"
                >
                  {editions.map((r) => (
                    <option value={r.id} key={r.id}>
                      {r.data.title} · {r.data.year || "Ano a confirmar"}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="about-grid">
              <p>{d.description}</p>
              <p>
                A Semana de Medicina Equina propõe um espaço de aprendizado,
                discussão e integração. Seu objetivo acadêmico é aprofundar
                temas da área e incentivar a troca entre estudantes, professores
                e profissionais.
              </p>
            </div>
            <div className="section">
              <span className="eyebrow">PALESTRAS E ENCONTROS</span>
              <h2>Programação</h2>
              {d.program ? (
                <div className="program-text">{d.program}</div>
              ) : (
                <div className="program-days">
                  {["05", "06", "07", "08", "09"].map((day) => (
                    <div key={day}>
                      <strong>
                        {day}
                        <small>OUT</small>
                      </strong>
                      <span>
                        Programação a confirmar
                        <br />
                        <small>
                          Palestras, horários e palestrantes ainda não
                          fornecidos.
                        </small>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="note">
                Referência inicial: 05 a 09 de outubro. O ano não foi informado;
                esta edição não é apresentada automaticamente como futura ou
                realizada.
              </p>
            </div>
            <div className="values-grid">
              <article>
                <MapPin />
                <h3>Local e acesso</h3>
                <p>{d.location || "Local a confirmar"}</p>
                <p>
                  {d.access ||
                    "Consulte a gestão para confirmar salas, horários e orientações de acesso."}
                </p>
              </article>
              <article>
                <ImagePlus />
                <h3>Materiais de divulgação</h3>
                {d.image ? (
                  <a href={d.image} target="_blank" rel="noreferrer">
                    <img
                      className="poster"
                      src={d.image}
                      alt="Cartaz do SEMEQ"
                    />
                  </a>
                ) : (
                  <p>
                    Os cartazes e materiais oficiais serão disponibilizados
                    aqui.
                  </p>
                )}
              </article>
              <article>
                <Heart />
                <h3>Parceiros e apoiadores</h3>
                <p>
                  {d.partners ||
                    "Nenhum patrocinador ou parceiro cadastrado para esta edição."}
                </p>
              </article>
            </div>
            <div className="section">
              <h2>Registros da semana</h2>
              <Empty title="Memórias que merecem ser compartilhadas.">
                As fotografias oficiais do SEMEQ serão adicionadas pela gestão.
              </Empty>
              <ButtonLink to="/galeria" secondary>
                Explorar a galeria
              </ButtonLink>
            </div>
            <div className="semeq-thanks">
              <h3>Agradecimentos</h3>
              <p>
                {d.thanks ||
                  "Este espaço receberá os agradecimentos oficiais aos palestrantes, participantes e apoiadores após a confirmação da gestão."}
              </p>
            </div>
            <div className="section">
              <h2>Próximas edições</h2>
              <p>
                Novas edições serão publicadas com sua própria programação,
                datas, cartazes e registros.
              </p>
            </div>
          </>
        )}
      </section>
    </>
  );
}
export function Gallery() {
  const q = useContent();
  const [category, setCategory] = useState("Todas");
  const [year, setYear] = useState("Todos");
  const [event, setEvent] = useState("Todos");
  const [image, setImage] = useState<{ url: string; title: string } | null>(
    null,
  );
  const photos = q.data?.filter((r) => r.kind === "photo") || [];
  const filtered = photos.filter(
    (r) =>
      (category === "Todas" || r.data.category === category) &&
      (year === "Todos" || r.data.year === year) &&
      (event === "Todos" || r.data.event === event),
  );
  return (
    <>
      <PageHeading
        eyebrow="NOSSAS MEMÓRIAS"
        title="Galeria"
        description="Encontros, aprendizado e experiências que fazem parte da história do grupo."
      />
      <section className="container section">
        <div className="filters">
          <label>
            Categoria
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Todas</option>
              {[
                "Palestras",
                "Reuniões",
                "Atividades práticas",
                "Participação em eventos",
                "SEMEQ",
                "Extensão",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Ano
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>Todos</option>
              {Array.from(
                new Set(photos.map((r) => r.data.year).filter(Boolean)),
              ).map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            Evento
            <select value={event} onChange={(e) => setEvent(e.target.value)}>
              <option>Todos</option>
              {Array.from(
                new Set(photos.map((r) => r.data.event).filter(Boolean)),
              ).map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState />
        ) : filtered.length ? (
          <div className="gallery-grid">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() =>
                  setImage({ url: r.data.image, title: r.data.title })
                }
              >
                <img src={r.data.image} alt={r.data.title} loading="lazy" />
                <span>
                  {r.data.title}
                  <small>
                    {r.data.category} · {r.data.year}
                  </small>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <Empty title="Nossa história, em imagens.">
              A galeria está preparada para receber fotografias oficiais. Nenhum
              registro de evento foi adicionado ainda.
            </Empty>
            <div className="gallery-placeholders">
              {["Palestras e encontros", "Atividades práticas", "SEMEQ"].map(
                (c) => (
                  <div key={c}>
                    <ImagePlus size={30} />
                    <h3>{c}</h3>
                    <span>Aguardando registros do grupo</span>
                  </div>
                ),
              )}
            </div>
          </>
        )}
        {image && (
          <div className="modal-backdrop">
            <div className="lightbox">
              <button aria-label="Fechar imagem" onClick={() => setImage(null)}>
                <X />
              </button>
              <img src={image.url} alt={image.title} />
              <p>{image.title}</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
export function Contact() {
  const q = useContent();
  return (
    <>
      <PageHeading
        eyebrow="VAMOS CONVERSAR"
        title="Contato"
        description="Tem interesse pelo grupo ou quer saber mais sobre nossas atividades? Fale com a gente."
      />
      <section className="container section contact-grid">
        <div>
          <span className="eyebrow">CANAIS OFICIAIS</span>
          <h2>
            O próximo encontro
            <br />
            começa com uma conversa.
          </h2>
          <a
            className="contact-item"
            href="https://www.instagram.com/gemede.uj/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram />
            <span>
              <small>INSTAGRAM</small>
              <strong>@gemede.uj</strong>
            </span>
            <ArrowUpRight />
          </a>
          <a className="contact-item" href="mailto:gemedequina@gmail.com">
            <Mail />
            <span>
              <small>E-MAIL</small>
              <strong>gemedequina@gmail.com</strong>
            </span>
            <ArrowUpRight />
          </a>
          <div className="contact-item">
            <MapPin />
            <span>
              <small>INSTITUIÇÃO</small>
              <strong>Unijorge — Campus Paralela</strong>
              <p>Sala 405, quando aplicável às atividades.</p>
            </span>
          </div>
        </div>
        <div className="faq">
          <span className="eyebrow">PERGUNTAS FREQUENTES</span>
          <h2>Bom saber.</h2>
          {q.isLoading ? (
            <Loading />
          ) : q.isError ? (
            <ErrorState />
          ) : (
            q.data
              ?.filter((r) => r.kind === "faq")
              .map((r) => (
                <details key={r.id}>
                  <summary>{r.data.title}</summary>
                  <p>{r.data.description}</p>
                </details>
              ))
          )}
          <p className="note">
            Informações específicas de participação e inscrições devem ser
            confirmadas com a gestão.
          </p>
        </div>
      </section>
    </>
  );
}
