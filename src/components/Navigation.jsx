import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>🐠 Cursed Aquarium</h1>
          <span className="nav-subtitle">Overwatch 2 Scrim Team</span>
        </div>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Schedule
          </Link>
          <Link
            to="/shop"
            className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}
          >
            VIP Shop
          </Link>
          {user.hasAdminAccess && (
            <Link
              to="/admin"
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="nav-user">
          <span className="user-name">{user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
