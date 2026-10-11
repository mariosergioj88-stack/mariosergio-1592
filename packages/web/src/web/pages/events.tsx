import { useState } from "react";
import {
  Search,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { useContent, type ContentRow } from "../queries/content";
import {
  PageHeading,
  Empty,
  Loading,
  ErrorState,
  EventModal,
  confirmed,
  localDate,
} from "../components/site";
function EventCard({
  row,
  onSelect,
}: {
  row: ContentRow;
  onSelect: (r: ContentRow) => void;
}) {
  const d = row.data;
  return (
    <button className="event-card" onClick={() => onSelect(row)}>
      <div className="event-card-top">
        <span className="tag">{d.status || "A confirmar"}</span>
        <ArrowUpRight size={20} />
      </div>
      <span className="event-date">
        {d.date
          ? new Date(d.date + "T12:00").toLocaleDateString("pt-BR")
          : `${d.partialDate || "Data a confirmar"} · ano a confirmar`}
      </span>
      <h3>{d.title}</h3>
      <p>{d.speaker || "Palestrante a confirmar"}</p>
      <div className="card-meta">
        <Clock3 size={14} />
        {d.time || "Horário a confirmar"}
      </div>
      <div className="card-meta">
        <CalendarDays size={14} />
        {d.location || "Local a confirmar"}
      </div>
      <span className="text-link">
        Ver detalhes <ArrowUpRight size={14} />
      </span>
    </button>
  );
}
export function Events() {
  const q = useContent();
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("Todos");
  const [theme, setTheme] = useState("Todos");
  const [status, setStatus] = useState("Todas");
  const [selected, setSelected] = useState<ContentRow | null>(null);
  const rows = q.data?.filter((r) => r.kind === "event") || [];
  const filtered = rows.filter(
    (r) =>
      (!search ||
        `${r.data.title} ${r.data.speaker}`
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())) &&
      (year === "Todos" ||
        (year === "Não informado"
          ? !r.data.date
          : r.data.date?.startsWith(year))) &&
      (theme === "Todos" || r.data.theme === theme) &&
      (status === "Todas" || r.data.status === status),
  );
  const current = filtered.filter((r) => r.data.status !== "Realizado");
  const past = filtered.filter((r) => r.data.status === "Realizado");
  return (
    <>
      <PageHeading
        eyebrow="APRENDIZADO EM MOVIMENTO"
        title="Eventos e palestras"
        description="Temas, encontros e atividades acadêmicas para aprofundar seu conhecimento em medicina equina."
      />
      <section className="container section">
        <div className="filters">
          <label className="search-label">
            Buscar atividade
            <div className="search-input">
              <Search size={17} />
              <input
                    aria-label="Buscar atividade"
                placeholder="Nome do evento ou palestrante"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </label>
          <label>
            Ano
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>Todos</option>
              <option>Não informado</option>
              {Array.from(
                new Set(
                  rows.map((r) => r.data.date?.slice(0, 4)).filter(Boolean),
                ),
              ).map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            Tema
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option>Todos</option>
              {Array.from(
                new Set(rows.map((r) => r.data.theme).filter(Boolean)),
              ).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Situação
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {[
                "Todas",
                "A confirmar",
                "Próximo",
                "Em andamento",
                "Realizado",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="info-banner">
          <CalendarDays size={20} />
          <p>
            O cronograma inicial não informa o ano. As datas abaixo aguardam
            confirmação e não são classificadas automaticamente como futuras ou
            realizadas.
          </p>
        </div>
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState />
        ) : (
          <>
            {current.length ? (
              <div className="event-grid">
                {current.map((r) => (
                  <EventCard key={r.id} row={r} onSelect={setSelected} />
                ))}
              </div>
            ) : (
              <Empty title="Nenhuma atividade encontrada.">
                Tente ajustar a busca e os filtros.
              </Empty>
            )}
            <div className="section">
              <span className="eyebrow">HISTÓRICO ACADÊMICO</span>
              <h2>Eventos anteriores</h2>
              {past.length ? (
                <div className="event-grid">
                  {past.map((r) => (
                    <EventCard key={r.id} row={r} onSelect={setSelected} />
                  ))}
                </div>
              ) : (
                <Empty title="Histórico aguardando confirmação.">
                  Os eventos marcados como realizados pela gestão aparecerão
                  aqui.
                </Empty>
              )}
            </div>
          </>
        )}
        <EventModal row={selected} onClose={() => setSelected(null)} />
      </section>
    </>
  );
}
export function Calendar() {
  const q = useContent();
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [view, setView] = useState("month");
  const [selected, setSelected] = useState<ContentRow | null>(null);
  const today = localDate();
  const events =
    q.data?.filter((r) => r.kind === "event" && confirmed(r)) || [];
  const todays = events.filter((r) => r.data.date === today);
  const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const monthEvents = events
    .filter((r) => r.data.date.startsWith(monthKey))
    .sort((a, b) =>
      `${a.data.date}${a.data.time}`.localeCompare(
        `${b.data.date}${b.data.time}`,
      ),
    );
  const count = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const first = month.getDay();
  return (
    <>
      <PageHeading
        eyebrow="NOSSA AGENDA"
        title="Calendário acadêmico"
        description="Organize seus estudos e acompanhe as atividades confirmadas do GEMEDE."
      />
      <section className="container section">
        <div className="today-panel">
          <div>
            <span className="eyebrow">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <h2>O que tem hoje no GEMEDE?</h2>
            {q.isLoading ? (
              <p>Consultando a agenda…</p>
            ) : q.isError ? (
              <p role="alert">Não foi possível consultar a agenda.</p>
            ) : todays.length ? (
              todays.map((r) => (
                <button
                  key={r.id}
                  className="today-event"
                  onClick={() => setSelected(r)}
                >
                  <strong>{r.data.title}</strong>
                  <span>
                    {r.data.time || "Horário a confirmar"} ·{" "}
                    {r.data.location || "Local a confirmar"} · {r.data.speaker}
                  </span>
                </button>
              ))
            ) : (
              <p>Não há atividades programadas para hoje.</p>
            )}
          </div>
          <CalendarDays size={48} />
        </div>
        <div className="calendar-toolbar">
          <div className="month-nav">
            <button
              aria-label="Mês anterior"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              <ChevronLeft />
            </button>
            <h3>
              {month.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              aria-label="Próximo mês"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
            >
              <ChevronRight />
            </button>
            <button
              className="today-button"
              onClick={() =>
                setMonth(
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                )
              }
            >
              Hoje
            </button>
          </div>
          <div className="toggle">
            <button
              className={view === "month" ? "selected" : ""}
              onClick={() => setView("month")}
            >
              Mensal
            </button>
            <button
              className={view === "list" ? "selected" : ""}
              onClick={() => setView("list")}
            >
              Lista
            </button>
          </div>
        </div>
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState />
        ) : view === "month" ? (
          <div className="calendar-grid">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div className="weekday" key={d}>
                {d}
              </div>
            ))}
            {Array.from({ length: first }, (_, i) => (
              <div key={`empty-${i}`} className="calendar-cell inactive" />
            ))}
            {Array.from({ length: count }, (_, i) => {
              const day = i + 1;
              const key = `${monthKey}-${String(day).padStart(2, "0")}`;
              const daily = events.filter((r) => r.data.date === key);
              return (
                <div
                  key={key}
                  className={`calendar-cell ${key === today ? "is-today" : ""}`}
                >
                  <span className="day-number">{day}</span>
                  {daily.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelected(r)}
                      title={r.data.title}
                    >
                      {r.data.time} {r.data.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ) : monthEvents.length ? (
          <div className="event-grid">
            {monthEvents.map((r) => (
              <EventCard key={r.id} row={r} onSelect={setSelected} />
            ))}
          </div>
        ) : (
          <Empty title="Este mês ainda não tem atividades cadastradas.">
            As atividades aparecerão assim que a gestão confirmar as datas.
          </Empty>
        )}
        <div className="calendar-legend">
          <span>
            <i />
            Hoje
          </span>
          <span>
            <i />
            Atividade confirmada
          </span>
        </div>
        <p className="note">
          Eventos sem ano ou situação confirmada ficam disponíveis em Eventos e
          palestras, mas não entram no calendário. Datas comemorativas serão
          incluídas somente após confirmação da gestão.
        </p>
        <EventModal row={selected} onClose={() => setSelected(null)} />
      </section>
    </>
  );
}
