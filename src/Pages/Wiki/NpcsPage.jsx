import React, { useState } from 'react';
import { getImgSrc } from '../Tracker/data/trackerData';
import { useTrackerState } from '../../hooks/useTrackerState';
import styles from '../wiki.module.scss';

const NPCS = [
  {
    name: 'Bob',
    title: 'Furniture Merchant',
    category: 'Shop',
    location: 'Town Center',
    unlock: 'Tutorial',
    description:
      "Our grandpa's a handyman! Furniture displays change every Saturday at 6 AM and last for a week. Talk to him to access natural building materials for your plot.",
    items: 'Furniture, Building materials',
    refresh: 'Updates every Saturday at 6 AM',
    lovedGifts: 'Tools, Construction Materials',
  },
  {
    name: 'Annie',
    title: 'Music & Emote Shop',
    category: 'Shop',
    location: 'Town (near starting area)',
    unlock: 'Available from start',
    description: 'Music and friendship speak to her! Her shop has instruments, emojis, and animations.',
    items: 'Instruments, Emotes, Animations',
    refresh: 'Daily sales',
    lovedGifts: 'Music items',
  },
  {
    name: 'Dorothee',
    title: 'Fashion Merchant',
    category: 'Shop',
    location: 'Town',
    unlock: 'Available from start',
    description: 'Fashion lover who sells clothes and shoes. Her shop inventory changes frequently.',
    items: 'Clothes, Shoes, Accessories',
    refresh: 'Daily',
    lovedGifts: 'Fashion items',
  },
  {
    name: 'Ka Ching',
    title: 'Collectibles Merchant',
    category: 'Shop',
    location: 'City (near Suburban Lake)',
    unlock: 'Visit City',
    description: 'Runs a shop full of collectible puzzles and rare curiosities.',
    items: 'Collectible puzzles',
    refresh: 'Unknown',
    lovedGifts: 'Collectibles',
  },
  {
    name: 'Blanc',
    title: 'Gardening Mentor',
    category: 'Mentor',
    location: 'Gardening Shop',
    unlock: 'Tutorial',
    description: 'Expert gardener who sells seeds and teaches players how to grow crops.',
    items: 'Seeds, Gardening items',
    refresh: '—',
    lovedGifts: 'Plants, Crops',
  },
  {
    name: 'Vanya',
    title: 'Fishing Mentor',
    category: 'Mentor',
    location: 'Riverside Dock',
    unlock: 'Tutorial (after first nap)',
    description: 'A fishing expert who introduces you to fishing early in the game.',
    items: 'Fishing rod, Fish display items',
    refresh: '—',
    lovedGifts: 'Fish',
  },
  {
    name: 'Massimo',
    title: 'Cooking Mentor',
    category: 'Mentor',
    location: 'Cafe',
    unlock: 'Developer Level 6 + Hobby Expansion Ticket',
    description: 'Chef who teaches cooking and sells recipes and ingredients.',
    items: 'Ingredients, Recipes, Kitchen furniture',
    refresh: '—',
    lovedGifts: 'Cooked food',
  },
  {
    name: 'Naniwa',
    title: 'Bug Catching Mentor',
    category: 'Mentor',
    location: 'Forest',
    unlock: 'Developer Level 6 + Hobby Expansion Ticket',
    description: 'Forest explorer who teaches players how to catch insects.',
    items: 'Bug nets, Terrariums',
    refresh: '—',
    lovedGifts: 'Insects',
  },
  {
    name: 'Bailey J',
    title: 'Birdwatching Mentor',
    category: 'Mentor',
    location: 'Pet Store (upstairs) / Park',
    unlock: 'Developer Level 6 + Hobby Expansion Ticket',
    description: 'Birdwatching enthusiast who helps players observe birds.',
    items: 'Binoculars, Bird food',
    refresh: '—',
    lovedGifts: 'Feathers, Bird items',
  },
  {
    name: 'Mrs. Joan',
    title: 'Pet Care Mentor',
    category: 'Mentor',
    location: 'Pet Store',
    unlock: 'Developer Level 12 + Hobby Expansion Ticket',
    description: 'Pet shop owner who takes care of cats and dogs.',
    items: 'Pet food, Pet accessories',
    refresh: '—',
    lovedGifts: 'Pet items',
  },
  {
    name: 'Atara',
    title: 'Village Mayor',
    category: 'Quest NPC',
    location: 'Town Hall',
    unlock: 'Available from start',
    description: 'Mayor who gives weekly quests and manages town activities.',
    items: '—',
    refresh: 'Weekly quests',
    lovedGifts: '—',
  },
  {
    name: 'Andrew',
    title: 'Vehicle Merchant',
    category: 'Shop',
    location: 'Town',
    unlock: 'Story progression',
    description: 'Sells vehicles that allow faster travel across Heartopia.',
    items: 'Vehicles',
    refresh: '—',
    lovedGifts: '—',
  },
  {
    name: 'Bill',
    title: 'Sea Fishing Host',
    category: 'Event NPC',
    location: 'Fishing Village',
    unlock: 'Fishing progression',
    description: 'Runs multiplayer sea fishing activities.',
    items: '—',
    refresh: 'Sea fishing events',
    lovedGifts: '—',
  },
  {
    name: 'Patti',
    title: 'Forest Ranger',
    category: 'Exploration NPC',
    location: 'Forest Ranger Station',
    unlock: 'Visit forest',
    description: 'Guide for the forest and wildlife areas.',
    items: '—',
    refresh: 'Exploration quests',
    lovedGifts: '—',
  },
  {
    name: 'Vernie',
    title: 'Flower Fields Caretaker',
    category: 'Quest NPC',
    location: 'Flower Fields',
    unlock: 'Story progression',
    description: 'Caretaker of the flower fields and related quests.',
    items: '—',
    refresh: 'Treasure / music quests',
    lovedGifts: '—',
  },
  {
    name: 'Will',
    title: 'Lighthouse Keeper',
    category: 'Utility NPC',
    location: 'Fishing Village Lighthouse',
    unlock: 'Visit Fishing Village',
    description: 'Maintains the lighthouse and helps with sea navigation.',
    items: '—',
    refresh: 'Sea navigation support',
    lovedGifts: '—',
  },
  {
    name: 'Eric',
    title: 'Onsen Mountain NPC',
    category: 'Story NPC',
    location: 'Onsen Mountain',
    unlock: 'Astralis storyline',
    description: 'Part of the Astralis storyline related to the mountain area.',
    items: '—',
    refresh: 'Fluorite mining quests',
    lovedGifts: '—',
  },
];

