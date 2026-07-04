// Tome of Valor - Story Intro Scene

class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create() {
    const W = 640, H = 480;

    // Dark background
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000);

    // Story pages / slides
    this.pages = [
      {
        title: 'THE REALM OF VALDOR',
        lines: [
          'Five hundred years of peace...',
          'The ancient Dragon Lord Ashardalon',
          'was bound beneath the Crystal Seal',
          'by the Holy Knight Aldric the Brave.',
          '',
          'The seal... has shattered.'
        ]
      },
      {
        title: 'DARKNESS RISES',
        lines: [
          'Goblin hordes swarm the forests.',
          'Skeleton warriors march the old roads.',
          'Villages burn. Merchants flee.',
          'The King\'s armies have fallen silent.',
          '',
          'Ashardalon\'s castle looms in the north.'
        ]
      },
      {
        title: 'THE PROPHECY',
        lines: [
          'An ancient oracle speaks:',
          '',
          '"Three Champions must fall,',
          ' three ancient relics found,',
          ' only then shall the Dragon\'s weakness',
          ' be revealed to the chosen one."'
        ]
      },
      {
        title: 'YOUR DESTINY',
        lines: [
          'You are that chosen one.',
          '',
          'Travel the cursed realm.',
          'Defeat Ashardalon\'s three Warlords.',
          'Recover the three Sacred Relics.',
          '',
          'Only then — face the Dragon Lord.'
        ]
      }
    ];

    this.currentPage = 0;
    this.lineIndex = 0;
    this.displayedLines = [];
    this.typewriterEvent = null;

    // Decorative border
    const border = this.add.graphics();
    border.lineStyle(3, 0xb78a3e, 0.6);
    border.strokeRect(30, 30, W - 60, H - 60);
    border.lineStyle(1, 0xb78a3e, 0.3);
    border.strokeRect(38, 38, W - 76, H - 76);

    // Title text
    this.titleText = this.add.text(W / 2, 70, '', {
      fontFamily: 'Cinzel',
      fontSize: '26px',
      color: '#b78a3e',
      fontWeight: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Body text container
    this.bodyTexts = [];
    for (let i = 0; i < 7; i++) {
      const t = this.add.text(W / 2, 140 + i * 38, '', {
        fontFamily: 'Cinzel',
        fontSize: '17px',
        color: '#f5ebe0',
        align: 'center'
      }).setOrigin(0.5);
      this.bodyTexts.push(t);
    }

    // Page counter
    this.pageCounter = this.add.text(W / 2, H - 55, '', {
      fontFamily: 'Press Start 2P',
      fontSize: '8px',
      color: '#d5bdaf'
    }).setOrigin(0.5);

    // Prompt
    this.promptText = this.add.text(W / 2, H - 30, 'CLICK or press SPACE to continue...', {
      fontFamily: 'Press Start 2P',
      fontSize: '8px',
      color: '#b78a3e'
    }).setOrigin(0.5);

    // Pulsing prompt
    this.tweens.add({
      targets: this.promptText,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1
    });

    // Input handlers
    this.input.on('pointerdown', () => this.advancePage());
    this.input.keyboard.on('keydown-SPACE', () => this.advancePage());
    this.input.keyboard.on('keydown-ENTER', () => this.advancePage());

    // Draw first page
    this.showPage(0);
  }

  showPage(idx) {
    if (idx >= this.pages.length) {
      this.startGame();
      return;
    }

    const page = this.pages[idx];

    // Clear body texts
    this.bodyTexts.forEach(t => t.setText(''));
    this.titleText.setText(page.title);
    this.pageCounter.setText(`${idx + 1} / ${this.pages.length}`);

    // Typewriter effect for each line
    let lineDelay = 200;
    page.lines.forEach((line, i) => {
      this.time.delayedCall(lineDelay, () => {
        if (this.bodyTexts[i]) {
          this.bodyTexts[i].setText(line);
          // Fade in each line
          this.bodyTexts[i].setAlpha(0);
          this.tweens.add({ targets: this.bodyTexts[i], alpha: 1, duration: 400 });
        }
      });
      lineDelay += 350;
    });
  }

  advancePage() {
    this.currentPage++;
    if (this.currentPage >= this.pages.length) {
      this.startGame();
    } else {
      this.showPage(this.currentPage);
    }
  }

  startGame() {
    this.cameras.main.fade(600, 0, 0, 0, false, (cam, progress) => {
      if (progress === 1) {
        this.scene.start('CustomizationScene');
      }
    });
  }
}
