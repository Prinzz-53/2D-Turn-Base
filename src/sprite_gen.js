// Tome of Valor - Dynamic Pixel Art Sprite Generator

window.SpriteGenerator = {
  // Generate all textures and add them to the Phaser texture manager
  generateTextures: function(scene) {
    this.createTileset(scene);
    this.createChest(scene);
    this.createMonster(scene);
    this.createBoss(scene);
    this.createShrine(scene);
    this.createWarlordLair(scene);
    this.updatePlayerTexture(scene);
  },

  // Create the player texture dynamically based on hair, outfit, AND equipped weapon
  updatePlayerTexture: function(scene) {
    const key = 'player';
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Reset canvas to transparent
    ctx.clearRect(0, 0, size, size);

    const hairStyle = window.gameState.playerCustom.hairStyle;
    const hairColor = window.gameState.playerCustom.hairColor;
    const outfitColor = window.gameState.playerCustom.outfitColor;
    const equippedWeapon = window.gameState.equippedWeapon;
    
    // Base color palettes
    const skinColor = '#ffd0a1';
    const bootColor = '#5e503f';
    const eyeColor = '#0b090a';

    // 1. Torso & Arms (Outfit)
    ctx.fillStyle = outfitColor;
    ctx.fillRect(8, 14, 16, 12); // Torso
    ctx.fillRect(5, 14, 3, 8);   // Left Arm
    ctx.fillRect(24, 14, 3, 8);  // Right Arm

    // 2. Head (Skin)
    ctx.fillStyle = skinColor;
    ctx.fillRect(10, 6, 12, 8);  // Face

    // 3. Eyes
    ctx.fillStyle = eyeColor;
    ctx.fillRect(12, 9, 2, 2);   // Left eye
    ctx.fillRect(18, 9, 2, 2);   // Right eye

    // 4. Legs & Boots
    ctx.fillStyle = bootColor;
    ctx.fillRect(8, 26, 6, 6);   // Left Boot
    ctx.fillRect(18, 26, 6, 6);  // Right Boot

    // 5. Hair Styles
    ctx.fillStyle = hairColor;
    if (hairStyle === 'Spiky') {
      ctx.fillRect(10, 4, 12, 3);
      ctx.fillRect(8, 2, 2, 3);
      ctx.fillRect(13, 2, 2, 3);
      ctx.fillRect(17, 2, 2, 3);
      ctx.fillRect(22, 2, 2, 3);
    } else if (hairStyle === 'Long') {
      ctx.fillRect(10, 4, 12, 3);
      ctx.fillRect(8, 6, 3, 10);
      ctx.fillRect(21, 6, 3, 10);
    } else if (hairStyle === 'Short') {
      ctx.fillRect(9, 4, 14, 3);
      ctx.fillRect(9, 6, 2, 4);
      ctx.fillRect(21, 6, 2, 4);
    } else if (hairStyle === 'Wizard') {
      ctx.fillStyle = outfitColor;
      ctx.fillRect(6, 4, 20, 2); // Brim
      ctx.fillRect(10, 2, 12, 2);
      ctx.fillRect(12, 0, 8, 2);
      ctx.fillStyle = '#ffb703'; // gold band
      ctx.fillRect(10, 4, 12, 1);
    }

    // 6. Hands
    ctx.fillStyle = skinColor;
    ctx.fillRect(5, 20, 3, 3);   // Left Hand
    ctx.fillRect(24, 20, 3, 3);  // Right Hand

    // 7. Equip Weapon Drawing (in the Right Hand area)
    if (equippedWeapon === 'Rusty Dagger') {
      ctx.fillStyle = '#495057'; // hilt
      ctx.fillRect(25, 17, 1, 3);
      ctx.fillStyle = '#adb5bd'; // iron blade
      ctx.fillRect(25, 11, 1, 6);
    } 
    else if (equippedWeapon === 'Wizard Wand') {
      ctx.fillStyle = '#8b5a2b'; // wood wand
      ctx.fillRect(25, 13, 1, 7);
      ctx.fillStyle = '#ffb703'; // glowing orb magic tip
      ctx.fillRect(24, 10, 3, 3);
    } 
    else if (equippedWeapon === 'Iron Greatsword') {
      ctx.fillStyle = '#3d2314'; // grip
      ctx.fillRect(25, 19, 1, 4);
      ctx.fillStyle = '#b78a3e'; // guard
      ctx.fillRect(23, 18, 5, 1);
      ctx.fillStyle = '#84a59d'; // broad steel blade
      ctx.fillRect(24, 4, 3, 14);
    } 
    else if (equippedWeapon === 'Magic Sword') {
      ctx.fillStyle = '#3d2314'; // grip
      ctx.fillRect(25, 18, 1, 3);
      ctx.fillStyle = '#fcbf49'; // golden crossguard
      ctx.fillRect(23, 17, 5, 1);
      ctx.fillStyle = '#00f5d4'; // neon cyan blade
      ctx.fillRect(24, 6, 3, 11);
      ctx.fillStyle = '#ffffff'; // sparkling tip
      ctx.fillRect(25, 4, 1, 2);
    }

    // Inject into Phaser's Texture Manager (overwrite if already exists)
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }
    scene.textures.addCanvas(key, canvas);
  },

  createTileset: function(scene) {
    const size = 32;
    const tiles = ['grass', 'stone', 'water', 'tree', 'castle'];

    tiles.forEach(tileType => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      if (tileType === 'grass') {
        ctx.fillStyle = '#3f7d20';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#34621c';
        for (let i = 0; i < 6; i++) {
          let rx = Math.floor(Math.random() * (size - 4));
          let ry = Math.floor(Math.random() * (size - 4));
          ctx.fillRect(rx, ry, 2, 4);
          ctx.fillRect(rx + 2, ry + 2, 2, 2);
        }
      } else if (tileType === 'stone') {
        ctx.fillStyle = '#6c757d';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#495057';
        ctx.fillRect(0, 0, size, 2);
        ctx.fillRect(0, 0, 2, size);
        ctx.fillRect(10, 8, 8, 2);
        ctx.fillRect(20, 18, 10, 2);
        ctx.fillRect(6, 22, 6, 2);
      } else if (tileType === 'water') {
        ctx.fillStyle = '#0077b6';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#90e0ef';
        ctx.fillRect(4, 6, 8, 2);
        ctx.fillRect(16, 12, 10, 2);
        ctx.fillRect(8, 22, 12, 2);
      } else if (tileType === 'tree') {
        ctx.fillStyle = '#3f7d20';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(14, 18, 4, 14);
        ctx.fillStyle = '#1b4332';
        ctx.beginPath();
        ctx.arc(16, 14, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.arc(14, 12, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (tileType === 'castle') {
        ctx.fillStyle = '#2f3e46';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#84a59d';
        ctx.fillRect(0, 0, size, 4);
        ctx.fillRect(4, 4, 6, 4);
        ctx.fillRect(22, 4, 6, 4);
        ctx.fillStyle = '#f77f00';
        ctx.fillRect(12, 12, 8, 12);
        ctx.fillStyle = '#fcbf49';
        ctx.fillRect(14, 10, 4, 2);
      }

      if (scene.textures.exists(tileType)) {
        scene.textures.remove(tileType);
      }
      scene.textures.addCanvas(tileType, canvas);
    });
  },

  createChest: function(scene) {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#3f7d20';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#6f4e37';
    ctx.fillRect(6, 10, 20, 16);
    ctx.fillStyle = '#3d2314';
    ctx.fillRect(6, 10, 20, 3);
    ctx.fillRect(6, 18, 20, 2);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(8, 10, 2, 16);
    ctx.fillRect(22, 10, 2, 16);
    ctx.fillRect(14, 16, 4, 4);
    ctx.fillStyle = '#000';
    ctx.fillRect(15, 17, 2, 2);

    if (scene.textures.exists('chest')) {
      scene.textures.remove('chest');
    }
    scene.textures.addCanvas('chest', canvas);
  },

  createMonster: function(scene) {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#2d6a4f';
    ctx.fillRect(8, 10, 16, 16);
    ctx.fillRect(4, 8, 4, 4);
    ctx.fillRect(24, 8, 4, 4);
    ctx.fillStyle = '#e63946';
    ctx.fillRect(11, 12, 2, 2);
    ctx.fillRect(19, 12, 2, 2);
    ctx.fillStyle = '#adb5bd';
    ctx.fillRect(4, 14, 4, 12);
    ctx.fillStyle = '#495057';
    ctx.fillRect(4, 26, 4, 4);

    if (scene.textures.exists('goblin')) {
      scene.textures.remove('goblin');
    }
    scene.textures.addCanvas('goblin', canvas);
  },

  createBoss: function(scene) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#370617';
    ctx.fillRect(16, 16, 32, 40);
    ctx.fillStyle = '#6a040f';
    ctx.fillRect(12, 8, 8, 8);
    ctx.fillRect(44, 8, 8, 8);
    ctx.fillStyle = '#f77f00';
    ctx.fillRect(24, 8, 16, 8);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(22, 24, 4, 4);
    ctx.fillRect(38, 24, 4, 4);
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(8, 8, 6, 48);
    ctx.fillStyle = '#fcbf49';
    ctx.fillRect(4, 44, 14, 4);
    ctx.fillStyle = '#3d2314';
    ctx.fillRect(9, 48, 4, 12);

    if (scene.textures.exists('boss')) {
      scene.textures.remove('boss');
    }
    scene.textures.addCanvas('boss', canvas);
  },

  createShrine: function(scene) {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#3f7d20';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(8, 20, 16, 12);
    ctx.fillRect(12, 10, 8, 10);
    ctx.fillStyle = '#d8f3dc';
    ctx.beginPath();
    ctx.arc(16, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b7094c';
    ctx.beginPath();
    ctx.arc(16, 8, 4, 0, Math.PI * 2);
    ctx.fill();

    if (scene.textures.exists('shrine')) {
      scene.textures.remove('shrine');
    }
    scene.textures.addCanvas('shrine', canvas);
  },

  createWarlordLair: function(scene) {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Dark menacing ground
    ctx.fillStyle = '#2d0a0a';
    ctx.fillRect(0, 0, size, size);

    // Border glow
    ctx.strokeStyle = '#c9184a';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 28, 28);

    // Skull head
    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(9, 6, 14, 12);    // skull dome
    ctx.fillRect(7, 14, 18, 8);    // jaw

    // Skull eyes (dark)
    ctx.fillStyle = '#2d0a0a';
    ctx.fillRect(11, 9, 4, 4);
    ctx.fillRect(17, 9, 4, 4);

    // Skull nose
    ctx.fillRect(15, 14, 2, 2);

    // Teeth
    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(10, 22, 3, 4);
    ctx.fillRect(14, 22, 3, 4);
    ctx.fillRect(18, 22, 3, 4);

    // Red glow particles
    ctx.fillStyle = '#c9184a';
    ctx.fillRect(3, 3, 2, 2);
    ctx.fillRect(27, 3, 2, 2);
    ctx.fillRect(3, 27, 2, 2);
    ctx.fillRect(27, 27, 2, 2);

    if (scene.textures.exists('warlord')) {
      scene.textures.remove('warlord');
    }
    scene.textures.addCanvas('warlord', canvas);
  }
};
