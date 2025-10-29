import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Admin.css';

// For Azure Static Web Apps, API is at /api (no localhost needed in production)
const API_URL = '/api';

const Admin = () => {
  const { user, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [loading, setLoading] = useState(true);
  
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
  const [editingItemId, setEditingItemId] = useState(null);

  // Points Management
  const [playerBalances, setPlayerBalances] = useState({});
  const [pointsToAdd, setPointsToAdd] = useState({});

  // Permissions Management
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadRoster(),
        loadSchedule(),
        loadShopItems(),
        loadPlayerBalances(),
        loadPermissions(),
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoster = async () => {
    try {
      const response = await fetch(`${API_URL}/roster`);
      const data = await response.json();
      setRoster(data);
    } catch (error) {
      console.error('Error loading roster:', error);
    }
  };

  const loadSchedule = async () => {
    try {
      const response = await fetch(`${API_URL}/schedule`);
      const data = await response.json();
      setScheduleEvents(data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const loadShopItems = async () => {
    try {
      const response = await fetch(`${API_URL}/shop`);
      const data = await response.json();
      setShopItems(data);
    } catch (error) {
      console.error('Error loading shop items:', error);
    }
  };

  const loadPlayerBalances = async () => {
    try {
      const response = await fetch(`${API_URL}/balances`);
      const data = await response.json();
      setPlayerBalances(data);
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await fetch(`${API_URL}/permissions`);
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  // Schedule Management Functions
  const handleAddEvent = async () => {
    if (!newEvent.date || !newEvent.time || !newEvent.agenda) {
      alert('Please fill in all required fields');
      return;
    }

    const players = [];
    if (newEvent.selectedPlayers.tank) {
      players.push({ role: 'Tank', name: newEvent.selectedPlayers.tank, icon: '🛡️' });
    }
    if (newEvent.selectedPlayers.dps1) {
      players.push({ role: 'DPS', name: newEvent.selectedPlayers.dps1, icon: '⚔️' });
    }
    if (newEvent.selectedPlayers.dps2) {
      players.push({ role: 'DPS', name: newEvent.selectedPlayers.dps2, icon: '⚔️' });
    }
    if (newEvent.selectedPlayers.support1) {
      players.push({ role: 'Support', name: newEvent.selectedPlayers.support1, icon: '💚' });
    }
    if (newEvent.selectedPlayers.support2) {
      players.push({ role: 'Support', name: newEvent.selectedPlayers.support2, icon: '💚' });
    }

    const event = {
      id: Date.now(),
      date: newEvent.date,
      time: newEvent.time,
      timezone: newEvent.timezone,
      agenda: newEvent.agenda,
      players,
    };

    try {
      await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      await loadSchedule();
      setNewEvent({
        date: '',
        time: '',
        timezone: 'CEST',
        agenda: '',
        selectedPlayers: { tank: '', dps1: '', dps2: '', support1: '', support2: '' },
      });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await fetch(`${API_URL}/schedule/${id}`, {
        method: 'DELETE',
      });
      await loadSchedule();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Shop Management Functions
  const handleAddShopItem = async () => {
    if (!newItem.name || !newItem.description || newItem.price <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    try {
      if (editingItemId) {
        // Update existing item
        await fetch(`${API_URL}/shop/${editingItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newItem,
            price: parseInt(newItem.price),
          }),
        });
      } else {
        // Create new item
        const item = {
          id: Date.now(),
          ...newItem,
          price: parseInt(newItem.price),
        };

        await fetch(`${API_URL}/shop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }

      await loadShopItems();
      setNewItem({
        name: '',
        type: 'buff',
        target: 'Any',
        description: '',
        price: 0,
        icon: '⭐',
      });
      setEditingItemId(null);
    } catch (error) {
      console.error('Error saving shop item:', error);
      alert('Error saving shop item');
    }
  };

  const handleEditShopItem = (item) => {
    setNewItem({
      name: item.name,
      type: item.type,
      target: item.target,
      description: item.description,
      price: item.price,
      icon: item.icon,
    });
    setEditingItemId(item.id);
    // Scroll to top of page to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewItem({
      name: '',
      type: 'buff',
      target: 'Any',
      description: '',
      price: 0,
      icon: '⭐',
    });
    setEditingItemId(null);
  };

  const handleDeleteShopItem = async (id) => {
    try {
      await fetch(`${API_URL}/shop/${id}`, {
        method: 'DELETE',
      });
      await loadShopItems();
    } catch (error) {
      console.error('Error deleting shop item:', error);
    }
  };

  // Roster Management Functions
  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) {
      alert('Please enter a player name');
      return;
    }

    try {
      await fetch(`${API_URL}/roster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newPlayerRole, playerName: newPlayerName }),
      });

      await loadRoster();
      setNewPlayerName('');
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Error adding player');
    }
  };

  const handleRemovePlayer = async (role, playerName) => {
    try {
      await fetch(`${API_URL}/roster/${role}/${encodeURIComponent(playerName)}`, {
        method: 'DELETE',
      });
      await loadRoster();
    } catch (error) {
      console.error('Error removing player:', error);
    }
  };

  // Points Management Functions
  const handleUpdatePoints = async (role, operation) => {
    let newBalance = playerBalances[role] || 0;
    const amount = parseInt(pointsToAdd[role]) || 0;

    if (operation === 'add') {
      newBalance += amount;
    } else if (operation === 'subtract') {
      newBalance -= amount;
    } else if (operation === 'set') {
      newBalance = amount;
    }

    try {
      await fetch(`${API_URL}/balances/${role}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: newBalance }),
      });

      await loadPlayerBalances();
      setPointsToAdd({ ...pointsToAdd, [role]: '' });
    } catch (error) {
      console.error('Error updating points:', error);
      alert('Error updating points');
    }
  };

  const handlePointsInputChange = (role, value) => {
    setPointsToAdd({ ...pointsToAdd, [role]: value });
  };

  // Password Management Functions
  const handlePasswordChange = async (role) => {
    const newPassword = passwordChanges[role];
    if (!newPassword || newPassword.length < 3) {
      alert('Password must be at least 3 characters');
      return;
    }

    const success = await updatePassword(role, newPassword);
    if (success) {
      alert(`Password updated for ${role}`);
      setPasswordChanges({ ...passwordChanges, [role]: '' });
    } else {
      alert('Failed to update password');
    }
  };

  const handlePasswordInputChange = (role, value) => {
    setPasswordChanges({ ...passwordChanges, [role]: value });
  };

  // Permissions Management Functions
  const handlePermissionChange = async (role, hasAccess) => {
    if (role === 'main dps') {
      alert('Main DPS always has admin access and cannot be changed');
      return;
    }

    try {
      await fetch(`${API_URL}/permissions/${role}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasAccess }),
      });

      await loadPermissions();
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Error updating permissions');
    }
  };

  if (!user?.hasAdminAccess) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-container">
        <h1 className="admin-title">Admin Panel</h1>
        <p>Loading...</p>
      </div>
    );
  }

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

      <div className="tab-content">
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
                {roster.tank?.map((player) => (
                  <div key={player} className="roster-item">
                    <span className="roster-player-name">{player}</span>
                    <button
                      className="delete-btn"
                      onClick={() => handleRemovePlayer('tank', player)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {roster.tank?.length === 0 && <p className="no-players">No tanks in roster</p>}
              </div>
            </div>

            <div className="roster-section">
              <h3>⚔️ DPS</h3>
              <div className="roster-list">
                {roster.dps?.map((player) => (
                  <div key={player} className="roster-item">
                    <span className="roster-player-name">{player}</span>
                    <button
                      className="delete-btn"
                      onClick={() => handleRemovePlayer('dps', player)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {roster.dps?.length === 0 && <p className="no-players">No DPS in roster</p>}
              </div>
            </div>

            <div className="roster-section">
              <h3>💚 Supports</h3>
              <div className="roster-list">
                {roster.support?.map((player) => (
                  <div key={player} className="roster-item">
                    <span className="roster-player-name">{player}</span>
                    <button
                      className="delete-btn"
                      onClick={() => handleRemovePlayer('support', player)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {roster.support?.length === 0 && <p className="no-players">No supports in roster</p>}
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
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    selectedPlayers: { ...newEvent.selectedPlayers, tank: e.target.value },
                  })}
                >
                  <option value="">Select Tank</option>
                  {roster.tank?.map((player) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>⚔️ DPS 1</label>
                <select
                  value={newEvent.selectedPlayers.dps1}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    selectedPlayers: { ...newEvent.selectedPlayers, dps1: e.target.value },
                  })}
                >
                  <option value="">Select DPS</option>
                  {roster.dps?.map((player) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>⚔️ DPS 2</label>
                <select
                  value={newEvent.selectedPlayers.dps2}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    selectedPlayers: { ...newEvent.selectedPlayers, dps2: e.target.value },
                  })}
                >
                  <option value="">Select DPS</option>
                  {roster.dps?.map((player) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>💚 Support 1</label>
                <select
                  value={newEvent.selectedPlayers.support1}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    selectedPlayers: { ...newEvent.selectedPlayers, support1: e.target.value },
                  })}
                >
                  <option value="">Select Support</option>
                  {roster.support?.map((player) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>💚 Support 2</label>
                <select
                  value={newEvent.selectedPlayers.support2}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    selectedPlayers: { ...newEvent.selectedPlayers, support2: e.target.value },
                  })}
                >
                  <option value="">Select Support</option>
                  {roster.support?.map((player) => (
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
              {scheduleEvents.length === 0 ? (
                <p>No events scheduled</p>
              ) : (
                scheduleEvents.map((event) => (
                  <div key={event.id} className="event-card">
                    <h3>{event.agenda}</h3>
                    <p>{event.date} | {event.time} {event.timezone}</p>
                    <p className="event-players">
                      {event.players?.map((p) => p.name).join(', ')}
                    </p>
                    <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Shop Management Tab */}
        {activeTab === 'shop' && (
          <div className="tab-content">
            <h2>{editingItemId ? 'Edit Shop Item' : 'Add New Shop Item'}</h2>
            {editingItemId && (
              <p style={{ color: '#4CAF50', marginBottom: '10px' }}>
                Editing item - make your changes and click Save Changes
              </p>
            )}
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
                  onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="add-btn" onClick={handleAddShopItem}>
                {editingItemId ? 'Save Changes' : 'Add Shop Item'}
              </button>
              {editingItemId && (
                <button className="delete-btn" onClick={handleCancelEdit}>
                  Cancel Edit
                </button>
              )}
            </div>

            <h2>Current Shop Items</h2>
            <div className="item-list">
              {shopItems.map((item) => (
                <div key={item.id} className="shop-card">
                  <span className="shop-icon">{item.icon}</span>
                  <div className="shop-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="shop-price">{item.price} MVP points</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="add-btn" onClick={() => handleEditShopItem(item)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteShopItem(item.id)}>
                      Delete
                    </button>
                  </div>
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
            <p>Control who has access to the admin panel. Main DPS always has admin access and cannot be modified.</p>
            
            <div className="permissions-list">
              <div className="permission-item">
                <span className="role-name">Main DPS (You)</span>
                <span className="permission-status always-admin">Always Admin ✓</span>
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
    </div>
  );
};

export default Admin;
