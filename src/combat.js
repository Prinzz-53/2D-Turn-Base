// Tome of Valor - Turn-Based Combat Scene (CombatScene)

class CombatScene extends Phaser.Scene {
  constructor() {
    super('CombatScene');
  }

  init(data) {
    this.isBoss     = data.isBoss     || false;
    this.isWarlord  = data.isWarlord  || false;

    if (this.isBoss) {
      this.enemy = {
        name:      'Dragon Lord Ashardalon',
        lore:      'Ancient destroyer. His breath melts stone. His gaze shatters hope.',
        hp:        220,
        maxHp:     220,
        atk:       22,
        def:       8,
        expReward: 700,
        icon:      '🐉'
      };
    } else {
      this.enemy = data.enemy || {
        name:      'Goblin Scout',
        hp:        32,
        maxHp:     32,
        atk:       8,
        def:       2,
        expReward: 35,
        icon:      '👺'
      };
    }

    this.combatRound      = 1;
    this.playerInitiative = 0;
    this.enemyInitiative  = 0;
    this.isPlayerTurn     = false;
    this.actionActive     = false;
  }

  create() {
    window.gameState.combatActive = true;
    
    this.add.rectangle(320, 240, 640, 480, 0x160e12);
    
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xb78a3e, 0.8);
    graphics.strokeRect(10, 10, 620, 460);

