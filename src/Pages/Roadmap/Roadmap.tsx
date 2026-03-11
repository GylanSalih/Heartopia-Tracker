import React from 'react';
import styles from './roadmap.module.scss';
import RoadmapItem from './components/RoadmapItem';
import { CheckCircle, Circle } from 'lucide-react';

interface RoadmapPhase {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'planned';
  items: {
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'planned';
  }[];
}

const Roadmap = (): React.ReactElement => {
  const phases: RoadmapPhase[] = [
    {
      id: 'phase1',
      title: 'Phase 1: Foundation',
      status: 'completed',
      items: [
        {
          title: 'Core Game Engine',
          description: 'Implement base Unity RPG framework with character system',
          status: 'completed'
        },
        {
          title: 'Character Creation',
          description: 'Allow players to create and customize their characters',
          status: 'completed'
        },
        {
          title: 'Combat System',
          description: 'Basic turn-based combat mechanics and animations',
          status: 'completed'
        },
        {
          title: 'Inventory System',
          description: 'Item management and equipment system',
          status: 'completed'
        }
      ]
    },
    {
      id: 'phase2',
      title: 'Phase 2: Expansion',
      status: 'in-progress',
      items: [
        {
          title: 'quest System',
          description: 'Dynamic quest generation and tracking',
          status: 'in-progress'
        },
        {
          title: 'World Building',
          description: 'Explore diverse environments and dungeons',
          status: 'in-progress'
        },
        {
          title: 'NPC System',
          description: 'Interactive NPCs with dialogue trees',
          status: 'planned'
        },
        {
          title: 'Skill Trees',
          description: 'Character progression through skill development',
          status: 'planned'
        }
      ]
    },
    {
      id: 'phase3',
      title: 'Phase 3: Multiplayer',
      status: 'planned',
      items: [
        {
          title: 'Networking',
          description: 'Implement multiplayer server architecture',
          status: 'planned'
        },
        {
          title: 'Co-op Dungeons',
          description: 'Cooperative multiplayer dungeon experiences',
          status: 'planned'
        },
        {
          title: 'PvP Arena',
          description: 'Competitive player vs player battles',
          status: 'planned'
        },
        {
          title: 'Guild System',
          description: 'Create and manage player guilds',
          status: 'planned'
        }
      ]
    },
    {
      id: 'phase4',
      title: 'Phase 4: Live Service',
      status: 'planned',
      items: [
        {
          title: 'Seasonal Content',
          description: 'Regular seasonal events and content updates',
          status: 'planned'
        },
        {
          title: 'Battle Pass',
          description: 'Premium and free battle pass progression',
          status: 'planned'
        },
        {
          title: 'Raids',
          description: 'Challenging end-game raid content',
          status: 'planned'
        },
        {
          title: 'Cosmetics Shop',
          description: 'Character customization and cosmetic items',
          status: 'planned'
        }
      ]
    }
  ];

  return (
    <div className={styles.roadmap}>
      <div className={styles.header}>
        <h1>Development Roadmap</h1>
        <p>Follow the evolution of our Unity RPG adventure</p>
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <CheckCircle size={20} className={styles.completed} />
            <span>Completed</span>
          </div>
          <div className={styles.legendItem}>
            <Circle size={20} className={styles.inProgress} />
            <span>In Progress</span>
          </div>
          <div className={styles.legendItem}>
            <Circle size={20} className={styles.planned} />
            <span>Planned</span>
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        {phases.map((phase, index) => (
          <RoadmapItem
            key={phase.id}
            phase={phase}
            isLast={index === phases.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