const NpcsPage = () => {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [checked, toggle]       = useTrackerState('npcs');

  const categories = ['All', ...Array.from(new Set(NPCS.map((n) => n.category)))];

  const filtered = NPCS.filter((n) => {
    const matchSearch =
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || n.category === category;
    return matchSearch && matchCat;
  });

  const pct = NPCS.length ? (checked.size / NPCS.length) * 100 : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHead}>
          <div className={styles.pageHeadContent}>
            <img src="/assets/img/npcs/naniwa.webp" alt="NPCs" className={styles.pageIcon} loading="eager" onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <h1 className={styles.pageTitle}>NPCs</h1>
              <p className={styles.pageSubtitle}>All characters you can meet in Heartopia</p>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.tbActions}>
            <select
              className={styles.filterSelect}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              className={styles.searchInput}
              placeholder="Search NPCs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.gridWide}>
          {filtered.map((npc) => (
            <div
              key={npc.name}
              className={styles.cardWide}
            >
              <div className={styles.cardHeader}>
                <img
                  src={getImgSrc(npc.name, 'npcs')}
                  alt={npc.name}
                  className={styles.cardImgWide}
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    const soonBadge = document.createElement('span');
                    soonBadge.className = styles.soonBadge;
                    soonBadge.textContent = 'SOON';
                    if (!e.target.parentElement.querySelector(`.${styles.soonBadge}`)) {
                      e.target.parentElement.appendChild(soonBadge);
                    }
                  }}
                />
                <div>
                  <div className={styles.cardTitle}>{npc.name}</div>
                  <div className={styles.cardRole}>{npc.title}</div>
                  <span className={styles.badge} style={{ marginTop: '4px', display: 'inline-block' }}>{npc.category}</span>
                </div>
              </div>

              <p className={styles.cardBody}>{npc.description}</p>

              <div className={styles.meta}>
                <span><strong>Location:</strong> {npc.location}</span>
                <span><strong>Unlock:</strong> {npc.unlock}</span>
                {npc.items !== '—' && <span><strong>Items:</strong> {npc.items}</span>}
                {npc.lovedGifts !== '—' && <span><strong>Loved Gifts:</strong> {npc.lovedGifts}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NpcsPage;
