import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  Instagram,
  Mail,
  Menu,
  X,
  MapPin,
  ArrowRight,
} from "lucide-react";
import type { ContentRow } from "../queries/content";
export const navigation = [
  ["/", "Início"],
  ["/sobre", "Sobre o GEMEDE"],
  ["/equipe", "Nossa equipe"],
  ["/eventos", "Eventos e palestras"],
  ["/semeq", "SEMEQ"],
  ["/calendario", "Calendário"],
  ["/quiz", "Quiz"],
  ["/galeria", "Galeria"],
  ["/contato", "Contato"],
];
export function Layout({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    const title = navigation.find((n) => n[0] === path)?.[1] || "Gestão";
    document.title = `${title} | GEMEDE — Unijorge`;
  }, [path]);
  return (
    <>
      <div className="topline">
        <span>GRUPO DE ESTUDOS EM MEDICINA EQUINA</span>
        <span>
          Unijorge · Campus Paralela <i />{" "}
          <a
            href="https://www.instagram.com/gemede.uj/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={13} />
          </a>
        </span>
      </div>
      <header className="header">
        <Link to="/" className="brand">
          <img src="/images/gemede-logo.jpeg" alt="Logo oficial do GEMEDE" />
          <div>
            <strong>GEMEDE</strong>
            <small>Medicina Equina · Unijorge</small>
          </div>
        </Link>
        <nav
          className={open ? "navigation open" : "navigation"}
          aria-label="Navegação principal"
        >
          {navigation.map(([url, label]) => (
            <Link
              key={url}
              to={url}
              className={`${path === url ? "active" : ""} ${url === "/semeq" ? "semeq-link" : ""}`}
            >
              {label}
              {url === "/semeq" && <ArrowUpRight size={13} />}
            </Link>
          ))}
        </nav>
        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
      <main>{children}</main>
      <footer>
        <div className="footer-main">
          <div>
            <Link to="/" className="brand">
              <img src="/images/gemede-logo.jpeg" alt="GEMEDE" />
              <div>
                <strong>GEMEDE</strong>
                <small>Grupo de Estudos em Medicina Equina</small>
              </div>
            </Link>
            <p>
              Ciência, prática e paixão pelos equinos.
              <br />
              Construindo conhecimento, juntos.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/sobre">Sobre o grupo</Link>
            <Link to="/eventos">Eventos e palestras</Link>
            <Link to="/quiz">Quiz de medicina equina</Link>
          </div>
          <div>
            <h4>Fale com o GEMEDE</h4>
            <a
              href="https://www.instagram.com/gemede.uj/"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={16} /> @gemede.uj
            </a>
            <a href="mailto:gemedequina@gmail.com">
              <Mail size={16} /> gemedequina@gmail.com
            </a>
            <span>
              <MapPin size={16} /> Unijorge · Campus Paralela
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            GEMEDE — Unijorge · Conhecimento a serviço da Medicina Equina.
          </span>
          <Link to="/admin">
            Área da gestão <ArrowUpRight size={13} />
          </Link>
        </div>
      </footer>
    </>
  );
}
export function ButtonLink({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link to={to} className={secondary ? "button secondary" : "button"}>
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-heading">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function Empty({
  title = "Conteúdo em preparação",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <span className="empty-line" />
      <h3>{title}</h3>
      <p>
        {children ||
          "As informações serão publicadas após confirmação da gestão."}
      </p>
    </div>
  );
}
export function Loading() {
  return (
    <output className="container loading">
      Carregando conteúdo do GEMEDE…
    </output>
  );
}
export function ErrorState() {
  return (
    <div className="container empty" role="alert">
      <h3>Não foi possível carregar o conteúdo.</h3>
      <p>Verifique sua conexão e tente novamente.</p>
      <button className="button" onClick={() => window.location.reload()}>
        Tentar novamente
      </button>
    </div>
  );
}
export function EventModal({
  row,
  onClose,
}: {
  row: ContentRow | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!row) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [row, onClose]);
  if (!row) return null;
  const d = row.data;
  return (
    <div className="modal-backdrop">
      <dialog open
        className="modal"
        aria-modal="true"
        aria-label={d.title}
      >
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          <X />
        </button>
        <span className="eyebrow">ATIVIDADE ACADÊMICA</span>
        <h2>{d.title}</h2>
        {d.image && (
          <img className="poster" src={d.image} alt={`Cartaz: ${d.title}`} />
        )}
        <span className="tag">{d.status || "A confirmar"}</span>
        <dl>
          <dt>Data</dt>
          <dd>
            {d.date
              ? new Date(`${d.date}T12:00`).toLocaleDateString("pt-BR")
              : `${d.partialDate || "A confirmar"} · ano a confirmar`}
          </dd>
          <dt>Horário</dt>
          <dd>{d.time || "A confirmar"}</dd>
          <dt>Palestrante</dt>
          <dd>{d.speaker || "A confirmar"}</dd>
          <dt>Local</dt>
          <dd>{d.location || "A confirmar"}</dd>
          <dt>Tema</dt>
          <dd>{d.theme || d.title}</dd>
        </dl>
        <p>{d.description}</p>
      </dialog>
    </div>
  );
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function confirmed(row: ContentRow) {
  return (
    Boolean(row.data.date) &&
    ["Próximo", "Em andamento", "Realizado"].includes(row.data.status)
  );
}
