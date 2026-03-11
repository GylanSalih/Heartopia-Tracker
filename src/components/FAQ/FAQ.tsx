import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './faq.module.scss';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  items?: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({
  items = [
    {
      id: 'q1',
      question: 'What is PetalStack RPG?',
      answer: 'PetalStack RPG is a comprehensive Unity-based role-playing game featuring deep character progression, engaging combat mechanics, and a rich world filled with quests and mysteries to explore.'
    },
    {
      id: 'q2',
      question: 'Is the game free to play?',
      answer: 'Yes, PetalStack RPG is free to play. We offer optional cosmetic purchases that do not affect gameplay balance or progression.'
    },
    {
      id: 'q3',
      question: 'What platforms is it available on?',
      answer: 'Currently, PetalStack RPG is available on PC and consoles. Mobile versions are in development and will be released in future phases.'
    },
    {
      id: 'q4',
      question: 'Can I play with friends?',
      answer: 'Yes! Phase 3 includes multiplayer features including co-op dungeons and a competitive PvP arena. You can also join guilds and play with friends.'
    },
    {
      id: 'q5',
      question: 'How often does the game get updated?',
      answer: 'We release seasonal content updates every 3-4 months with new quests, dungeons, items, and features. Regular balance patches are deployed as needed.'
    },
    {
      id: 'q6',
      question: 'What is the level cap?',
      answer: 'The current level cap is 200, but we continuously expand the endgame content and progression systems with each major update.'
    }
  ]
}) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={styles.faq}>
      <div className={styles.header}>
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about PetalStack RPG</p>
      </div>

      <div className={styles.container}>
        <div className={styles.accordion}>
          {items.map((item) => (
            <div
              key={item.id}
              className={`${styles.item} ${openId === item.id ? styles.open : ''}`}
            >
              <button
                className={styles.question}
                onClick={() => toggleAccordion(item.id)}
                aria-expanded={openId === item.id}
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={24}
                  className={styles.icon}
                />
              </button>

              {openId === item.id && (
                <div className={styles.answerWrapper}>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
