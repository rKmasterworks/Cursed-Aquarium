const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

const initialData = {
  passwords: {
    'tank': 'tank',
    'main dps': 'main dps',
    'flex dps': 'flex dps',
    'main support': 'main support',
    'flex support': 'flex support'
  },
  permissions: {
    'tank': false,
    'flex dps': false,
    'main support': false,
    'flex support': false
  },
  balances: {
    'tank': 0,
    'main dps': 0,
    'flex dps': 0,
    'main support': 0,
    'flex support': 0
  },
  roster: {
    tank: ['APL Lun'],
    dps: ['ʰˢ RK', 'SirPudding'],
    support: ['ᵐˢ Aggi', 'HiPriestess']
  },
  schedule: [],
  shopItems: [
    { id: 1, name: 'Damage Boost', type: 'buff', target: 'DPS', description: 'Increase damage output for one scrim', price: 500, icon: '⚡' },
    { id: 2, name: 'Extra Shield', type: 'buff', target: 'Tank', description: 'Additional shield health for one scrim', price: 400, icon: '🛡️' },
    { id: 3, name: 'Healing Amplification', type: 'buff', target: 'Support', description: 'Increased healing output for one scrim', price: 450, icon: '💚' },
    { id: 4, name: 'Sleep Dart', type: 'nerf', target: 'Any', description: 'Force a player to miss their first shot', price: 300, icon: '💤' },
    { id: 5, name: 'Lag Spike', type: 'nerf', target: 'Any', description: 'Simulate 200ms ping for 5 minutes', price: 600, icon: '📡' },
    { id: 6, name: 'Ultimate Ready', type: 'buff', target: 'Any', description: 'Start next round with 50% ultimate charge', price: 700, icon: '🔥' },
    { id: 7, name: 'Broken Keyboard', type: 'nerf', target: 'Any', description: 'Random key stops working for 10 minutes', price: 350, icon: '⌨️' },
    { id: 8, name: 'Speed Boost', type: 'buff', target: 'Any', description: 'Increased movement speed for one map', price: 550, icon: '💨' }
  ],
  purchases: []
};

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with initial data
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
