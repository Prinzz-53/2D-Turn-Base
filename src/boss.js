// Tome of Valor - Game Ending Scene (GameOverScene)

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    const won = data.won || false;
    window.gameState.combatActive = false;

    // Background panel
    this.add.rectangle(320, 240, 640, 480, 0x0b090a);
    
    // Draw decorative border
    const border = this.add.graphics();
    border.lineStyle(4, won ? 0xb78a3e : 0xe5383b, 0.8);
    border.strokeRect(20, 20, 600, 440);

    if (won) {
      this.add.text(320, 100, 'VICTORY!', {
        fontFamily: 'Cinzel',
        fontSize: '48px',
        color: '#b78a3e',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      this.add.text(320, 160, 'The Dragon Lord Ashardalon has been vanquished!', {
        fontFamily: 'Cinzel',
        fontSize: '16px',
        color: '#f5ebe0'
      }).setOrigin(0.5);

      this.add.sprite(320, 240, 'player').setScale(4).setAngle(0);
      
      this.add.text(320, 320, `You saved the realm at Level ${window.gameState.hero.level}!`, {
        fontFamily: 'Press Start 2P',
        fontSize: '10px',
        color: '#ffd166'
      }).setOrigin(0.5);

      window.gameState.log("CONGRATULATIONS! You defeated the Dark Dragon Lord and saved the medieval lands of Valor!", "loot");
    } else {
      this.add.text(320, 120, 'YOU DIED', {
        fontFamily: 'Cinzel',
        fontSize: '48px',
        color: '#e5383b',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      this.add.text(320, 180, 'Your bones lay silent in the deep crypts...', {
        fontFamily: 'Cinzel',
        fontSize: '16px',
        color: '#d5bdaf'
      }).setOrigin(0.5);

      this.add.sprite(320, 250, 'player').setScale(3.5).setAngle(90);

      this.add.text(320, 320, `You fell at Level ${window.gameState.hero.level}.`, {
        fontFamily: 'Press Start 2P',
        fontSize: '10px',
        color: '#e5383b'
      }).setOrigin(0.5);

      window.gameState.log("GAME OVER. Try exploring the overworld to level up and find better weapons before facing the Boss.", "enemy-turn");
    }

    const restartBtn = this.add.text(320, 380, 'QUEST ANEW', {
      fontFamily: 'Press Start 2P',
      fontSize: '12px',
      color: '#0b090a',
      backgroundColor: won ? '#b78a3e' : '#e5383b',
      padding: { x: 20, y: 10 },
      align: 'center'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerdown', () => {
      this.restartGame();
    });

    restartBtn.on('pointerover', () => {
      restartBtn.setBackgroundColor(won ? '#fcbf49' : '#f77f00');
    });

    restartBtn.on('pointerout', () => {
      restartBtn.setBackgroundColor(won ? '#b78a3e' : '#e5383b');
    });
  }

  restartGame() {
    // Reset global state
    window.gameState.hero = {
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: window.RPG_CONFIG.BASE_HP,
      maxHp: window.RPG_CONFIG.BASE_HP,
      mp: window.RPG_CONFIG.BASE_MP,
      maxMp: window.RPG_CONFIG.BASE_MP,
      atk: window.RPG_CONFIG.BASE_ATK,
      def: window.RPG_CONFIG.BASE_DEF,
      specialAbilityName: 'Mana Burst',
      specialAbilityCost: 15
    };
    
    window.gameState.inventory = {
      potions: 0
    };

    window.gameState.weapons = ['Fists'];
    window.gameState.equippedWeapon = 'Fists';
    window.gameState.autoWalkActive = false;
    window.gameState.autoCombatActive = false;
    window.gameState.combatSpeed = 1;

    // Reset toolbar buttons
    const autoWalkBtn = document.getElementById('autowalk-btn');
    if (autoWalkBtn) {
      autoWalkBtn.classList.remove('active');
      autoWalkBtn.querySelector('.btn-text').textContent = 'AUTO WALK: OFF';
    }
    const autoCombatBtn = document.getElementById('autocombat-btn');
    if (autoCombatBtn) {
      autoCombatBtn.classList.remove('active');
      autoCombatBtn.querySelector('.btn-text').textContent = 'AUTO COMBAT: OFF';
    }
    const speedBtn = document.getElementById('speed-btn');
    if (speedBtn) {
      speedBtn.classList.remove('active');
      speedBtn.querySelector('.btn-text').textContent = 'SPEED: 1x';
    }

    window.EncounterSystem.chestsOpened = 0;
    window.gameState.openedChests = new Set(); // Chests respawn on a brand new quest
    window.gameState.playerGridPos = { x: 2, y: 17 };
    window.gameState.bossDefeated = false;
    window.gameState.combatActive = false;
    
    const logBox = document.getElementById('log-text');
    if (logBox) logBox.innerHTML = '';
    
    window.gameState.log("A new adventurer steps forward into the Realm...", "system");
    window.gameState.updateHUD();

    this.scene.start('CustomizationScene');
  }
}
