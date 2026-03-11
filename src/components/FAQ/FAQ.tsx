import React, { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './faq.module.scss';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_ITEMS: FAQItem[] = [
  {
    id: 'q1',
    question: 'What kind of game is Lost Dreams of Tomorrow?',
    answer: 'Lost Dreams of Tomorrow is a 2D indie RPG platformer. You explore handcrafted worlds, battle unique enemies, solve environmental puzzles and uncover a deep story — all wrapped in a dark pixel-art aesthetic.'
  },
  {
    id: 'q2',
    question: 'Is the game free to play?',
    answer: 'Yes — completely free. There are no pay-to-win mechanics, no loot boxes. Any future optional purchases are purely cosmetic and never affect gameplay or progression.'
  },
  {
    id: 'q3',
    question: 'What platforms will the game be available on?',
    answer: 'The initial release targets PC (Windows & Linux). Mac support and a potential console port are planned in later phases depending on community growth.'
  },
  {
    id: 'q4',
    question: 'How long is the game?',
    answer: 'The first release contains around 8–12 hours of core content depending on your playstyle. Side quests, hidden areas and collectibles add significant replayability on top of that.'
  },
  {
    id: 'q5',
    question: 'Will there be controller support?',
    answer: 'Yes. Full gamepad support is built in from day one. The game is designed to feel natural whether you prefer keyboard, controller or a mix of both.'
  },
  {
    id: 'q6',
    question: 'How often does new content drop?',
    answer: 'Major content updates are planned every 2–3 months, each adding new zones, story chapters and mechanics. Hotfixes and balance patches ship as needed in between.'
  }
];

interface FAQProps {
  items?: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items = DEFAULT_ITEMS }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = useCallback((id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  }, []);

  return (
    <section className={styles.faq} aria-label="Frequently Asked Questions">
      <div className={styles.header}>
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know before you dive in</p>
      </div>

      <div className={styles.container}>
        <div className={styles.accordion} role="list">
          {items.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`${styles.item} ${isOpen ? styles.open : ''}`}
                role="listitem"
              >
                <button
                  className={styles.question}
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-question-${item.id}`}
                >
                  <span className={styles.text}>{item.question}</span>
                  <span className={styles.iconWrapper} aria-hidden="true">
                    <ChevronDown
                      size={18}
                      className={styles.icon}
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div
                    className={styles.answerWrapper}
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                  >
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;