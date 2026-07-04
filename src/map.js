// Tome of Valor - Overworld Map Scene (WorldScene)

class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
  }

  create() {
    window.SpriteGenerator.generateTextures(this);

    this.tileSize = window.RPG_CONFIG.TILE_SIZE;
    this.mapCols  = window.RPG_CONFIG.MAP_WIDTH;
    this.mapRows  = window.RPG_CONFIG.MAP_HEIGHT;

    // =====================================================================
    //  25 x 25 REDESIGNED MAP LAYOUT (บอสอยู่ขวาบน / ของอยู่ระหว่างทาง / แก้ทางตันรอบจุดเกิด)
    //  0: Grass (walkable / encounter)
    //  1: Stone path (walkable)
    //  2: Forest / Tree (impassable)
    //  3: Water (impassable)
    //  4: Castle — Dragon Lord (BOSS อยู่ขวาบนสุด)
    //  5: Chest (Sacred Relic inside)
    //  6: Shrine (restore HP & MP)
    //  7: Warlord Lair (mini-boss encounter)
    // =====================================================================
    this.mapData = [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,2], // Row 0 - ปราสาทบอสใหญ่อยู่ขวาบนพิกัด (23,0)
      [2,2,2,2,2,3,3,3,3,2,2,2,2,5,1,1,1,1,1,1,1,1,1,1,2], // Row 1 - ทางเดินหินก่อนเข้าปราสาท พร้อมหีบสมบัติท้ายเกม
      [2,5,2,2,2,3,3,3,3,2,2,1,1,1,2,2,2,2,2,2,2,2,2,1,2], // Row 2 - หีบสมบัติหลบมุมซ้ายบน
      [2,1,2,2,2,2,3,3,2,2,1,1,2,2,2,2,5,1,1,1,1,1,2,1,2], // Row 3 - Warlord 3 เฝ้าทางผ่านสุดท้ายพิกัด (16,3)
      [2,1,1,1,1,2,2,2,2,1,1,0,0,0,2,2,2,2,2,2,2,1,2,1,2], // Row 4
      [2,2,2,2,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,2,1,2,1,2], // Row 5
      [2,6,1,1,1,2,2,2,2,2,1,1,1,2,2,2,2,2,2,1,2,1,2,1,2], // Row 6 - แท่นบูชาด้านซ้ายบนสำหรับฟื้นพลังก่อนลุยบอส
      [2,2,2,2,1,2,2,5,2,2,2,2,1,2,3,3,3,3,2,1,2,1,1,7,2], // Row 7 - หีบสมบัติซ่อนในป่าสองฝั่ง
      [2,2,2,2,1,1,2,7,2,2,2,2,1,2,3,3,3,3,2,1,2,2,2,2,2], // Row 8
      [2,2,1,1,1,1,1,1,1,1,1,1,1,2,3,3,3,3,2,1,1,1,1,1,2], // Row 9 - Warlord 2 ดักโจมตีตรงช่องแคบขวากลางแมพ (23,9)
      [2,1,1,0,0,0,0,0,0,0,0,0,1,2,2,3,3,2,2,2,2,2,2,1,2], // Row 10 - โซนทุ่งหญ้ากลางแมพกว้างขวาง
      [2,1,0,0,0,6,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2], // Row 11 - แท่นบูชาให้แวะพักฟื้นพลัง
      [2,1,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,1,2], // Row 12
      [2,1,2,5,1,1,1,1,2,0,0,0,2,2,1,1,1,1,1,1,2,2,2,1,2], // Row 13 - หีบสมบัติระหว่างทางช่วงกลางเกม
      [2,1,2,2,2,2,2,1,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,1,2], // Row 14
      [2,1,1,1,1,1,2,1,1,1,1,1,7,1,1,2,6,2,2,1,1,1,2,1,2], // Row 15 - Warlord 1 คอยคุมพิกัดก่อนผู้เล่นจะขึ้นเหนือ
      [2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,2,1,2], // Row 16
      [2,5,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,5,2,1,2,1,2], // Row 17 - หีบสมบัติสองข้างทางเดินช่วงต้นเกม
      [2,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1,2,1,2,1,2], // Row 18
      [2,1,2,1,1,1,1,1,0,0,0,0,0,0,0,2,1,1,1,1,2,1,1,1,2], // Row 19
      [2,1,2,2,2,2,2,1,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,1,2], // Row 20
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,2], // Row 21 -> [FIXED] เปลี่ยนเลข 2 ฝั่งซ้ายเป็น 0
      [2,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2], // Row 22 -> [FIXED] เปลี่ยนเลข 2 ฝั่งซ้ายเป็น 0 (จุดเกิดผู้เล่น x:2, y:22)
      [2,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,2], // Row 23 -> [FIXED] เปลี่ยนเลข 2 ฝั่งซ้ายเป็น 0
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]  // Row 24
    ];

    this.tilesGroup  = this.add.group();
    this.chestsMap   = {};
    this.shrinesMap  = {};
    this.warlordsMap = {};

    // Render Grid
    for (let r = 0; r < this.mapRows; r++) {
      for (let c = 0; c < this.mapCols; c++) {
        const x       = c * this.tileSize + this.tileSize / 2;
        const y       = r * this.tileSize + this.tileSize / 2;
        let   tileVal = this.mapData[r][c];

        let tileKey = 'grass';
        if (tileVal === 1) tileKey = 'stone';
        else if (tileVal === 2) tileKey = 'tree';
        else if (tileVal === 3) tileKey = 'water';
        else if (tileVal === 4) tileKey = 'castle';
        else if (tileVal === 5) {
          if (window.gameState.openedChests.has(`${c},${r}`)) {
            tileKey = 'stone';
            this.mapData[r][c] = 1;
          } else {
            tileKey = 'chest';
            this.chestsMap[`${c},${r}`] = true;
          }
        } else if (tileVal === 6) {
          tileKey = 'shrine';
          this.shrinesMap[`${c},${r}`] = true;
        } else if (tileVal === 7) {
          // Check if this warlord was already defeated
          if (window.gameState.openedChests.has(`warlord_${c},${r}`)) {
            tileKey = 'stone';
            this.mapData[r][c] = 1;
          } else {
            tileKey = 'warlord';
            this.warlordsMap[`${c},${r}`] = true;
          }
        }

        const tileSprite = this.add.sprite(x, y, tileKey);
        this.tilesGroup.add(tileSprite);
      }
    }

    this.physics.world.setBounds(0, 0, this.mapCols * this.tileSize, this.mapRows * this.tileSize);

    this.playerX = window.gameState.playerGridPos.x;
    this.playerY = window.gameState.playerGridPos.y;

    const px = this.playerX * this.tileSize + this.tileSize / 2;
    const py = this.playerY * this.tileSize + this.tileSize / 2;
    this.player   = this.add.sprite(px, py, 'player');
    this.isMoving = false;

    this.cameras.main.setBounds(0, 0, this.mapCols * this.tileSize, this.mapRows * this.tileSize);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.5);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd    = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.lastAutoMoveTime = 0;

    window.gameState.updateHUD();

    // Show intro log if first time entering world
    if (!window.gameState._worldStarted) {
      window.gameState._worldStarted = true;
      window.gameState.log('The realm of Valdor awaits. Find the 3 Sacred Relics and defeat Ashardalon\'s 3 Warlords to unlock the Dark Castle!', 'system');
      window.gameState.log('💡 Shrines restore HP & MP. Chests hold Sacred Relics. Skull lairs are Warlord dens!', 'system');
    }
  }

  update() {
    if (this.isMoving || window.gameState.combatActive) return;

    // Auto-Walk
    if (window.gameState.autoWalkActive) {
      const timeNow = this.time.now;
      if (timeNow - this.lastAutoMoveTime > 280) {
        this.lastAutoMoveTime = timeNow;
        const dir = window.AutoPlay.decideMapMovement(this);
        if (dir) {
          let tx = this.playerX;
          let ty = this.playerY;
          if (dir === 'up') ty--;
          else if (dir === 'down') ty++;
          else if (dir === 'left') tx--;
          else if (dir === 'right') tx++;
          this.tryMoveTo(tx, ty);
        }
      }
      return;
    }

    // Manual Controls
    let targetX = this.playerX;
    let targetY = this.playerY;

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  targetX--;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) targetX++;
    else if (this.cursors.up.isDown    || this.wasd.up.isDown)    targetY--;
    else if (this.cursors.down.isDown  || this.wasd.down.isDown)  targetY++;

    if (targetX !== this.playerX || targetY !== this.playerY) {
      this.tryMoveTo(targetX, targetY);
    }
  }

  tryMoveTo(gridX, gridY) {
    if (gridX < 0 || gridX >= this.mapCols || gridY < 0 || gridY >= this.mapRows) return;

    const tileVal = this.mapData[gridY][gridX];
    if (tileVal === 2 || tileVal === 3) return;

    this.isMoving = true;
    this.playerX  = gridX;
    this.playerY  = gridY;
    window.gameState.playerGridPos = { x: gridX, y: gridY };

    const targetPx = this.playerX * this.tileSize + this.tileSize / 2;
    const targetPy = this.playerY * this.tileSize + this.tileSize / 2;

    this.tweens.add({
      targets:  this.player,
      x:        targetPx,
      y:        targetPy,
      duration: 150,
      onComplete: () => {
        this.isMoving = false;
        this.handleTileEvents(gridX, gridY, tileVal);
      }
    });
  }

  handleTileEvents(gridX, gridY, tileVal) {

    // === BOSS CASTLE (gated by quest) ===
    if (tileVal === 4) {
      if (!window.gameState.quest.bossUnlocked) {
        const wLeft = window.RPG_CONFIG.QUEST_WARLORDS_NEEDED - window.gameState.quest.warlordsDefeated;
        const rLeft = window.RPG_CONFIG.QUEST_RELICS_NEEDED   - window.gameState.quest.relicsFound;
        window.gameState.log(
          `⛔ The castle gate is sealed by dark magic! Defeat ${wLeft} more Warlord(s) and find ${rLeft} more Relic(s) first.`,
          'system'
        );
        return;
      }
      window.gameState.log('The seal shatters! The Dragon Lord Ashardalon roars as you enter the Dark Castle!', 'system');
      this.scene.start('CombatScene', { isBoss: true });
      return;
    }

    // === WARLORD LAIR ===
    if (tileVal === 7 && this.warlordsMap[`${gridX},${gridY}`]) {
      this.warlordsMap[`${gridX},${gridY}`] = false;
      window.gameState.openedChests.add(`warlord_${gridX},${gridY}`);
      this.replaceTileSprite(gridX, gridY, 'stone');
      this.mapData[gridY][gridX] = 1;
      const warlordIndex = window.gameState.quest.warlordsDefeated; 
      const warlord = window.EncounterSystem.getWarlord(warlordIndex);
      window.gameState.log(`⚠️ A Warlord of Ashardalon appears: ${warlord.name}! Prepare for battle!`, 'enemy-turn');
      this.scene.start('CombatScene', { isBoss: false, isWarlord: true, enemy: warlord });
      return;
    }

    // === CHEST ===
    if (tileVal === 5 && this.chestsMap[`${gridX},${gridY}`]) {
      this.chestsMap[`${gridX},${gridY}`] = false;
      this.replaceTileSprite(gridX, gridY, 'stone');
      this.mapData[gridY][gridX] = 1;
      window.gameState.openedChests.add(`${gridX},${gridY}`);
      window.EncounterSystem.openChest(gridX, gridY);
      return;
    }

    // === SHRINE ===
    if (tileVal === 6) {
      const hero = window.gameState.hero;
      if (hero.hp < hero.maxHp || hero.mp < hero.maxMp) {
        window.gameState.log('You rest at the glowing Shrine... HP and Mana fully restored!', 'system');
        hero.hp = hero.maxHp;
        hero.mp = hero.maxMp;
        window.gameState.updateHUD();
      } else {
        window.gameState.log('The Shrine glows warmly — you are already at full strength.', 'system');
      }
      return;
    }

    // === RANDOM ENCOUNTER ===
    if (tileVal === 0 || tileVal === 1) {
      const roll = Math.random();
      if (roll < window.RPG_CONFIG.ENCOUNTER_RATE) {
        this.triggerRandomEncounter();
      }
    }
  }

  triggerRandomEncounter() {
    const encounter = window.EncounterSystem.rollEncounter();

    if (encounter.type === 'fight') {
      window.gameState.log(`Ambushed by a ${encounter.name}! Defeat it to survive!`, 'enemy-turn');
      this.scene.start('CombatScene', { isBoss: false, isWarlord: false, enemy: encounter });
    } else if (encounter.type === 'trap') {
      window.gameState.log(encounter.description, 'system');
      window.gameState.hero.hp = Math.max(1, window.gameState.hero.hp - encounter.damage);
      window.gameState.updateHUD();
    } else if (encounter.type === 'gold') {
      window.gameState.log(encounter.description, 'loot');
      window.gameState.addExp(30);
    }
  }

  replaceTileSprite(gridX, gridY, newKey) {
    const px = gridX * this.tileSize + this.tileSize / 2;
    const py = gridY * this.tileSize + this.tileSize / 2;

    this.tilesGroup.getChildren().forEach(child => {
      if (child.x === px && child.y === py) child.destroy();
    });

    const replacement = this.add.sprite(px, py, newKey);
    this.tilesGroup.add(replacement);
  }
}