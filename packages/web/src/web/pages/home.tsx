import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Stethoscope,
  Brain,
  Clock3,
} from "lucide-react";
import { useContent } from "../queries/content";
import {
  ButtonLink,
  Empty,
  Loading,
  ErrorState,
  confirmed,
  localDate,
} from "../components/site";
export default function Home() {
  const query = useContent();
  const rows = query.data || [];
  const about = rows.find((r) => r.id === "about")?.data;
  const upcoming = rows
    .filter(
      (r) =>
        r.kind === "event" &&
        confirmed(r) &&
        r.data.date >= localDate() &&
        r.data.status !== "Realizado",
    )
    .sort((a, b) => a.data.date.localeCompare(b.data.date));
  return (
    <>
      <section className="hero">
        <img
          className="hero-photo"
          src="/images/hero.jpg"
          alt="Cavalos em ambiente de campo — imagem ilustrativa"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <span className="hero-label">
            <span /> CIÊNCIA QUE CONECTA. CUIDADO QUE TRANSFORMA.
          </span>
          <h1>
            Conhecimento que
            <br />
            fortalece a{" "}
            <em>
              Medicina
              <br />
              Equina.
            </em>
          </h1>
          <p>
            Ciência, prática e aprendizado para formar profissionais
            <br className="desktop-break" /> preparados para os desafios da
            medicina e do manejo dos equinos.
          </p>
          <div className="hero-actions">
            <ButtonLink to="/sobre">Conheça o GEMEDE</ButtonLink>
            <ButtonLink to="/eventos" secondary>
              Confira os eventos
            </ButtonLink>
          </div>
          <Link to="/quiz" className="hero-quiz">
            <Brain size={16} /> Teste seus conhecimentos no quiz{" "}
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="hero-bottom">
          <span>GEMEDE · UNIJORGE</span>
          <span>Medicina Veterinária, além da sala de aula.</span>
        </div>
      </section>
      <section className="pillars container">
        <div>
          <BookOpen />
          <span>
            <strong>Conhecimento científico</strong>
            <small>Aprender, discutir e aprofundar.</small>
          </span>
        </div>
        <div>
          <Stethoscope />
          <span>
            <strong>Teoria encontra a prática</strong>
            <small>Uma formação mais completa.</small>
          </span>
        </div>
        <div>
          <GraduationCap />
          <span>
            <strong>Conexões que formam</strong>
            <small>Estudantes, docentes e profissionais.</small>
          </span>
        </div>
      </section>
      <section className="container section about-grid">
        <div>
          <span className="eyebrow">SOBRE O GRUPO</span>
          <h2>
            Uma paixão em comum.
            <br />
            <em>Um propósito que nos une.</em>
          </h2>
        </div>
        <div>
          <p>
            {about?.description ||
              "O GEMEDE — Grupo de Estudos em Medicina Equina da Unijorge — reúne o interesse pelos equinos e a vontade de aprender. Um espaço para aproximar ciência, formação acadêmica e prática veterinária."}
          </p>
          <Link to="/sobre" className="text-link">
            Conheça nossa missão <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="activities section">
        <div className="container">
          <div className="section-title">
            <div>
              <span className="eyebrow">APRENDIZADO EM MOVIMENTO</span>
              <h2>Próximas atividades</h2>
            </div>
            <Link to="/calendario" className="text-link">
              Ver calendário <ArrowUpRight size={17} />
            </Link>
          </div>
          {query.isLoading ? (
            <Loading />
          ) : query.isError ? (
            <ErrorState />
          ) : upcoming.length ? (
            <div className="event-grid">
              {upcoming.slice(0, 3).map((r) => (
                <Link to="/eventos" className="event-card" key={r.id}>
                  <span className="tag">{r.data.status}</span>
                  <h3>{r.data.title}</h3>
                  <p>{r.data.speaker}</p>
                  <span>
                    <CalendarDays size={15} />
                    {new Date(r.data.date + "T12:00").toLocaleDateString(
                      "pt-BR",
                    )}
                  </span>
                  <span>
                    <Clock3 size={15} />
                    {r.data.time || "Horário a confirmar"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="upcoming-empty">
              <div className="circle-icon">
                <CalendarDays />
              </div>
              <div>
                <h3>Novos encontros vêm por aí.</h3>
                <p>
                  Nenhuma atividade futura com data confirmada no momento.
                  <br />
                  Acompanhe o calendário e os canais oficiais do GEMEDE.
                </p>
              </div>
              <Link to="/eventos" className="text-link">
                Explorar atividades <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="container section feature-grid">
        <Link to="/semeq" className="semeq-feature">
          <span className="eyebrow">UM ENCONTRO COM O CONHECIMENTO</span>
          <h2>
            SEMEQ<span>Semana de Medicina Equina</span>
          </h2>
          <p>
            Ciência, troca de experiências e novos olhares
            <br />
            sobre a medicina equina.
          </p>
          <div className="feature-bottom">
            <span>Conheça a semana</span>
            <span className="round-arrow">
              <ArrowUpRight />
            </span>
          </div>
          <div className="semeq-watermark">S</div>
        </Link>
        <Link to="/quiz" className="quiz-feature">
          <Brain size={34} />
          <span className="eyebrow">APRENDA. PRATIQUE. EVOLUA.</span>
          <h2>
            Quanto você sabe
            <br />
            sobre equinos?
          </h2>
          <p>
            Teste seus conhecimentos com questões,
            <br />
            explicações e diferentes níveis de dificuldade.
          </p>
          <div className="feature-bottom">
            <span>Acesse o quiz</span>
            <ArrowRight />
          </div>
        </Link>
      </section>
      <section className="container section">
        <div className="section-title">
          <div>
            <span className="eyebrow">QUEM FAZ ACONTECER</span>
            <h2>Nossa equipe</h2>
          </div>
          <Link to="/equipe" className="text-link">
            Conheça a gestão <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="team-strip">
          {rows
            .filter((r) => r.kind === "member")
            .map((r) => (
              <div key={r.id}>
                <span className="member-initial">
                  {r.data.title
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <h3>{r.data.title}</h3>
                <p>{r.data.role}</p>
              </div>
            ))}
        </div>
      </section>
      <section className="news-section section">
        <div className="container">
          <div className="section-title">
            <div>
              <span className="eyebrow">FIQUE POR DENTRO</span>
              <h2>Últimas novidades</h2>
            </div>
            <a
              href="https://www.instagram.com/gemede.uj/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Acompanhe no Instagram <ArrowUpRight size={17} />
            </a>
          </div>
          {rows.filter((r) => r.kind === "news").length ? (
            rows
              .filter((r) => r.kind === "news")
              .map((r) => (
                <article className="news-card" key={r.id}>
                  <h3>{r.data.title}</h3>
                  <p>{r.data.description}</p>
                </article>
              ))
          ) : (
            <Empty title="Nosso próximo capítulo está sendo preparado.">
              Os comunicados e as novidades oficiais serão publicados aqui.
            </Empty>
          )}
        </div>
      </section>
      <section className="join-section">
        <div className="container">
          <div>
            <span className="eyebrow">VAMOS APRENDER JUNTOS?</span>
            <h2>
              Seu interesse por equinos
              <br />
              tem lugar aqui.
            </h2>
          </div>
          <ButtonLink to="/contato">Entre em contato</ButtonLink>
        </div>
      </section>
    </>
  );
}