    this.roundText = this.add.text(320, 30, `COMBAT - ROUND 1`, {
      fontFamily: 'Cinzel',
      fontSize: '24px',
      color: '#b78a3e',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.playerSprite = this.add.sprite(150, 200, 'player').setScale(3.5);
    const enemyTexture = this.isBoss ? 'boss' : 'goblin';
    this.enemySprite = this.add.sprite(490, 200, enemyTexture).setScale(this.isBoss ? 2.0 : 3.5);

    // Enemy label (with icon if available)
    const enemyIcon = this.enemy.icon ? `${this.enemy.icon} ` : '';
    this.add.text(150, 120, 'HERO', { fontFamily: 'Cinzel', fontSize: '18px', color: '#ffd166' }).setOrigin(0.5);
    this.enemyNameText = this.add.text(490, 120, `${enemyIcon}${this.enemy.name.toUpperCase()}`, {
      fontFamily:  'Cinzel',
      fontSize:    (this.isBoss || this.isWarlord) ? '13px' : '16px',
      color:       this.isBoss ? '#e63946' : (this.isWarlord ? '#f77f00' : '#d5bdaf')
    }).setOrigin(0.5);

    // Lore subtitle for boss / warlord
    if (this.enemy.lore) {
      this.add.text(490, 140, `"${this.enemy.lore}"`, {
        fontFamily: 'Cinzel',
        fontSize:   '9px',
        color:      '#9e9e9e',
        wordWrap:   { width: 240 },
        align:      'center'
      }).setOrigin(0.5);
    }

    this.playerHpText = this.add.text(150, 270, `HP: ${window.gameState.hero.hp}/${window.gameState.hero.maxHp}`, { 
      fontFamily: 'Press Start 2P', fontSize: '10px', color: '#70e000' 
    }).setOrigin(0.5);
    
    this.enemyHpText = this.add.text(490, 270, `HP: ${this.enemy.hp}/${this.enemy.maxHp}`, { 
      fontFamily: 'Press Start 2P', fontSize: '10px', color: '#e63946' 
    }).setOrigin(0.5);

    this.menuGroup = this.add.group();
    this.drawActionMenu();

    this.battleLogText = this.add.text(320, 315, "Rolling Initiative...", {
      fontFamily: 'Cinzel',
      fontSize: '14px',
      color: '#f5ebe0',
      align: 'center'
    }).setOrigin(0.5);

    const spd = window.gameState.combatSpeed;
    this.time.delayedCall(800 / spd, () => {
      this.rollInitiative();
    });
  }

  rollInitiative() {
    const spd = window.gameState.combatSpeed;
    const pRoll = Math.floor(Math.random() * 20) + 1;
    const eRoll = Math.floor(Math.random() * 20) + 1;
    const pDexMod = 2;
    const eDexMod = 1;

    this.playerInitiative = pRoll + pDexMod;
    this.enemyInitiative = eRoll + eDexMod;

    window.gameState.log(`D&D Initiative: You rolled ${pRoll} (+${pDexMod}) = ${this.playerInitiative}. ${this.enemy.name} rolled ${eRoll} (+${eDexMod}) = ${this.enemyInitiative}.`);

    if (this.playerInitiative >= this.enemyInitiative) {
      this.isPlayerTurn = true;
      this.battleLogText.setText("Initiative won! Your Turn!");
      window.gameState.log("Your turn to act.", "player-turn");
      this.showMenu();
    } else {
      this.isPlayerTurn = false;
      this.battleLogText.setText(`${this.enemy.name} won initiative!`);
      window.gameState.log(`${this.enemy.name} prepares to strike...`, "enemy-turn");
      this.hideMenu();
      this.time.delayedCall(1200 / spd, () => this.enemyTurn());
    }
  }

  drawActionMenu() {
    const startY = 355;
    const spacingY = 38;
    const actions = ['ATTACK', 'SPECIAL', 'HEAL POTION', 'FLEE'];

    actions.forEach((act, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col === 0 ? 200 : 440;
      const y = startY + row * spacingY;

      let btnLabel = act;
      if (act === 'SPECIAL') {
        const specName = window.gameState.hero.specialAbilityName;
        const specCost = window.gameState.hero.specialAbilityCost;
        btnLabel = `${specName.toUpperCase()} (${specCost}MP)`;
      } else if (act === 'HEAL POTION') {
        btnLabel = `HEAL POTION (${window.gameState.inventory.potions})`;
      }

      const btn = this.add.text(x, y, btnLabel, {
        fontFamily: 'Press Start 2P',
        fontSize: '10px',
        color: '#0b090a',
        backgroundColor: '#b78a3e',
        padding: { x: 12, y: 8 },
        align: 'center'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => {
        if (!this.isPlayerTurn || this.actionActive || window.gameState.autoCombatActive) return;
        this.handlePlayerAction(act);
      });

      btn.on('pointerover', () => {
        if (this.isPlayerTurn && !this.actionActive && !window.gameState.autoCombatActive) {
          btn.setBackgroundColor('#fcbf49');
        }
      });

      btn.on('pointerout', () => {
        btn.setBackgroundColor('#b78a3e');
      });

      this.menuGroup.add(btn);
    });

    this.hideMenu();
  }

  showMenu() {
    const spd = window.gameState.combatSpeed;
    
    if (window.gameState.autoCombatActive) {
      this.hideMenu();
      this.actionActive = true;
      this.time.delayedCall(800 / spd, () => {
        const aiAction = window.AutoPlay.decideCombatAction(this);
        this.handlePlayerAction(aiAction);
      });
      return;
    }

    this.menuGroup.getChildren().forEach((btn, idx) => {
      btn.setVisible(true);
      if (idx === 2) {
        btn.setText(`HEAL POTION (${window.gameState.inventory.potions})`);
      }
    });
  }

  hideMenu() {
    this.menuGroup.getChildren().forEach(btn => {
      btn.setVisible(false);
    });
  }

  handlePlayerAction(act) {
    this.actionActive = true;
    this.hideMenu();

    if (act === 'ATTACK') {
      this.executeAttack();
    } else if (act === 'SPECIAL') {
      this.executeSpecial();
    } else if (act === 'HEAL POTION') {
      this.executeHeal();
    } else if (act === 'FLEE') {
      this.executeFlee();
    }
  }

  executeAttack() {
    const spd = window.gameState.combatSpeed;
    const d20 = Math.floor(Math.random() * 20) + 1;
    const toHit = d20 + Math.floor(window.gameState.hero.atk / 2);
    const targetAC = 10 + this.enemy.def;

    this.battleLogText.setText(`Rolling to Hit: D20 + Mod = ${toHit} vs AC ${targetAC}`);

    this.time.delayedCall(800 / spd, () => {
      if (d20 === 20 || toHit >= targetAC) {
        const isCrit = d20 === 20;
        let damage = Math.floor(Math.random() * 8) + 1 + Math.floor(window.gameState.hero.atk / 2);
        if (isCrit) damage *= 2;

        this.battleLogText.setText(`Hit! Deals ${damage} damage.`);
        window.gameState.log(`Rolled ${toHit} to hit! Dealt ${damage} damage to ${this.enemy.name}.`, 'player-turn');

        this.animateStrike(this.playerSprite, this.enemySprite);
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        this.updateStatsUI();

        this.time.delayedCall(1200 / spd, () => this.checkCombatStatus());
      } else {
        this.battleLogText.setText("Attack missed!");
        window.gameState.log(`Rolled ${toHit} to hit. Attack missed.`, 'player-turn');
        this.time.delayedCall(1000 / spd, () => this.checkCombatStatus());
      }
    });
  }

  executeSpecial() {
    const spd = window.gameState.combatSpeed;
    const weaponName = window.gameState.equippedWeapon;
    const specName = window.gameState.hero.specialAbilityName;
    const mpCost = window.gameState.hero.specialAbilityCost;

    if (window.gameState.hero.mp < mpCost) {
      this.battleLogText.setText("Insufficient Mana!");
      window.gameState.log(`Failed to cast [${specName}] - Insufficient Mana.`);
      this.time.delayedCall(1000 / spd, () => {
        this.actionActive = false;
        this.showMenu();
      });
      return;
    }

    window.gameState.hero.mp -= mpCost;
    window.gameState.updateHUD();

    this.battleLogText.setText(`Hero casts ${specName.toUpperCase()}!`);
    window.gameState.log(`Hero casts Special Ability [${specName}]!`, 'player-turn');

    this.time.delayedCall(800 / spd, () => {
      if (weaponName === 'Fists') {
        const damage = 14 + window.gameState.hero.level * 3;
        this.battleLogText.setText(`Spell hit! Deals ${damage} magic damage.`);
        window.gameState.log(`Mana Burst hits automatically. Dealt ${damage} magic damage to ${this.enemy.name}.`, 'player-turn');
        this.cameras.main.flash(150 / spd, 0, 119, 182);
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        this.updateStatsUI();
        this.time.delayedCall(1200 / spd, () => this.checkCombatStatus());
      } 
      else if (weaponName === 'Rusty Dagger') {
        const twice = Math.random() < 0.5;
        const d20 = Math.floor(Math.random() * 20) + 1;
        const toHit = d20 + Math.floor(window.gameState.hero.atk / 2);
        const targetAC = 10 + this.enemy.def;

        if (d20 === 20 || toHit >= targetAC) {
          let damage = Math.floor(Math.random() * 6) + 1 + Math.floor(window.gameState.hero.atk / 2);
          if (twice) {
            damage *= 2;
            this.battleLogText.setText(`Double Stab! Deals ${damage} damage!`);
            window.gameState.log(`Quick Stab rolled critical success! double attack dealt ${damage} damage to ${this.enemy.name}.`, 'player-turn');
          } else {
            this.battleLogText.setText(`Quick Stab hit! Deals ${damage} damage.`);
            window.gameState.log(`Quick Stab rolled ${toHit} to hit! Dealt ${damage} damage.`, 'player-turn');
          }
          this.animateStrike(this.playerSprite, this.enemySprite);
          this.enemy.hp = Math.max(0, this.enemy.hp - damage);
          this.updateStatsUI();
          this.time.delayedCall(1200 / spd, () => this.checkCombatStatus());
        } else {
          this.battleLogText.setText("Quick Stab missed!");
          window.gameState.log("Quick Stab missed the enemy.", 'player-turn');
          this.time.delayedCall(1000 / spd, () => this.checkCombatStatus());
        }
      } 
      else if (weaponName === 'Wizard Wand') {
        const damage = Math.floor(Math.random() * 12) + 8 + window.gameState.hero.level * 2;
        this.battleLogText.setText(`Fireball exploded! Deals ${damage} fire damage!`);
        window.gameState.log(`Fireball erupted on ${this.enemy.name}! Dealt ${damage} fire damage.`, 'player-turn');
        this.cameras.main.flash(200 / spd, 247, 127, 0);
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        this.updateStatsUI();
        this.time.delayedCall(1200 / spd, () => this.checkCombatStatus());
      } 
      else if (weaponName === 'Iron Greatsword') {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const toHit = d20 + Math.floor(window.gameState.hero.atk / 2) - 2;
        const targetAC = 10 + this.enemy.def;

        if (d20 === 20 || toHit >= targetAC) {
          let damage = Math.floor(Math.random() * 20) + 2 + Math.floor(window.gameState.hero.atk);
          this.battleLogText.setText(`Slam! Heavy Strike deals ${damage} damage!`);
          window.gameState.log(`Heavy Strike connected! Dealt ${damage} crushing physical damage.`, 'player-turn');
          this.cameras.main.shake(200 / spd, 0.02);
          this.animateStrike(this.playerSprite, this.enemySprite);
          this.enemy.hp = Math.max(0, this.enemy.hp - damage);
          this.updateStatsUI();
          this.time.delayedCall(1200 / spd, () => this.checkCombatStatus());
        } else {
          this.battleLogText.setText("Heavy Strike missed!");
          window.gameState.log("Heavy Strike missed its target.", 'player-turn');
          this.time.delayedCall(1000 / spd, () => this.checkCombatStatus());
        }
      } 
      else if (weaponName === 'Magic Sword') {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const toHit = d20 + Math.floor(window.gameState.hero.atk / 2) + 2;
        const targetAC = 10 + this.enemy.def;

        if (d20 === 20 || toHit >= targetAC) {
          const isCrit = d20 === 20;
          let damage = Math.floor(Math.random() * 12) + 8 + Math.floor(window.gameState.hero.atk / 1.5);
          if (isCrit) damage *= 2;

          this.battleLogText.setText(`Lightning strikes! Deals ${damage} damage!`);
          window.gameState.log(`Thunderbolt cracked! Dealt ${damage} magic lightning damage to ${this.enemy.name}.`, 'player-turn');
          this.cameras.main.flash(200 / spd, 0, 180, 216);
          this.animateStrike(this.playerSprite, this.enemySprite);
          this.enemy.hp = Math.max(0, this.enemy.hp - damage);
          this.updateStatsUI();
          this.time.delayedCall(1200 / spd, () => this.checkCombatStatus());
        } else {
          this.battleLogText.setText("Thunder Slash missed!");
          window.gameState.log("Thunder Slash missed its target.", 'player-turn');
          this.time.delayedCall(1000 / spd, () => this.checkCombatStatus());
        }
      }
    });
  }

  executeHeal() {
    const spd = window.gameState.combatSpeed;
    if (window.gameState.inventory.potions <= 0) {
      this.battleLogText.setText("No Heal Potions remaining!");
      window.gameState.log("Failed to heal - No potions in Bag of Holding.");
      this.time.delayedCall(1000 / spd, () => {
        this.actionActive = false;
        this.showMenu();
      });
      return;
    }

    window.gameState.inventory.potions--;
    const healVal = 40;
    window.gameState.hero.hp = Math.min(window.gameState.hero.maxHp, window.gameState.hero.hp + healVal);
    window.gameState.updateHUD();
    this.updateStatsUI();

    this.battleLogText.setText(`Drank potion! Restored ${healVal} HP.`);
    window.gameState.log(`Drank Heal Potion. Restored ${healVal} HP.`, 'player-turn');

    this.tweens.add({
      targets: this.playerSprite,
      alpha: 0.4,
      duration: 100 / spd,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.playerSprite.alpha = 1;
        this.time.delayedCall(800 / spd, () => this.checkCombatStatus());
      }
    });
  }

  executeFlee() {
    const spd = window.gameState.combatSpeed;
    if (this.isBoss || this.isWarlord) {
      const whoName = this.isBoss ? 'the Dragon Lord' : this.enemy.name;
      this.battleLogText.setText(`Cannot flee from ${whoName}!`);
      window.gameState.log(`${whoName} blocks all exits! Stand and fight!`, 'enemy-turn');
      this.time.delayedCall(1000 / spd, () => {
        this.actionActive = false;
        this.showMenu();
      });
      return;
    }

    const roll = Math.floor(Math.random() * 20) + 1;
    this.battleLogText.setText(`Fleeing: Rolled ${roll} vs DC 10`);

    this.time.delayedCall(800 / spd, () => {
      if (roll >= 10) {
        this.battleLogText.setText("Escaped successfully!");
        window.gameState.log("Escaped from combat back to map.", "system");
        this.time.delayedCall(1000 / spd, () => {
          window.gameState.combatActive = false;
          this.scene.start('WorldScene');
        });
      } else {
        this.battleLogText.setText("Failed to escape!");
        window.gameState.log("Failed to escape! Enemy blockades path.", "enemy-turn");
        this.time.delayedCall(1000 / spd, () => this.checkCombatStatus());
      }
    });
  }

  enemyTurn() {
    const spd = window.gameState.combatSpeed;
    if (this.enemy.hp <= 0) return;

    this.roundText.setText(`COMBAT - ROUND ${this.combatRound}`);
    this.battleLogText.setText(`${this.enemy.name} attacks...`);

    this.time.delayedCall(800 / spd, () => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const toHit = d20 + this.enemy.atk / 2;
      const targetAC = 10 + window.gameState.hero.def;

      if (d20 === 20 || toHit >= targetAC) {
        const isCrit = d20 === 20;
        let damage = Math.floor(Math.random() * 6) + 2 + Math.floor(this.enemy.atk / 2) - Math.floor(window.gameState.hero.def / 2);
        damage = Math.max(1, damage);
        
        if (isCrit) damage *= 2;

        this.battleLogText.setText(`Ouch! Enemy deals ${damage} damage!`);
        window.gameState.log(`${this.enemy.name} rolled ${toHit} to hit! Dealt ${damage} damage to you.`, 'enemy-turn');

        this.animateStrike(this.enemySprite, this.playerSprite);
        this.cameras.main.shake(150 / spd, 0.01);
        window.gameState.hero.hp = Math.max(0, window.gameState.hero.hp - damage);
        window.gameState.updateHUD();
        this.updateStatsUI();

        this.time.delayedCall(1200 / spd, () => this.postTurnCycle());
      } else {
        this.battleLogText.setText(`${this.enemy.name} missed!`);
        window.gameState.log(`${this.enemy.name} rolled ${toHit} to hit. Attack missed.`, 'enemy-turn');
        this.time.delayedCall(1000 / spd, () => this.postTurnCycle());
      }
    });
  }

