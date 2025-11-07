import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, CreditCard, Send, History, Building2, Users } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
  <div className="navbar-container">
    <Link to="/" className="navbar-logo">
      <div className="logo-icon">
        <img src="/icon.png" alt="Turtle Shell Banking" className="logo-image" />
      </div>
      <span>Turtle Shell Banking</span>
    </Link>

    {user && (
      <div className="navbar-links">
        {user.role === 'admin' ? (
          // Admin: only Admin and Dashboard
          <>
            <Link to="/admin" className="nav-link admin-link">
              <Building2 size={18} />
              <span>Admin</span>
            </Link>
            <Link to="/dashboard" className="nav-link">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </>
        ) : user.role === 'employee' ? (
          // Employee: Employees list + Dashboard
          <>
            <Link to="/employees" className="nav-link">
              <Users size={18} />
              <span>Customers</span>
            </Link>
            <Link to="/dashboard" className="nav-link">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </>
        ) : (
          // Customer: full navigation
          <>
            <Link to="/dashboard" className="nav-link">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/accounts" className="nav-link">
              <CreditCard size={18} />
              <span>Accounts</span>
            </Link>
            <Link to="/payments" className="nav-link">
              <Send size={18} />
              <span>Payments</span>
            </Link>
            <Link to="/transactions" className="nav-link">
              <History size={18} />
              <span>Transactions</span>
            </Link>
          </>
        )}
      </div>
    )}

        <div className="navbar-actions">
          {user ? (
            <>
              <div className="user-info">
                <User size={18} />
                <span>{user.firstName}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className="login-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;