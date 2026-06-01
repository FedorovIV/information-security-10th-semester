import { useMemo, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import Book from "../Информационная безопасность 10-й семестр.mdx";
import ExamAnswers from "../Ответы к зачёту Информационная безопасность 10-й семестр.mdx";
import SelfCheckPage from "./SelfCheckPage.jsx";

const documents = [
  {
    id: "book",
    label: "Книга",
    title: "Информационная безопасность 10-й семестр",
    description: "Единый конспект по лекциям",
    Component: Book,
  },
  {
    id: "exam",
    label: "Ответы",
    title: "Ответы к зачёту",
    description: "Краткие ответы по билетам",
    Component: ExamAnswers,
  },
  {
    id: "questions",
    label: "Самопроверка",
    title: "Вопросы для самопроверки",
    description: "Базовые, обычные и супер-вопросы",
    Component: SelfCheckPage,
  },
];

const mdxComponents = {
  table: (props) => (
    <div className="tableWrap">
      <table {...props} />
    </div>
  ),
};

export default function App() {
  const [activeId, setActiveId] = useState(documents[0].id);
  const activeDocument = useMemo(
    () =>
      documents.find((document) => document.id === activeId) ?? documents[0],
    [activeId],
  );
  const ActiveComponent = activeDocument.Component;

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark">ИБ</span>
          <div>
            <p className="brandTitle">10-й семестр</p>
            <p className="brandMeta">MDX-конспекты</p>
          </div>
        </div>

        <nav className="documentNav" aria-label="Документы">
          {documents.map((document) => (
            <button
              className={
                document.id === activeId ? "navItem active" : "navItem"
              }
              key={document.id}
              onClick={() => setActiveId(document.id)}
              type="button"
            >
              <span>{document.label}</span>
              <small>{document.description}</small>
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Текущий документ</p>
            <h1>{activeDocument.title}</h1>
          </div>
          <a
            className="sourceLink"
            href={sourceHref(activeDocument.id)}
            target="_blank"
            rel="noreferrer"
          >
            Открыть MDX
          </a>
        </header>

        <article className="mdxArticle">
          <MDXProvider components={mdxComponents}>
            <ActiveComponent />
          </MDXProvider>
        </article>
      </main>
    </div>
  );
}

function sourceFileName(id) {
  if (id === "exam") {
    return "Ответы к зачёту Информационная безопасность 10-й семестр.mdx";
  }

  if (id === "questions") {
    return "Вопросы для самопроверки Информационная безопасность 10-й семестр.mdx";
  }

  return "Информационная безопасность 10-й семестр.mdx";
}

function sourceHref(id) {
  return `${import.meta.env.BASE_URL}${encodeURI(sourceFileName(id))}`;
}
