import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import styles from './roadmapItem.module.scss';

interface RoadmapItemProps {
  phase: {
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'planned';
    items: {
      title: string;
      description: string;
      status: 'completed' | 'in-progress' | 'planned';
    }[];
  };
  isLast: boolean;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ phase, isLast }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.completed;
      case 'in-progress':
        return styles.inProgress;
      default:
        return styles.planned;
    }
  };

  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.phaseCompleted;
      case 'in-progress':
        return styles.phaseInProgress;
      default:
        return styles.phasePlanned;
    }
  };

  return (
    <div className={`${styles.item} ${!isLast ? styles.hasLine : ''}`}>
      <div className={`${styles.dot} ${getPhaseColor(phase.status)}`} />
      
      <div className={styles.content}>
        <div className={styles.phaseHeader}>
          <h2>{phase.title}</h2>
          <span className={`${styles.badge} ${getPhaseColor(phase.status)}`}>
            {phase.status === 'completed' && 'Completed'}
            {phase.status === 'in-progress' && 'In Progress'}
            {phase.status === 'planned' && 'Planned'}
          </span>
        </div>

        <div className={styles.itemsList}>
          {phase.items.map((item, index) => (
            <div
              key={index}
              className={`${styles.listItem} ${getStatusColor(item.status)}`}
            >
              <div className={styles.icon}>
                {item.status === 'completed' ? (
                  <CheckCircle size={18} />
                ) : (
                  <Circle size={18} />
                )}
              </div>
              <div className={styles.text}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapItem;
