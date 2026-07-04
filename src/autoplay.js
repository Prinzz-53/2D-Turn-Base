// Tome of Valor - Auto-Play AI Solver (Map navigation & Combat decisions)

window.AutoPlay = {
  // Finds the next grid step to move the player toward the best destination
  decideMapMovement: function(scene) {
    const startX = scene.playerX;
    const startY = scene.playerY;
    const map = scene.mapData;
    const cols = scene.mapCols;
    const rows = scene.mapRows;

    // 1. Determine targets based on player state
    const hpRatio = window.gameState.hero.hp / window.gameState.hero.maxHp;
    const needHeal = hpRatio < 0.5;

    // Find all active targets on map
    const targetShrines = [];
    const targetChests = [];
    let castleTarget = null;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = map[r][c];
        if (val === 4) {
          castleTarget = { x: c, y: r };
        } else if (val === 5 && scene.chestsMap[`${c},${r}`]) {
          targetChests.push({ x: c, y: r });
        } else if (val === 6) {
          targetShrines.push({ x: c, y: r });
        }
      }
    }

    let primaryTargets = [];
    if (needHeal && targetShrines.length > 0) {
      // Prioritize healing shrines when low
      primaryTargets = targetShrines;
    } else if (targetChests.length > 0) {
      // Prioritize chest looting when healthy
      primaryTargets = targetChests;
    } else if (castleTarget) {
      // Final destination is Castle
      primaryTargets = [castleTarget];
    }

    if (primaryTargets.length === 0) return null;

    // 2. BFS Pathfinding to find path to closest target
    const queue = [];
    const visited = new Set();
    
    queue.push({ x: startX, y: startY, path: [] });
    visited.add(`${startX},${startY}`);

    const directions = [
      { dx: 0, dy: -1, name: 'up' },
      { dx: 0, dy: 1, name: 'down' },
      { dx: -1, dx: 0, dy: 0, name: 'left', dx: -1 }, // left correction
      { dx: 1, dy: 0, name: 'right' }
    ];
    // Corrected direction vectors
    const dirs = [
      { x: 0, y: -1, dir: 'up' },
      { x: 0, y: 1, dir: 'down' },
      { x: -1, y: 0, dir: 'left' },
      { x: 1, y: 0, dir: 'right' }
    ];

    let foundPath = null;

    while (queue.length > 0) {
      const current = queue.shift();

      // Check if current coordinate is one of our targets
      const isTarget = primaryTargets.some(t => t.x === current.x && t.y === current.y);
      if (isTarget) {
        foundPath = current.path;
        break;
      }

      // Explore neighbors
      for (const d of dirs) {
        const nx = current.x + d.x;
        const ny = current.y + d.y;

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          const tileVal = map[ny][nx];
          // Passable if not Tree (2) and not Water (3)
          if (tileVal !== 2 && tileVal !== 3) {
            const key = `${nx},${ny}`;
            if (!visited.has(key)) {
              visited.add(key);
              const nextPath = [...current.path, d.dir];
              queue.push({ x: nx, y: ny, path: nextPath });
            }
          }
        }
      }
    }

    // Return the first step direction ('up', 'down', 'left', 'right')
    if (foundPath && foundPath.length > 0) {
      return foundPath[0];
    }

    return null;
  },

  // Chooses the best combat action automatically during player's turn
  decideCombatAction: function(combatScene) {
    const hero = window.gameState.hero;
    const inventory = window.gameState.inventory;
    const weaponName = window.gameState.equippedWeapon;
    const weaponInfo = window.RPG_CONFIG.WEAPON_PROFILES[weaponName] || window.RPG_CONFIG.WEAPON_PROFILES['Fists'];

    // 1. Check HP: use potion if low and available
    const hpRatio = hero.hp / hero.maxHp;
    if (hpRatio < 0.4 && inventory.potions > 0) {
      return 'HEAL POTION';
    }

    // 2. Check Mana: cast special weapon ability if affordable
    if (hero.mp >= weaponInfo.mpCost) {
      return 'SPECIAL';
    }

    // 3. Otherwise: standard attack
    return 'ATTACK';
  }
};
