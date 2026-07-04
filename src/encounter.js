// Tome of Valor - Random Travel Encounter and Chest Loot Systems

window.EncounterSystem = {
  chestsOpened: 0,

  // =====================================================================
  //  Regular enemy pool — scales slightly with player level
  // =====================================================================
  enemiesPool: [
    { name: 'Goblin Scout',      hp: 32,  maxHp: 32,  atk: 8,  def: 2,  expReward: 35,  icon: '👺' },
    { name: 'Rogue Bandit',      hp: 40,  maxHp: 40,  atk: 10, def: 3,  expReward: 50,  icon: '🗡' },
    { name: 'Feral Direwolf',    hp: 38,  maxHp: 38,  atk: 11, def: 1,  expReward: 42,  icon: '🐺' },
    { name: 'Skeleton Knight',   hp: 48,  maxHp: 48,  atk: 9,  def: 5,  expReward: 62,  icon: '💀' },
    { name: 'Plague Rat Swarm',  hp: 28,  maxHp: 28,  atk: 14, def: 1,  expReward: 38,  icon: '🐀' },
    { name: 'Stone Golem',       hp: 70,  maxHp: 70,  atk: 8,  def: 7,  expReward: 80,  icon: '🪨' },
    { name: 'Shadow Wraith',     hp: 55,  maxHp: 55,  atk: 13, def: 3,  expReward: 70,  icon: '👻' },
    { name: 'Venomfang Spider',  hp: 42,  maxHp: 42,  atk: 12, def: 2,  expReward: 55,  icon: '🕷' },
  ],

  // =====================================================================
  //  Warlord pool (3 mini-bosses, in order of encounter index 0,1,2)
  // =====================================================================
  warlordPool: [
    {
      name: 'Greth the Goblin Warlord',
      lore: 'Commander of Ashardalon\'s goblin legions. His iron gauntlet shakes the earth.',
      hp: 100, maxHp: 100, atk: 14, def: 5, expReward: 150, icon: '👺'
    },
    {
      name: 'Valdris the Bone Tyrant',
      lore: 'An undead general raised by dark sorcery. He cannot feel pain.',
      hp: 130, maxHp: 130, atk: 16, def: 7, expReward: 200, icon: '💀'
    },
    {
      name: 'Sorvax the Shadow Knight',
      lore: 'Ashardalon\'s most trusted champion. His blade bleeds shadow.',
      hp: 160, maxHp: 160, atk: 18, def: 9, expReward: 250, icon: '🛡'
    }
  ],

  getWarlord: function(index) {
    const w = this.warlordPool[Math.min(index, this.warlordPool.length - 1)];
    // Return a fresh copy
    return { ...w, hp: w.maxHp, isWarlord: true };
  },

  // =====================================================================
  //  Random encounter roll
  // =====================================================================
  rollEncounter: function() {
    const level = window.gameState.hero.level;
    const roll  = Math.random();

    if (roll < 0.65) {
      // Scale enemy HP/ATK slightly with player level for balance
      const base = this.enemiesPool[Math.floor(Math.random() * this.enemiesPool.length)];
      const lvlMod = Math.max(0, level - 1) * 4;
      return {
        type:      'fight',
        name:      base.name,
        icon:      base.icon,
        hp:        base.hp + lvlMod,
        maxHp:     base.hp + lvlMod,
        atk:       base.atk + Math.floor(lvlMod / 3),
        def:       base.def,
        expReward: base.expReward
      };
    } else if (roll < 0.82) {
      const xpFound = 30 + Math.floor(Math.random() * 25);
      const flavour = [
        `You found an abandoned merchant cart filled with stolen coin. Gained ${xpFound} EXP from the bountiful haul!`,
        `A traveling bard shares tales of ancient battles. Your resolve strengthens! Gained ${xpFound} EXP.`,
        `You discover an old battlefield monument. Meditating on the past gives you ${xpFound} EXP.`,
        `A friendly farmer rewards you for clearing a wolf den nearby. Gained ${xpFound} EXP.`,
      ];
      return {
        type:        'gold',
        description: flavour[Math.floor(Math.random() * flavour.length)],
        xp:          xpFound
      };
    } else {
      const trapDamage = 5 + Math.floor(Math.random() * 10);
      const trapFlavour = [
        `You triggered a hidden spear trap! Took ${trapDamage} damage!`,
        `An envenomed needle stabs your boot! Took ${trapDamage} poison damage!`,
        `You stumble into a pit trap! You claw your way out but lose ${trapDamage} HP!`,
      ];
      return {
        type:        'trap',
        description: trapFlavour[Math.floor(Math.random() * trapFlavour.length)],
        damage:      trapDamage
      };
    }
  },

  // =====================================================================
  //  Chest loot — tied to quest relics
  // =====================================================================
  openChest: function(gridX, gridY) {
    this.chestsOpened++;
    const n = this.chestsOpened;

    const relicLore = [
      'the Ember Crystal — shard of Aldric\'s broken Holy Seal',
      'the Moonstone Amulet — worn by the last High Priest of Valdor',
      'the Storm Fragment — the final piece of the sacred Crystal Seal'
    ];

    if (n <= 3) {
      // First 3 chests always contain Sacred Relics (quest items)
      window.gameState.quest.relicsFound++;
      const relicName = relicLore[n - 1] || `Sacred Relic #${n}`;
      window.gameState.log(`📦 CHEST: You recovered ${relicName}!`, 'loot');
      window.gameState.log(`Sacred Relics: ${window.gameState.quest.relicsFound} / ${window.RPG_CONFIG.QUEST_RELICS_NEEDED}`, 'system');
      window.gameState.addExp(60);

      // Also give a bonus weapon / loot on certain chests
      if (n === 1) {
        this.grantWeapon('Rusty Dagger');
        window.gameState.log('BONUS: Found a Rusty Dagger in the chest!', 'loot');
      } else if (n === 2) {
        this.grantWeapon('Iron Greatsword');
        window.gameState.log('BONUS: Discovered the Iron Greatsword alongside the relic!', 'loot');
      } else if (n === 3) {
        this.grantWeapon('Wizard Wand');
        window.gameState.log('BONUS: A Wizard Wand rests beside the relic!', 'loot');
      }
    } else {
      // Extra chests are bonus loot
      const lootRoll = Math.random();
      if (lootRoll < 0.5) {
        window.gameState.inventory.potions += 2;
        window.gameState.log('📦 CHEST: Found 2 Heal Potions!', 'loot');
      } else {
        window.gameState.hero.maxHp += 10;
        window.gameState.hero.hp = Math.min(window.gameState.hero.maxHp, window.gameState.hero.hp + 20);
        window.gameState.log('📦 CHEST: Found an Amulet of Fortitude! +10 Max HP!', 'loot');
      }
      window.gameState.addExp(40);
    }

    // Check if boss is now unlocked
    window.gameState.updateQuestTracker();
    this._checkBossUnlock();
    window.gameState.updateHUD();
  },

  _checkBossUnlock: function() {
    const q = window.gameState.quest;
    if (q.warlordsDefeated >= window.RPG_CONFIG.QUEST_WARLORDS_NEEDED &&
        q.relicsFound      >= window.RPG_CONFIG.QUEST_RELICS_NEEDED &&
        !q.bossUnlocked) {
      q.bossUnlocked = true;
      window.gameState.log('⚡ THE SEAL IS BROKEN! The Dark Castle gates have opened! Ashardalon awaits!', 'system');
    }
  },

  // Called from combat.js on enemy defeat
  onEnemyDefeated: function(isWarlord, warlordName) {
    if (isWarlord) {
      window.gameState.quest.warlordsDefeated++;
      if (warlordName) window.gameState.quest.warlordNames.push(warlordName);
      window.gameState.log(`🏆 Warlord slain! ${window.gameState.quest.warlordsDefeated} / ${window.RPG_CONFIG.QUEST_WARLORDS_NEEDED} Warlords defeated.`, 'system');
      // Warlords always drop a potion + big exp
      window.gameState.inventory.potions += 2;
      window.gameState.log('Warlord dropped 2 Heal Potions!', 'loot');
      window.gameState.updateQuestTracker();
      this._checkBossUnlock();
    }
  },

  // =====================================================================
  //  Weapon drop from regular monster kills
  // =====================================================================
  rollWeaponDrop: function(isBoss = false) {
    if (isBoss) {
      this.grantWeapon('Magic Sword');
      window.gameState.log('✨ LEGENDARY: You seized the MAGIC SWORD from Dragon Lord Ashardalon\'s remains!', 'loot');
      window.gameState.log('NEW ABILITY: Equip the Magic Sword to unleash [Thunder Slash]!', 'system');
      window.gameState.updateHUD();
      return;
    }

    const roll = Math.random();
    if (roll < 0.30) {
      const weaponPool = ['Rusty Dagger', 'Wizard Wand', 'Iron Greatsword'];
      const lootWeapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
      if (!window.gameState.weapons.includes(lootWeapon)) {
        this.grantWeapon(lootWeapon);
        window.gameState.log(`MONSTER DROP: Enemy dropped a ${lootWeapon.toUpperCase()}!`, 'loot');
      } else {
        window.gameState.inventory.potions += 1;
        window.gameState.log(`MONSTER DROP: Duplicate weapon converted to 1 Heal Potion.`, 'loot');
      }
    } else {
      if (Math.random() < 0.55) {
        window.gameState.inventory.potions++;
        window.gameState.log('LOOT: Looted 1 Heal Potion from the monster!', 'loot');
      }
    }
    window.gameState.updateHUD();
  },

  grantWeapon: function(weaponName) {
    if (!window.gameState.weapons.includes(weaponName)) {
      window.gameState.weapons.push(weaponName);
    }
    const currentProf = window.RPG_CONFIG.WEAPON_PROFILES[window.gameState.equippedWeapon];
    const newProf     = window.RPG_CONFIG.WEAPON_PROFILES[weaponName];
    if (newProf && newProf.atkBonus > currentProf.atkBonus) {
      window.gameState.equippedWeapon = weaponName;
      window.gameState.hero.atk = window.RPG_CONFIG.BASE_ATK + (window.gameState.hero.level - 1) * 3 + newProf.atkBonus;
      window.gameState.hero.specialAbilityName = newProf.specialName;
      window.gameState.hero.specialAbilityCost = newProf.mpCost;
    }
  }
};
