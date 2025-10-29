import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Admin.css';

const Admin = () => {
  const { user, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Roster Management
  const [roster, setRoster] = useState({
    tank: [],
    dps: [],
    support: [],
  });
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('tank');
  const [passwordChanges, setPasswordChanges] = useState({
    tank: '',
    'main dps': '',
    'flex dps': '',
    'main support': '',
    'flex support': '',
  });
  
  // Schedule Management
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    date: '',
    time: '',
    timezone: 'CEST',
    agenda: '',
    selectedPlayers: {
      tank: '',
      dps1: '',
      dps2: '',
      support1: '',
      support2: '',
    },
  });

  // Shop Management
  const [shopItems, setShopItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'buff',
    target: 'Any',
    description: '',
    price: 0,
    icon: '⭐',
  });

  // Permissions Management
  const [permissions, setPermissions] = useState({
    tank: false,
    'flex dps': false,
    'main support': false,
    'flex support': false,
  });

  // Points Management
  const [playerBalances, setPlayerBalances] = useState({});
  const [pointsToAdd, setPointsToAdd] = useState({});

  useEffect(() => {
    loadSchedule();
    loadShopItems();
    loadPermissions();
    loadRoster();
    loadPlayerBalances();
  }, []);

  const loadRoster = () => {
    const saved = localStorage.getItem('cursed_aquarium_roster');
    if (saved) {
      setRoster(JSON.parse(saved));
    } else {
      // Default roster with current players
      const defaultRoster = {
        tank: ['APL Lun'],
        dps: ['ʰˢ RK', 'SirPudding'],
        support: ['ᵐˢ Aggi', 'HiPriestess'],
      };
      setRoster(defaultRoster);
      localStorage.setItem('cursed_aquarium_roster', JSON.stringify(defaultRoster));
    }
  };

  const loadSchedule = () => {
    const saved = localStorage.getItem('cursed_aquarium_schedule');
    if (saved) {
      setScheduleEvents(JSON.parse(saved));
    }
  };

  const loadShopItems = () => {
    const saved = localStorage.getItem('cursed_aquarium_shop_items');
    if (saved) {
      setShopItems(JSON.parse(saved));
    }
  };

  const loadPermissions = () => {
    const saved = localStorage.getItem('cursed_aquarium_admin_perms');
    if (saved) {
      setPermissions(JSON.parse(saved));
    }
  };

  const loadPlayerBalances = () => {
    const roles = ['tank', 'main dps', 'flex dps', 'main support', 'flex support'];
    const balances = {};
    
    roles.forEach(role => {
      const saved = localStorage.getItem(`cursed_aquarium_balance_${role}`);
      balances[role] = saved ? JSON.parse(saved) : 0;
    });
    
    setPlayerBalances(balances);
  };

  const handleAddEvent = () => {
    if (!newEvent.date || !newEvent.time || !newEvent.agenda) {
      alert('Please fill in all required fields');
      return;
    }

    // Build players array from selected roster members
    const players = [
      { role: 'Tank', name: newEvent.selectedPlayers.tank, icon: '🛡️' },
      { role: 'DPS', name: newEvent.selectedPlayers.dps1, icon: '⚔️' },
      { role: 'DPS', name: newEvent.selectedPlayers.dps2, icon: '⚔️' },
      { role: 'Support', name: newEvent.selectedPlayers.support1, icon: '💚' },
      { role: 'Support', name: newEvent.selectedPlayers.support2, icon: '💚' },
    ];

    const event = {
      id: Date.now(),
      date: newEvent.date,
      time: newEvent.time,
      timezone: newEvent.timezone,
      agenda: newEvent.agenda,
      players: players,
    };

    const updated = [...scheduleEvents, event];
    setScheduleEvents(updated);
    localStorage.setItem('cursed_aquarium_schedule', JSON.stringify(updated));

    // Reset form
    setNewEvent({
      date: '',
      time: '',
      timezone: 'CEST',
      agenda: '',
      selectedPlayers: {
        tank: '',
        dps1: '',
        dps2: '',
        support1: '',
        support2: '',
      },
    });

    alert('Event added successfully!');
  };

  const handleDeleteEvent = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updated = scheduleEvents.filter((e) => e.id !== id);
      setScheduleEvents(updated);
      localStorage.setItem('cursed_aquarium_schedule', JSON.stringify(updated));
    }
  };

  const handleAddShopItem = () => {
    if (!newItem.name || !newItem.description || newItem.price <= 0) {
      alert('Please fill in all fields correctly');
      return;
    }

    const item = {
      id: Date.now(),
      ...newItem,
    };

    const updated = [...shopItems, item];
    setShopItems(updated);
    localStorage.setItem('cursed_aquarium_shop_items', JSON.stringify(updated));

    // Reset form
    setNewItem({
      name: '',
      type: 'buff',
      target: 'Any',
      description: '',
      price: 0,
      icon: '⭐',
    });

    alert('Shop item added successfully!');
  };

  const handleDeleteShopItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updated = shopItems.filter((item) => item.id !== id);
      setShopItems(updated);
      localStorage.setItem('cursed_aquarium_shop_items', JSON.stringify(updated));
    }
  };

  const handlePermissionChange = (role, hasAccess) => {
    const updated = { ...permissions, [role]: hasAccess };
    setPermissions(updated);
    localStorage.setItem('cursed_aquarium_admin_perms', JSON.stringify(updated));
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      alert('Please enter a player name');
      return;
    }

    const updated = { ...roster };
    updated[newPlayerRole] = [...updated[newPlayerRole], newPlayerName.trim()];
    setRoster(updated);
    localStorage.setItem('cursed_aquarium_roster', JSON.stringify(updated));
    setNewPlayerName('');
    alert(`Added ${newPlayerName} to ${newPlayerRole} roster!`);
  };

  const handleRemovePlayer = (role, playerName) => {
    if (confirm(`Remove ${playerName} from the ${role} roster?`)) {
      const updated = { ...roster };
      updated[role] = updated[role].filter(name => name !== playerName);
      setRoster(updated);
      localStorage.setItem('cursed_aquarium_roster', JSON.stringify(updated));
    }
  };

  const updatePlayerSelection = (position, playerName) => {
    setNewEvent({
      ...newEvent,
      selectedPlayers: {
        ...newEvent.selectedPlayers,
        [position]: playerName,
      },
    });
  };

  const handleUpdatePoints = (role, operation) => {
    const amount = parseInt(pointsToAdd[role]) || 0;
    if (amount <= 0 && operation === 'add') {
      alert('Please enter a valid positive amount');
      return;
    }

    const currentBalance = playerBalances[role] || 0;
    let newBalance;

    if (operation === 'add') {
      newBalance = currentBalance + amount;
    } else if (operation === 'subtract') {
      newBalance = Math.max(0, currentBalance - amount); // Don't go below 0
    } else if (operation === 'set') {
      newBalance = amount >= 0 ? amount : 0;
    }

    // Update localStorage
    localStorage.setItem(`cursed_aquarium_balance_${role}`, JSON.stringify(newBalance));
    
    // Update state
    setPlayerBalances({ ...playerBalances, [role]: newBalance });
    setPointsToAdd({ ...pointsToAdd, [role]: '' });
    
    alert(`Updated ${role}'s MVP points to ${newBalance}`);
  };

  const handlePointsInputChange = (role, value) => {
    setPointsToAdd({ ...pointsToAdd, [role]: value });
  };

  const handlePasswordChange = (role) => {
    const newPassword = passwordChanges[role];
    if (!newPassword || newPassword.trim() === '') {
      alert('Please enter a new password');
      return;
    }

    if (updatePassword(role, newPassword.trim())) {
      alert(`Password updated for ${role}!`);
      setPasswordChanges({ ...passwordChanges, [role]: '' });
    } else {
      alert('Failed to update password. Only admins can change passwords.');
    }
  };

  const handlePasswordInputChange = (role, value) => {
    setPasswordChanges({ ...passwordChanges, [role]: value });
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>
      <p className="admin-subtitle">Welcome, {user?.name}</p>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          Roster Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          Shop Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'points' ? 'active' : ''}`}
          onClick={() => setActiveTab('points')}
        >
          Points Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          Permissions
        </button>
      </div>

      {/* Roster Management Tab */}
      {activeTab === 'roster' && (
        <div className="tab-content">
          <h2>Team Roster Management</h2>
          <p>Add or remove players from each role. These players will be available when creating schedule events.</p>

          <div className="form-grid">
            <div className="form-group">
              <label>Player Name</label>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={newPlayerRole}
                onChange={(e) => setNewPlayerRole(e.target.value)}
              >
                <option value="tank">Tank</option>
                <option value="dps">DPS</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>

          <button className="add-btn" onClick={handleAddPlayer}>
            Add Player to Roster
          </button>

          <h2>Current Roster</h2>
          
          <div className="roster-section">
            <h3>🛡️ Tanks</h3>
            <div className="roster-list">
              {roster.tank.map((player) => (
                <div key={player} className="roster-item">
                  <span className="roster-player-name">{player}</span>
                  <button className="delete-btn" onClick={() => handleRemovePlayer('tank', player)}>
                    Remove
                  </button>
                </div>
              ))}
              {roster.tank.length === 0 && <p className="no-players">No tanks in roster</p>}
            </div>
          </div>

          <div className="roster-section">
            <h3>⚔️ DPS</h3>
            <div className="roster-list">
              {roster.dps.map((player) => (
                <div key={player} className="roster-item">
                  <span className="roster-player-name">{player}</span>
                  <button className="delete-btn" onClick={() => handleRemovePlayer('dps', player)}>
                    Remove
                  </button>
                </div>
              ))}
              {roster.dps.length === 0 && <p className="no-players">No DPS in roster</p>}
            </div>
          </div>

          <div className="roster-section">
            <h3>💚 Supports</h3>
            <div className="roster-list">
              {roster.support.map((player) => (
                <div key={player} className="roster-item">
                  <span className="roster-player-name">{player}</span>
                  <button className="delete-btn" onClick={() => handleRemovePlayer('support', player)}>
                    Remove
                  </button>
                </div>
              ))}
              {roster.support.length === 0 && <p className="no-players">No supports in roster</p>}
            </div>
          </div>

          <h2 style={{ marginTop: '40px' }}>Password Management</h2>
          <p>Change login passwords for each role. Players will need the new password to log in.</p>

          <div className="password-management">
            {['tank', 'main dps', 'flex dps', 'main support', 'flex support'].map((role) => (
              <div key={role} className="password-card">
                <h3 className="password-role">{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                <div className="password-controls">
                  <input
                    type="text"
                    className="password-input"
                    placeholder="Enter new password"
                    value={passwordChanges[role]}
                    onChange={(e) => handlePasswordInputChange(role, e.target.value)}
                  />
                  <button
                    className="password-btn"
                    onClick={() => handlePasswordChange(role)}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Management Tab */}
      {activeTab === 'schedule' && (
        <div className="tab-content">
          <h2>Add New Event</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="text"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="20:00-22:00"
              />
            </div>

            <div className="form-group">
              <label>Timezone</label>
              <input
                type="text"
                value={newEvent.timezone}
                onChange={(e) => setNewEvent({ ...newEvent, timezone: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Agenda</label>
              <input
                type="text"
                value={newEvent.agenda}
                onChange={(e) => setNewEvent({ ...newEvent, agenda: e.target.value })}
                placeholder="Scrim (Team Name)"
              />
            </div>

            <h3 className="full-width">Select Players from Roster</h3>
            
            <div className="form-group">
              <label>🛡️ Tank</label>
              <select
                value={newEvent.selectedPlayers.tank}
                onChange={(e) => updatePlayerSelection('tank', e.target.value)}
              >
                <option value="">Select Tank</option>
                {roster.tank.map((player) => (
                  <option key={player} value={player}>{player}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>⚔️ DPS 1</label>
              <select
                value={newEvent.selectedPlayers.dps1}
                onChange={(e) => updatePlayerSelection('dps1', e.target.value)}
              >
                <option value="">Select DPS</option>
                {roster.dps.map((player) => (
                  <option key={player} value={player}>{player}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>⚔️ DPS 2</label>
              <select
                value={newEvent.selectedPlayers.dps2}
                onChange={(e) => updatePlayerSelection('dps2', e.target.value)}
              >
                <option value="">Select DPS</option>
                {roster.dps.map((player) => (
                  <option key={player} value={player}>{player}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>💚 Support 1</label>
              <select
                value={newEvent.selectedPlayers.support1}
                onChange={(e) => updatePlayerSelection('support1', e.target.value)}
              >
                <option value="">Select Support</option>
                {roster.support.map((player) => (
                  <option key={player} value={player}>{player}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>💚 Support 2</label>
              <select
                value={newEvent.selectedPlayers.support2}
                onChange={(e) => updatePlayerSelection('support2', e.target.value)}
              >
                <option value="">Select Support</option>
                {roster.support.map((player) => (
                  <option key={player} value={player}>{player}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="add-btn" onClick={handleAddEvent}>
            Add Event
          </button>

          <h2>Current Schedule</h2>
          <div className="event-list">
            {scheduleEvents.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.agenda}</h3>
                <p>{event.date} | {event.time} {event.timezone}</p>
                <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shop Management Tab */}
      {activeTab === 'shop' && (
        <div className="tab-content">
          <h2>Add New Shop Item</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item Name"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              >
                <option value="buff">Buff</option>
                <option value="nerf">Nerf</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target</label>
              <input
                type="text"
                value={newItem.target}
                onChange={(e) => setNewItem({ ...newItem, target: e.target.value })}
                placeholder="Tank, DPS, Support, Any"
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
                placeholder="500"
              />
            </div>

            <div className="form-group">
              <label>Icon</label>
              <input
                type="text"
                value={newItem.icon}
                onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                placeholder="⭐"
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Item description..."
                rows="3"
              />
            </div>
          </div>

          <button className="add-btn" onClick={handleAddShopItem}>
            Add Shop Item
          </button>

          <h2>Current Shop Items</h2>
          <div className="item-list">
            {shopItems.map((item) => (
              <div key={item.id} className="shop-card">
                <span className="shop-icon">{item.icon}</span>
                <div className="shop-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="shop-price">{item.price} coins</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteShopItem(item.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Points Management Tab */}
      {activeTab === 'points' && (
        <div className="tab-content">
          <h2>MVP Points Management</h2>
          <p>Manage MVP points for each player role. Points can be awarded for performance, attendance, or other achievements.</p>

          <div className="points-management">
            {Object.entries(playerBalances).map(([role, balance]) => (
              <div key={role} className="points-card">
                <div className="points-header">
                  <h3 className="points-role">{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                  <div className="points-balance">
                    <span className="points-label">Current Balance:</span>
                    <span className="points-amount">{balance} points</span>
                  </div>
                </div>

                <div className="points-controls">
                  <input
                    type="number"
                    className="points-input"
                    placeholder="Enter amount"
                    value={pointsToAdd[role] || ''}
                    onChange={(e) => handlePointsInputChange(role, e.target.value)}
                    min="0"
                  />
                  
                  <div className="points-buttons">
                    <button
                      className="points-btn add-points"
                      onClick={() => handleUpdatePoints(role, 'add')}
                    >
                      + Add
                    </button>
                    <button
                      className="points-btn subtract-points"
                      onClick={() => handleUpdatePoints(role, 'subtract')}
                    >
                      - Subtract
                    </button>
                    <button
                      className="points-btn set-points"
                      onClick={() => handleUpdatePoints(role, 'set')}
                    >
                      Set To
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="tab-content">
          <h2>Admin Access Management</h2>
          <p>Control who has access to the admin panel.</p>
          
          <div className="permissions-list">
            <div className="permission-item">
              <span className="role-name">Main DPS (You)</span>
              <span className="permission-status always-admin">Always Admin</span>
            </div>

            {Object.entries(permissions).map(([role, hasAccess]) => (
              <div key={role} className="permission-item">
                <span className="role-name">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={hasAccess}
                    onChange={(e) => handlePermissionChange(role, e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
