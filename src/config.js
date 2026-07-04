// Tome of Valor - Game Configurations and Shared State

window.RPG_CONFIG = {
  TILE_SIZE: 32,
  MAP_WIDTH: 25,
  MAP_HEIGHT: 25,
  FPS: 24,

  // Player starting base stats
  BASE_HP: 90,
  BASE_MP: 45,
  BASE_ATK: 12,
  BASE_DEF: 4,

  // Encounter settings (slightly lower rate for pacing)
  ENCOUNTER_RATE: 0.12,
  BOSS_TILE_X: 22,
  BOSS_TILE_Y: 2,

  // Quest requirements to unlock the castle gate
  QUEST_WARLORDS_NEEDED: 3,   // Must defeat 3 Warlords
  QUEST_RELICS_NEEDED: 3,     // Must find 3 Sacred Relics from chests

  // Weapon profiles
  WEAPON_PROFILES: {
    'Fists':         { name: 'Fists',          atkBonus: 0,  mpCost: 15, specialName: 'Mana Burst',    icon: '✊', color: '#ffd0a1' },
    'Rusty Dagger':  { name: 'Rusty Dagger',   atkBonus: 2,  mpCost: 5,  specialName: 'Quick Stab',    icon: '🗡️', color: '#9e9e9e' },
    'Wizard Wand':   { name: 'Wizard Wand',    atkBonus: 4,  mpCost: 8,  specialName: 'Fireball',      icon: '🪄', color: '#ffb703' },
    'Iron Greatsword':{ name: 'Iron Greatsword',atkBonus: 6, mpCost: 10, specialName: 'Heavy Strike',   icon: '⚔️', color: '#708284' },
    'Magic Sword':   { name: 'Magic Sword',    atkBonus: 10, mpCost: 10, specialName: 'Thunder Slash',  icon: '✨', color: '#00b4d8' }
  }
};

// Global Adventure State
window.gameState = {
  playerCustom: {
    hairStyle: 'Spiky',
    hairColor: '#e7c169',
    outfitColor: '#a12a32',
  },

  hero: {
    level: 1,
    exp: 0,
    maxExp: 120,
    hp: window.RPG_CONFIG.BASE_HP,
    maxHp: window.RPG_CONFIG.BASE_HP,
    mp: window.RPG_CONFIG.BASE_MP,
    maxMp: window.RPG_CONFIG.BASE_MP,
    atk: window.RPG_CONFIG.BASE_ATK,
    def: window.RPG_CONFIG.BASE_DEF,
    specialAbilityName: 'Mana Burst',
    specialAbilityCost: 15,
  },

  inventory: {
    potions: 0,
  },

  weapons: ['Fists'],
  equippedWeapon: 'Fists',

  // === QUEST STATE ===
  quest: {
    warlordsDefeated: 0,   // Number of Warlords killed
    relicsFound: 0,        // Number of Sacred Relics recovered
    warlordNames: [],      // Names of defeated warlords (for log)
    bossUnlocked: false,   // true once all quest conditions met
  },

  // Autoplay toggles
  autoWalkActive: false,
  autoCombatActive: false,
  combatSpeed: 1,

  playerGridPos: { x: 2, y: 22 },
  mapExplored: {},
  bossDefeated: false,
  combatActive: false,
  openedChests: new Set(),

  // ---- Helpers ----

  log: function(message, type = 'system') {
    const logBox = document.getElementById('log-text');
    if (!logBox) return;
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `&gt; ${message}`;
    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
  },

  updateHUD: function() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('hero-hp',    `${this.hero.hp} / ${this.hero.maxHp}`);
    set('hero-mp',    `${this.hero.mp} / ${this.hero.maxMp}`);
    set('hero-atk',   this.hero.atk);
    set('hero-level', this.hero.level);
    set('hero-exp',   `${this.hero.exp} / ${this.hero.maxExp}`);

    // Potion slot
    const ps = document.getElementById('slot-potion');
    if (ps) {
      const has = this.inventory.potions > 0;
      ps.classList.toggle('empty',   !has);
      ps.classList.toggle('active',   has);
      ps.querySelector('.slot-label').textContent = has
        ? `${this.inventory.potions} Potion${this.inventory.potions > 1 ? 's' : ''}`
        : '0 Potions';
    }

    // Weapon arsenal
    const list = document.getElementById('weapons-list');
    if (list) {
      list.innerHTML = '';
      this.weapons.forEach(w => {
        const prof = window.RPG_CONFIG.WEAPON_PROFILES[w];
        if (!prof) return;
        const isEquipped = (this.equippedWeapon === w);
        const item = document.createElement('div');
        item.className = `weapon-item ${isEquipped ? 'equipped' : ''}`;
        item.setAttribute('onclick', `selectWeapon('${w}')`);
        item.innerHTML = `<span class="w-name">${prof.icon} ${prof.name}</span>
          <span class="w-info">+${prof.atkBonus} ATK | ${prof.specialName}</span>`;
        list.appendChild(item);
      });
    }

    // Quest tracker
    this.updateQuestTracker();
  },

  updateQuestTracker: function() {
    const q = this.quest;
    const wNeeded = window.RPG_CONFIG.QUEST_WARLORDS_NEEDED;
    const rNeeded = window.RPG_CONFIG.QUEST_RELICS_NEEDED;

    const wEl   = document.getElementById('quest-warlords');
    const rEl   = document.getElementById('quest-relics');
    const gEl   = document.getElementById('quest-gate');
    const unlEl = document.getElementById('quest-unlocked');

    if (wEl) {
      wEl.textContent = `${q.warlordsDefeated} / ${wNeeded}`;
      wEl.style.color = q.warlordsDefeated >= wNeeded ? '#70e000' : '#f5ebe0';
    }
    if (rEl) {
      rEl.textContent = `${q.relicsFound} / ${rNeeded}`;
      rEl.style.color = q.relicsFound >= rNeeded ? '#70e000' : '#f5ebe0';
    }

    const unlocked = q.warlordsDefeated >= wNeeded && q.relicsFound >= rNeeded;
    q.bossUnlocked = unlocked;

    if (gEl) gEl.style.display = unlocked ? 'none' : '';
    if (unlEl) unlEl.style.display = unlocked ? '' : 'none';
  },

  addExp: function(amount) {
    this.hero.exp += amount;
    this.log(`Gained ${amount} EXP!`, 'loot');
    while (this.hero.exp >= this.hero.maxExp) {
      this.hero.level += 1;
      this.hero.exp -= this.hero.maxExp;
      this.hero.maxExp = Math.floor(this.hero.maxExp * 1.6);
      const hpBoost = 18; const mpBoost = 10;
      this.hero.maxHp += hpBoost; this.hero.hp = this.hero.maxHp;
      this.hero.maxMp += mpBoost; this.hero.mp = this.hero.maxMp;
      this.log(`LEVEL UP! Now Level ${this.hero.level}! HP & Mana restored!`, 'system');
      const prof = window.RPG_CONFIG.WEAPON_PROFILES[this.equippedWeapon];
      if (prof) this.hero.atk = window.RPG_CONFIG.BASE_ATK + (this.hero.level - 1) * 3 + prof.atkBonus;
    }
    this.updateHUD();
  }
};
