import { useMemo, useState } from "react";
import { selfCheckGroups } from "./selfCheckData.js";

const levelOrder = [
  "Базовые вопросы",
  "Обычные вопросы",
  "Супер-вопросы",
  "Мини-кейсы для устной тренировки"
];

export default function SelfCheckPage() {
  const [query, setQuery] = useState("");
  const [activeLevel, setActiveLevel] = useState("Все");
  const [openAnswers, setOpenAnswers] = useState(() => new Set());

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return selfCheckGroups
      .filter((group) => activeLevel === "Все" || group.level === activeLevel)
      .map((group) => ({
        ...group,
        questions: group.questions.filter((item) => {
          if (!normalizedQuery) {
            return true;
          }

          return (
            item.question.toLowerCase().includes(normalizedQuery) ||
            item.answer.toLowerCase().includes(normalizedQuery)
          );
        })
      }))
      .filter((group) => group.questions.length > 0);
  }, [activeLevel, query]);

  return (
    <section className="selfCheck">
      <h1>Вопросы для самопроверки</h1>
      <p className="lead">
        Вопросы кликабельны: нажми на вопрос, чтобы перейти к ориентиру ответа.
        Ответы короткие, чтобы ими было удобно гонять себя устно и просить чат проверить формулировку.
      </p>

      <div className="studyControls" aria-label="Фильтры самопроверки">
        <input
          aria-label="Поиск по вопросам и ответам"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск: RBAC, STRIDE, риск..."
          type="search"
          value={query}
        />

        <div className="levelTabs" role="tablist" aria-label="Уровни вопросов">
          {["Все", ...levelOrder].map((level) => (
            <button
              className={level === activeLevel ? "levelTab active" : "levelTab"}
              key={level}
              onClick={() => setActiveLevel(level)}
              type="button"
            >
              {level.replace(" вопросы", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="questionIndex">
        {filteredGroups.map((group) => (
          <section className="questionGroup" id={group.id} key={group.id}>
            <p className="groupLevel">{group.level}</p>
            <h2>{group.title}</h2>
            <ol>
              {group.questions.map((item) => (
                <li key={item.id}>
                  <a href={`#answer-${item.id}`} onClick={(event) => openAnswer(event, item.id)}>
                    {item.question}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <h2 id="answers">Ответы</h2>

      <div className="answerList">
        {filteredGroups.map((group) => (
          <section className="answerGroup" key={`${group.id}-answers`}>
            <p className="groupLevel">{group.level}</p>
            <h3>{group.title}</h3>
            {group.questions.map((item, index) => (
              <details
                className="answerCard"
                id={`answer-${item.id}`}
                key={item.id}
                onToggle={(event) => syncOpenState(item.id, event.currentTarget.open)}
                open={openAnswers.has(item.id)}
              >
                <summary>
                  <span>{index + 1}.</span>
                  {item.question}
                </summary>
                <p>{item.answer}</p>
                <a className="backLink" href={`#${group.id}`}>К списку вопросов</a>
              </details>
            ))}
          </section>
        ))}
      </div>
    </section>
  );

  function openAnswer(event, id) {
    event.preventDefault();
    setOpenAnswers((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });

    window.history.replaceState(null, "", `#answer-${id}`);
    window.requestAnimationFrame(() => {
      document.getElementById(`answer-${id}`)?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  function syncOpenState(id, isOpen) {
    setOpenAnswers((current) => {
      const next = new Set(current);
      if (isOpen) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }
}
