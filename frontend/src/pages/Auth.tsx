/**
 * Employee Authentication Page
 * Secure login portal for Turtle Shell Banking employees
 * Public registration disabled - employee accounts created by administrators only
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BorderRotate } from '../components/ui/animated-gradient-border';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, CreditCard, User } from 'lucide-react';
import '../styles/Auth.css';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Info Panel */}
        <div className="auth-info-panel">
          <div className="info-content">
            <div className="logo-section">
              <div className="logo-icon-large">
                <CreditCard size={48} />
              </div>
              <h1>Turtle Shell Banking</h1>
            </div>
            
            <div className="info-text">
              <h2>Employee Portal</h2>
              <p>Secure access to international payment processing and account management systems.</p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={20} />
                </div>
                <div>
                  <h4>Bank-Grade Security</h4>
                  <p>Protected with enterprise-level encryption</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h4>Global Payments</h4>
                  <p>Process international transfers securely</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <User size={20} />
                </div>
                <div>
                  <h4>Admin Access</h4>
                  <p>Full account and transaction management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-panel">
          <BorderRotate
            className="auth-card"
            animationMode="auto-rotate"
            animationSpeed={10}
            borderWidth={2}
            borderRadius={24}
            backgroundColor="#ffffff"
          >
            <div className="auth-header">
              <h2>Employee Sign In</h2>
              <p>Access your banking dashboard</p>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="employee@turtleshell.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner">Signing in...</span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer-info">
              <p>Need access? Contact your system administrator.</p>
            </div>
          </BorderRotate>
        </div>
      </div>
    </div>
  );
};

export default Auth;