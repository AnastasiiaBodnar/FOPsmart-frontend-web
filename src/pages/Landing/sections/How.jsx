import React from 'react';
import './How.css';

const How = () => {
  const steps = [
    {
      number: 1,
      title: 'Реєстрація',
      description: 'Обери свою ФОП групу (1, 2 або 3) та вкажи базову інформацію. Система автоматично налаштує ліміти.'
    },
    {
      number: 2,
      title: 'Підключення Monobank',
      description: 'Введи свій API токен Monobank. Ми безпечно зашифруємо його та знайдемо твої ФОП рахунки.'
    },
    {
      number: 3,
      title: 'Синхронізація',
      description: 'Система завантажить транзакції за останні 31 день та автоматично оновить статистику доходів.'
    },
    {
      number: 4,
      title: 'Моніторинг',
      description: 'Відстежуй доходи в Dashboard, отримуй сповіщення та генеруй звіти коли потрібно.'
    }
  ];

  return (
    <section className="how-it-works" id="how">
      <div className="container">
        <div className="how-it-works-intro">
          <h2>Як це працює?</h2>
          <p>Жодних складнощів — лише 4 прості кроки</p>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.number}>
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default How;