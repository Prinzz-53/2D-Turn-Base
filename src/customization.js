// Tome of Valor - Character Customization Scene

class CustomizationScene extends Phaser.Scene {
  constructor() {
    super('CustomizationScene');
  }

  create() {
    // Shared parameters
    const hairStyles = ['Spiky', 'Long', 'Short', 'Wizard'];
    const hairColors = [
      { name: 'Gold', value: '#ffd166' },
      { name: 'Brown', value: '#6f4e37' },
      { name: 'Crimson', value: '#e63946' },
      { name: 'Aqua', value: '#00b4d8' }
    ];
    const outfitColors = [
      { name: 'Red', value: '#a12a32' },
      { name: 'Green', value: '#2d6a4f' },
      { name: 'Blue', value: '#0077b6' },
      { name: 'Purple', value: '#7209b7' }
    ];

    let hairStyleIndex = 0;
    let hairColorIndex = 0;
    let outfitColorIndex = 0;

    // Apply defaults to global state
    window.gameState.playerCustom.hairStyle = hairStyles[hairStyleIndex];
    window.gameState.playerCustom.hairColor = hairColors[hairColorIndex].value;
    window.gameState.playerCustom.outfitColor = outfitColors[outfitColorIndex].value;

    // Ensure all sprites are built
    window.SpriteGenerator.generateTextures(this);

    // Title Texts
    const titleText = this.add.text(320, 50, 'CREATE YOUR HERO', {
      fontFamily: 'Cinzel',
      fontSize: '32px',
      color: '#b78a3e',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const helpText = this.add.text(320, 90, 'Click options to customize your look', {
      fontFamily: 'Cinzel',
      fontSize: '16px',
      color: '#d5bdaf'
    }).setOrigin(0.5);

    // Large Live Hero Preview Box
    const previewBox = this.add.graphics();
    previewBox.lineStyle(2, 0xb78a3e, 0.5);
    previewBox.fillStyle(0x160e12, 0.8);
    previewBox.strokeRect(240, 120, 160, 160);
    previewBox.fillRect(240, 120, 160, 160);

    // Dynamic Player Sprite
    const playerSprite = this.add.sprite(320, 200, 'player').setScale(3.5);

    // Render configuration buttons/labels
    const createOption = (yPos, label, getValueText, onPrev, onNext) => {
      this.add.text(120, yPos, label, {
        fontFamily: 'Cinzel',
        fontSize: '18px',
        color: '#d5bdaf',
        fontWeight: 'bold'
      }).setOrigin(0, 0.5);

      const valText = this.add.text(320, yPos, getValueText(), {
        fontFamily: 'Press Start 2P',
        fontSize: '12px',
        color: '#f5ebe0'
      }).setOrigin(0.5);

      const leftBtn = this.add.text(240, yPos, '◀', {
        fontFamily: 'Cinzel',
        fontSize: '24px',
        color: '#b78a3e'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      const rightBtn = this.add.text(400, yPos, '▶', {
        fontFamily: 'Cinzel',
        fontSize: '24px',
        color: '#b78a3e'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      leftBtn.on('pointerdown', () => {
        onPrev();
        valText.setText(getValueText());
        window.SpriteGenerator.updatePlayerTexture(this);
        playerSprite.setTexture('player');
      });

      rightBtn.on('pointerdown', () => {
        onNext();
        valText.setText(getValueText());
        window.SpriteGenerator.updatePlayerTexture(this);
        playerSprite.setTexture('player');
      });
      
      // Simple hover feedback
      [leftBtn, rightBtn].forEach(btn => {
        btn.on('pointerover', () => btn.setColor('#f5ebe0'));
        btn.on('pointerout', () => btn.setColor('#b78a3e'));
      });
    };

    // Hair Style Select
    createOption(310, 'Hair Style', 
      () => hairStyles[hairStyleIndex],
      () => {
        hairStyleIndex = (hairStyleIndex - 1 + hairStyles.length) % hairStyles.length;
        window.gameState.playerCustom.hairStyle = hairStyles[hairStyleIndex];
      },
      () => {
        hairStyleIndex = (hairStyleIndex + 1) % hairStyles.length;
        window.gameState.playerCustom.hairStyle = hairStyles[hairStyleIndex];
      }
    );

    // Hair Color Select
    createOption(350, 'Hair Color', 
      () => hairColors[hairColorIndex].name,
      () => {
        hairColorIndex = (hairColorIndex - 1 + hairColors.length) % hairColors.length;
        window.gameState.playerCustom.hairColor = hairColors[hairColorIndex].value;
      },
      () => {
        hairColorIndex = (hairColorIndex + 1) % hairColors.length;
        window.gameState.playerCustom.hairColor = hairColors[hairColorIndex].value;
      }
    );

    // Outfit Color Select
    createOption(390, 'Outfit Color', 
      () => outfitColors[outfitColorIndex].name,
      () => {
        outfitColorIndex = (outfitColorIndex - 1 + outfitColors.length) % outfitColors.length;
        window.gameState.playerCustom.outfitColor = outfitColors[outfitColorIndex].value;
      },
      () => {
        outfitColorIndex = (outfitColorIndex + 1) % outfitColors.length;
        window.gameState.playerCustom.outfitColor = outfitColors[outfitColorIndex].value;
      }
    );

    // Begin Quest button
    const beginQuestBtn = this.add.text(320, 440, 'BEGIN QUEST', {
      fontFamily: 'Press Start 2P',
      fontSize: '14px',
      color: '#0b090a',
      backgroundColor: '#b78a3e',
      padding: { x: 20, y: 10 },
      align: 'center'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    beginQuestBtn.on('pointerdown', () => {
      // Complete initialization of player values
      window.gameState.updateHUD();
      window.gameState.log(`Hero customization complete! Welcome to the Lands of Valor.`);
      window.gameState.log(`Explore the map to locate the Castle. Watch out for goblins!`);
      this.scene.start('WorldScene');
    });

    beginQuestBtn.on('pointerover', () => {
      beginQuestBtn.setBackgroundColor('#fcbf49');
      beginQuestBtn.setStyle({ color: '#000' });
    });
    beginQuestBtn.on('pointerout', () => {
      beginQuestBtn.setBackgroundColor('#b78a3e');
      beginQuestBtn.setStyle({ color: '#0b090a' });
    });
  }
}
