// Tome of Valor - Main Application Bootstrapper

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Show a loading text while custom fonts render
    const progress = this.add.graphics();
    this.add.text(320, 200, 'TOME OF VALOR', {
      fontFamily: 'Cinzel',
      fontSize: '36px',
      color: '#b78a3e',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const txt = this.add.text(320, 260, 'Loading medieval lands...', {
      fontFamily: 'Cinzel',
      fontSize: '14px',
      color: '#d5bdaf'
    }).setOrigin(0.5);

    // Dynamic generation takes less than a frame, so we simulate a tiny delay to let fonts settle
    this.load.on('complete', () => {
      progress.destroy();
      txt.destroy();
    });
  }

  create() {
    window.SpriteGenerator.generateTextures(this);
    window.gameState.updateHUD();
    // Go to story intro first, then customization
    this.scene.start('StoryScene');
  }
}

// Phaser Configuration with 24fps target limit
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  parent: 'phaser-game-container',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  fps: {
    target: 24,
    forceSetTimeOut: true
  },
  scene: [BootScene, StoryScene, CustomizationScene, WorldScene, CombatScene, GameOverScene]
};

// Initialize Phaser Game
window.game = new Phaser.Game(config);
