import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Schedule.css';

// For Azure Static Web Apps, API is at /api (no localhost needed in production)
const API_URL = '/api';

const Schedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`${API_URL}/schedule`);
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Team Schedule</h1>
      <p className="welcome-text">Welcome back, {user?.name}!</p>

      {loading ? (
        <p className="welcome-text">Loading schedule...</p>
      ) : schedule.length === 0 ? (
        <p className="welcome-text">No upcoming events scheduled.</p>
      ) : (
        <div className="schedule-grid">
          {schedule.map((event) => (
          <div key={event.id} className="schedule-card">
            <div className="schedule-header">
              <h2 className="schedule-date">{formatDate(event.date)}</h2>
              <p className="schedule-time">
                {event.time} {event.timezone}
              </p>
            </div>

            <div className="schedule-body">
              <h3 className="schedule-agenda">{event.agenda}</h3>
              
              <div className="players-list">
                {event.players.map((player, index) => (
                  <div key={index} className="player-item">
                    <span className="player-icon">{player.icon}</span>
                    <span className="player-role">{player.role}:</span>
                    <span className="player-name">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
