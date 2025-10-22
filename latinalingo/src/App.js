import React, { useEffect, useState } from "react";
import "./App.css";

/*
  Просте веб-додаток для тренування давньогрецьких слів.
  UI українською. Два режими: вибір відповіді і написати українською.
*/

const VOCAB = [
  { gr: "ἀγγέλλω", ua: "повідомляти" },
  { gr: "ἄγω", ua: "вести" },
  { gr: "ἀεί", ua: "завжди" },
  { gr: "ἀκούω", ua: "слухати" },
  { gr: "ἀλλά", ua: "але, однак" },
  { gr: "βαδίζω", ua: "йти" },
  { gr: "βαίνω", ua: "йти" },
  { gr: "βάλλω", ua: "кидати" },
  { gr: "βᾰσῐλεύω", ua: "царювати" },
  { gr: "βλάπτω", ua: "заважати; шкодити" },
  { gr: "γιγνώσκω", ua: "пізнавати; вважати" },
  { gr: "γράφω", ua: "писати" },
  { gr: "δῐδάσκω", ua: "навчати" },
  { gr: "δῐκάζω", ua: "судити" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Header({ onGoLearn }) {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">Λ</div>
        <div>
          <h1 className="title">Латинолюб</h1>
          <div className="subtitle">Вивчай давньогрецьку українською</div>
        </div>
      </div>

      <nav className="nav">
        <button className="nav-btn" onClick={() => window.scrollTo(0, 0)}>
          Головна
        </button>
        <button className="nav-btn primary" onClick={onGoLearn}>
          Вправи
        </button>
        <button className="nav-btn disabled" disabled title="Поки неактивно">
          Вчити Латинську мову
        </button>
      </nav>
    </header>
  );
}

export default function App() {
  const [view, setView] = useState("menu"); // menu | learn | quiz | result
  const [mode, setMode] = useState("choice"); // choice | write
  const [deck, setDeck] = useState(() => shuffle(VOCAB));
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (mode === "choice" && view === "quiz") prepareChoices();
    // eslint-disable-next-line
  }, [index, mode, view]);

  function resetAndStart(chosenMode) {
    const newDeck = shuffle(VOCAB);
    setDeck(newDeck);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setInput("");
    setShowAnswer(false);
    setMode(chosenMode);
    setView("quiz");
  }

  function prepareChoices() {
    const correct = deck[index];
    const others = shuffle(VOCAB.filter((v) => v.gr !== correct.gr)).slice(0, 3);
    const opts = shuffle([correct, ...others]);
    setChoices(opts);
  }

  function checkChoice(opt) {
    if (showAnswer) return;
    setSelected(opt.gr);
    const correct = deck[index];
    const isCorrect = opt.gr === correct.gr;
    if (isCorrect) setScore((s) => s + 1);
    setShowAnswer(true);
  }

  function submitWrite() {
    if (showAnswer) return;
    const correct = deck[index];
    const normInput = input.trim().toLowerCase();
    const target = correct.ua.toLowerCase();
    // простая нормализация: принимаем совпадение по подстроке перед ';' или точным соответствием
    const targetMain = target.split(";")[0].trim();
    const isCorrect =
      normInput === targetMain ||
      targetMain.includes(normInput) ||
      normInput.includes(targetMain);
    if (isCorrect) setScore((s) => s + 1);
    setShowAnswer(true);
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      setView("result");
    } else {
      setIndex(nextIndex);
      setSelected(null);
      setInput("");
      setShowAnswer(false);
    }
  }

  function menuView() {
    return (
      <main className="container">
        <section className="panel">
          <h2>Почати</h2>
          <p className="muted">
            Обери режим: швидкий квіз з вибором відповіді або тренування з написання.
          </p>

          <div className="actions">
            <button className="btn green" onClick={() => resetAndStart("choice")}>
              Квіз: Вибір відповіді
            </button>
            <button className="btn blue" onClick={() => resetAndStart("write")}>
              Квіз: Написати українською
            </button>
            <button className="btn yellow" onClick={() => setView("learn")}>
              Перегляд словника
            </button>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-label">Слів у наборі</div>
              <div className="stat-value">{VOCAB.length}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Поточний режим</div>
              <div className="stat-value">{mode === "choice" ? "Вибір" : "Написати"}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Останній рахунок</div>
              <div className="stat-value">{score}/{deck.length}</div>
            </div>
          </div>
        </section>

        <aside className="panel side">
          <h3>Корисні підказки</h3>
          <ul>
            <li>Повторюй слова в різних режимах (вибір + написання).</li>
            <li>Під час написання приймаються основні варіанти перекладу.</li>
            <li>Після квізу переглянь помилки й повтори їх.</li>
          </ul>
        </aside>
      </main>
    );
  }

  function learnView() {
    return (
      <main className="container full">
        <section className="panel">
          <h2>Словник</h2>
          <div className="vocab-grid">
            {VOCAB.map((v) => (
              <div key={v.gr} className="vocab-card">
                <div className="gr-word">{v.gr}</div>
                <div className="ua-word">{v.ua}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  function quizView() {
    const current = deck[index];
    return (
      <main className="container full">
        <section className="panel">
          <div className="quiz-header">
            <div>
              <div className="muted">Запитання {index + 1} з {deck.length}</div>
              <h2 className="big">{current.gr}</h2>
              <div className="muted">Переклад — українською</div>
            </div>
            <div className="score">Рахунок: <strong>{score}</strong></div>
          </div>

          <div className="quiz-body">
            {mode === "choice" && (
              <div className="choices">
                {choices.map((c) => {
                  const isSelected = selected === c.gr;
                  const correct = deck[index].gr === c.gr;
                  let cls = "choice";
                  if (showAnswer) {
                    if (isSelected) cls += correct ? " correct" : " wrong";
                    if (!isSelected && correct) cls += " correct";
                  }
                  return (
                    <button
                      key={c.gr}
                      className={cls}
                      onClick={() => checkChoice(c)}
                      disabled={showAnswer}
                    >
                      <div className="choice-ua">{c.ua}</div>
                      <div className="choice-gr">{c.gr}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {mode === "write" && (
              <div className="write-mode">
                <label className="muted">Напишіть український переклад:</label>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Введіть переклад..."
                  className="text-input"
                  disabled={showAnswer}
                />
                <div className="row">
                  <button className="btn primary" onClick={submitWrite} disabled={showAnswer}>Перевірити</button>
                  <button className="btn" onClick={() => setInput("")}>Очистити</button>
                </div>
              </div>
            )}

            {showAnswer && (
              <div className="answer-box">
                <div className="muted">Правильна відповідь:</div>
                <div className="answer-main">{current.ua}</div>
                <div className="muted small">({current.gr})</div>
              </div>
            )}

            <div className="quiz-actions">
              <button className="btn" onClick={() => setView("menu")}>Вийти</button>
              <button className="btn green" onClick={next}>{index + 1 >= deck.length ? "Завершити" : "Далі"}</button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  function resultView() {
    return (
      <main className="container full center">
        <section className="panel narrow">
          <h2>Результат</h2>
          <p>Ви відповіли правильно на <strong>{score}</strong> з <strong>{deck.length}</strong>.</p>
          <div className="actions">
            <button className="btn primary" onClick={() => resetAndStart(mode)}>Повторити</button>
            <button className="btn" onClick={() => setView("menu")}>До меню</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app">
      <Header onGoLearn={() => setView("learn")} />

      {view === "menu" && menuView()}
      {view === "learn" && learnView()}
      {view === "quiz" && quizView()}
      {view === "result" && resultView()}

      <footer className="footer">© Латинолюб — тренуй давньогрецьку. Інтерфейс українською.</footer>
    </div>
  );
}
