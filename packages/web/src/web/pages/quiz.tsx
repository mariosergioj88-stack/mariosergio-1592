import { useState } from "react";
import {
  Brain,
  ArrowRight,
  Check,
  RotateCcw,
  Trophy,
  BookOpen,
} from "lucide-react";
import { useContent, type ContentRow } from "../queries/content";
import { PageHeading, Empty, Loading, ErrorState } from "../components/site";
export const categories = [
  "Anatomia e fisiologia equina",
  "Clínica médica de equinos",
  "Síndrome cólica equina",
  "Cirurgia de grandes animais",
  "Reprodução equina",
  "Nutrição e manejo",
  "Doenças infecciosas e parasitárias",
  "Diagnóstico por imagem",
  "Emergências veterinárias",
];
export const levels = ["Básico", "Intermediário", "Avançado"];
export default function Quiz() {
  const q = useContent();
  const [category, setCategory] = useState("Todas as categorias");
  const [level, setLevel] = useState("Todos os níveis");
  const [questions, setQuestions] = useState<ContentRow[]>([]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [review, setReview] = useState(false);
  const available = (q.data || []).filter(
    (r) =>
      r.kind === "question" &&
      (category === "Todas as categorias" || r.data.category === category) &&
      (level === "Todos os níveis" || r.data.level === level),
  );
  const answered = answers.length > index;
  const finished = started && index >= questions.length;
  const current = questions[index];
  const score = questions.reduce(
    (s, r, i) => s + (answers[i] === Number(r.data.correct) ? 1 : 0),
    0,
  );
  function reset() {
    setStarted(false);
    setIndex(0);
    setChoice(null);
    setAnswers([]);
    setReview(false);
  }
  return (
    <>
      <PageHeading
        eyebrow="APRENDA. PRATIQUE. EVOLUA."
        title="Quiz de medicina equina"
        description="Teste seus conhecimentos, entenda cada resposta e descubra novos caminhos de estudo."
      />
      <section className="container section quiz-container">
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState />
        ) : !started ? (
          <div className="quiz-start">
            <div className="quiz-intro">
              <Brain size={44} />
              <h2>
                Conhecimento se fortalece
                <br />
                <em>com a prática.</em>
              </h2>
              <p>
                Escolha seu tema e nível de dificuldade. Cada questão tem quatro
                alternativas e uma resposta correta, acompanhada de explicação e
                fonte para aprofundamento.
              </p>
              <div className="quiz-benefits">
                <span>
                  <Check size={16} />
                  Feedback após cada resposta
                </span>
                <span>
                  <Check size={16} />
                  Pontuação e revisão ao final
                </span>
                <span>
                  <Check size={16} />
                  No seu ritmo, sem cronômetro
                </span>
              </div>
            </div>
            <div className="quiz-settings">
              <h3>Prepare seu desafio</h3>
              <label>
                Categoria
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Todas as categorias</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Dificuldade
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option>Todos os níveis</option>
                  {levels.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>
              <p className="question-count">
                {available.length} questões disponíveis nesta seleção
              </p>
              {available.length ? (
                <button
                  className="button"
                  onClick={() => {
                    setQuestions(
                      [...available].sort(() => Math.random() - 0.5),
                    );
                    setStarted(true);
                  }}
                >
                  Começar quiz <ArrowRight size={18} />
                </button>
              ) : (
                <Empty title="Banco em expansão.">
                  Ainda não há questões para essa combinação. Escolha outra
                  categoria ou dificuldade.
                </Empty>
              )}
            </div>
          </div>
        ) : finished ? (
          <div className="quiz-results">
            <Trophy size={46} />
            <span className="eyebrow">DESAFIO CONCLUÍDO</span>
            <h2>Mais um passo no seu aprendizado.</h2>
            <div className="score">
              <strong>
                {Math.round((score / questions.length) * 100)}
                <small>%</small>
              </strong>
              <p>
                {score} de {questions.length} respostas corretas
              </p>
            </div>
            <div className="result-actions">
              <button className="button" onClick={() => setReview(!review)}>
                <BookOpen size={17} />
                {review ? "Ocultar revisão" : "Revisar respostas"}
              </button>
              <button className="button secondary" onClick={reset}>
                <RotateCcw size={17} />
                Refazer o quiz
              </button>
            </div>
            {review && (
              <div className="review-list">
                {questions.map((r, i) => (
                  <article key={r.id}>
                    <span
                      className={`tag ${answers[i] === Number(r.data.correct) ? "correct-tag" : "incorrect-tag"}`}
                    >
                      {answers[i] === Number(r.data.correct)
                        ? "Correta"
                        : "Incorreta"}
                    </span>
                    <h3>
                      {i + 1}. {r.data.title}
                    </h3>
                    <p>
                      Sua resposta: {r.data.options.split("\n")[answers[i]]}
                    </p>
                    <p>
                      <strong>Resposta correta:</strong>{" "}
                      {r.data.options.split("\n")[Number(r.data.correct)]}
                    </p>
                    <p>{r.data.explanation}</p>
                    {r.data.source && (
                      <a
                        className="source"
                        href={r.data.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Consultar fonte
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          current && (
            <div className="quiz-question">
              <div className="quiz-question-top">
                <span>
                  Questão {index + 1} de {questions.length}
                </span>
                <button onClick={reset}>Sair do quiz</button>
              </div>
              <div className="progress">
                <span
                  style={{
                    width: `${(answers.length / questions.length) * 100}%`,
                  }}
                />
              </div>
              <div className="question-tags">
                <span className="tag">{current.data.category}</span>
                <span className="tag">{current.data.level}</span>
              </div>
              <h2>{current.data.title}</h2>
              <div className="options">
                {current.data.options.split("\n").map((option, i) => (
                  <button
                    disabled={answered}
                    onClick={() => setChoice(i)}
                    key={i}
                    className={`${choice === i ? "chosen" : ""} ${answered && i === Number(current.data.correct) ? "correct" : ""} ${answered && i === choice && i !== Number(current.data.correct) ? "incorrect" : ""}`}
                  >
                    <span>{String.fromCharCode(65 + i)}</span>
                    {option}
                    {answered && i === Number(current.data.correct) && (
                      <Check size={20} />
                    )}
                  </button>
                ))}
              </div>
              {answered ? (
                <>
                  <div
                    className={`feedback ${answers[index] === Number(current.data.correct) ? "good" : "bad"}`}
                  >
                    <h3>
                      {answers[index] === Number(current.data.correct)
                        ? "Resposta correta."
                        : "Vamos aprender com essa resposta."}
                    </h3>
                    <p>{current.data.explanation}</p>
                    {current.data.source && (
                      <a
                        href={current.data.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Consultar fonte de estudo
                      </a>
                    )}
                  </div>
                  <button
                    className="button"
                    onClick={() => {
                      setIndex(index + 1);
                      setChoice(null);
                    }}
                  >
                    {index === questions.length - 1
                      ? "Ver resultado"
                      : "Próxima questão"}
                    <ArrowRight size={17} />
                  </button>
                </>
              ) : (
                <button
                  className="button"
                  disabled={choice === null}
                  onClick={() => setAnswers([...answers, choice!])}
                >
                  Confirmar resposta
                  <Check size={17} />
                </button>
              )}
            </div>
          )
        )}
        <p className="note quiz-disclaimer">
          Conteúdo educativo para estudo. Não substitui avaliação clínica,
          orientação docente ou atendimento médico-veterinário. O banco inicial
          está em expansão e pode ser revisado pela gestão.
        </p>
      </section>
    </>
  );
}
