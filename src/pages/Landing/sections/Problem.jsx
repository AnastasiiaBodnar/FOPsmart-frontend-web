import React from "react";
import "./Problem.css";

// SVG іконки в стилі Lucide
const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ef4444"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10b981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const problems = [
  {
    problem: "Не знаю, скільки ще можу заробити до кінця року",
    solution: "Статус ліміту в реальному часі з точним залишком у гривнях",
  },
  {
    problem: "Забуваю про ліміти до кінця року",
    solution: "Автоматичні попередження при 80% та 90% використання",
  },
  {
    problem: "Важко зробити звіт для бухгалтера",
    solution: "PDF звіти одним кліком за будь-який період",
  },
  {
    problem: "Не розумію на що йдуть гроші",
    solution: "Аналітика витрат по категоріях з візуалізацією",
  },
];

const Problem = () => {
  return (
    <section className="problems-section" id="problems">
      <div className="section-header">
        <h2>Розв'язуємо реальні проблеми ФОПів</h2>
        <p>Знайомі болі? Ми їх вирішили</p>
      </div>

      <div className="problems-grid">
        {problems.map((item, index) => (
          <div className="problem-card" key={index}>
            <div className="problem-header">
              <div className="problem-icon">
                <IconX />
              </div>
              <div className="problem-title">{item.problem}</div>
            </div>

            <div className="divider"></div>

            <div className="solution-header">
              <div className="solution-icon">
                <IconCheck />
              </div>
              <div className="solution-text">{item.solution}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Problem;