  postTurnCycle() {
    const spd = window.gameState.combatSpeed;
    if (window.gameState.hero.hp <= 0) {
      this.battleLogText.setText("You have been defeated!");
      window.gameState.log("Your HP dropped to 0. You fell in battle.", "enemy-turn");
      this.time.delayedCall(1500 / spd, () => {
        window.gameState.combatActive = false;
        this.scene.start('GameOverScene', { won: false });
      });
      return;
    }

    this.combatRound++;
    this.isPlayerTurn = true;
    this.actionActive = false;
    this.battleLogText.setText("Your Turn! Choose action.");
    this.showMenu();
  }

  checkCombatStatus() {
    const spd = window.gameState.combatSpeed;
    if (this.enemy.hp <= 0) {
      this.battleLogText.setText(`${this.enemy.name} has fallen!`);
      window.gameState.log(`${this.enemy.name} was defeated. Victory!`);

      this.time.delayedCall(1000 / spd, () => {
        if (this.isBoss) {
          window.gameState.bossDefeated = true;
          window.EncounterSystem.rollWeaponDrop(true);
          this.scene.start('GameOverScene', { won: true });
        } else {
          window.gameState.addExp(this.enemy.expReward);

          // Warlord-specific quest progression
          if (this.isWarlord) {
            window.EncounterSystem.onEnemyDefeated(true, this.enemy.name);
          } else {
            window.EncounterSystem.rollWeaponDrop(false);
          }

          window.gameState.combatActive = false;
          this.scene.start('WorldScene');
        }
      });
    } else {
      this.isPlayerTurn = false;
      this.enemyTurn();
    }
  }

  updateStatsUI() {
    this.playerHpText.setText(`HP: ${window.gameState.hero.hp}/${window.gameState.hero.maxHp}`);
    this.enemyHpText.setText(`HP: ${this.enemy.hp}/${this.enemy.maxHp}`);
  }

  animateStrike(attacker, defender) {
    const spd = window.gameState.combatSpeed;
    const originX = attacker.x;
    const targetX = defender.x;
    const moveX = originX < targetX ? 30 : -30;

    this.tweens.add({
      targets: attacker,
      x: originX + moveX,
      duration: 80 / spd,
      yoyo: true,
      ease: 'Quad.easeInOut',
      onComplete: () => {
        attacker.x = originX;
        this.tweens.add({
          targets: defender,
          tint: 0xff0000,
          duration: 100 / spd,
          yoyo: true,
          onComplete: () => {
            defender.clearTint();
          }
        });
      }
    });
  }
}
