import React from 'react';
import './Features.css';

/* Набір компактних іконок у Lucide-стилі */
const IconLimit = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 3v18h18" />
    <path d="M7 17l4-6 4 3 3-6" />
  </svg>
);

const IconBank = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10h18" />
    <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
    <path d="M12 4L3 10h18L12 4Z" />
  </svg>
);

const IconAnalytics = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 13l3-3 2 2 4-4" />
    <path d="M7 17h10" />
  </svg>
);

const IconPdf = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2V4h2z" />
    <path d="M18 8h-4M18 12h-4M16 16h-2" />
  </svg>
);

const IconBell = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </svg>
);

const IconFilter = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </svg>
);

const features = [
  {
    icon: <IconLimit />,
    title: 'Контроль ліміту в реальному часі',
    description:
      'Завжди знай, скільки ще можеш заробити. Автоматичні попередження при 80%, 90% та 100% використання річного ліміту.',
  },
  {
    icon: <IconBank />,
    title: 'Інтеграція з Monobank',
    description:
      'Автоматична синхронізація транзакцій з ФОП рахунків. Безпечне шифрування токену та розпізнавання типу рахунку.',
  },
  {
    icon: <IconAnalytics />,
    title: 'Детальна аналітика',
    description:
      'Доходи та витрати за день/тиждень/місяць. Розбивка по категоріях (MCC коди) та візуалізація трендів.',
  },
  {
    icon: <IconPdf />,
    title: 'PDF звіти',
    description:
      'Генеруй повні фінансові звіти або швидкі зводки одним кліком. Ідеально для бухгалтера.',
  },
  {
    icon: <IconBell />,
    title: 'Розумні сповіщення',
    description:
      'Отримуй попередження про наближення до ліміту. Ніяких сюрпризів наприкінці року.',
  },
  {
    icon: <IconFilter />,
    title: 'Фільтрація транзакцій',
    description:
      'Автоматичне розділення ФОП та особистих транзакцій. Плутанина в минулому.',
  },
];

const Features = () => (
  <section className="features" id="features">
    <div className="container">
      <h2 className="section-title">Головні можливості</h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
