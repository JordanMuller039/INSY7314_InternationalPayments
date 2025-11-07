/**
 * Dual Portal Authentication Page
 * Supports both Customer Portal (with registration) and Employee Portal (login only)
 * Role-based routing: Admin, Employee, and Customer dashboards
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BorderRotate } from '../components/ui/animated-gradient-border';
import { Mail, Lock, User, CreditCard, Hash, Eye, EyeOff, ArrowRight, Shield, Building2, Users } from 'lucide-react';
import '../styles/Auth.css';

type PortalMode = 'customer-login' | 'customer-register' | 'employee-login';

const Auth = () => {
  const [portalMode, setPortalMode] = useState<PortalMode>('customer-login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    idNumber: '',
    accountNumber: '',
  });

  const isEmployeeMode = portalMode === 'employee-login';
  const isRegisterMode = portalMode === 'customer-register';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(loginData.email, loginData.password);
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({ firstName: '', lastName: '', email: '', password: '', idNumber: '', accountNumber: '' });
    setError('');
  };

  const switchPortalMode = (mode: PortalMode) => {
    setPortalMode(mode);
    resetForms();
  };

  return (
    <div className={`auth-page ${isEmployeeMode ? 'employee-mode' : 'customer-mode'}`}>
      <div className="auth-container">
        <div className={`auth-info-panel ${isEmployeeMode ? 'employee-panel' : 'customer-panel'}`}>
          <div className="info-content">
            <div className="logo-section">
              <div className="logo-icon-large">
                {isEmployeeMode ? <Building2 size={48} /> : <CreditCard size={48} />}
              </div>
              <h1>Turtle Shell Banking</h1>
            </div>
            
            <div className="info-text">
              <h2>{isEmployeeMode ? 'Employee Portal' : 'Welcome Back'}</h2>
              <p>
                {isEmployeeMode 
                  ? 'Secure access to customer management and international payment processing systems.'
                  : 'Experience seamless, secure, and instant international payments with bank-grade encryption.'
                }
              </p>
            </div>

            <div className="features-list">
              {isEmployeeMode ? (
                <>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h4>Enterprise Security</h4>
                      <p>Protected with bank-grade encryption</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4>Customer Management</h4>
                      <p>Full access to customer accounts</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4>Admin Access</h4>
                      <p>Process and manage global payments</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h4>Bank-Grade Security</h4>
                      <p>Your data protected with 256-bit encryption</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <ArrowRight size={20} />
                    </div>
                    <div>
                      <h4>Instant Transfers</h4>
                      <p>Send money globally in seconds</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <User size={20} />
                    </div>
                    <div>
                      <h4>24/7 Support</h4>
                      <p>We're here to help anytime you need</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <BorderRotate
            className="auth-card"
            animationMode="auto-rotate"
            animationSpeed={10}
            borderWidth={2}
            borderRadius={24}
            backgroundColor="#ffffff"
          >
            <div className="portal-toggle">
              <button
                className={portalMode === 'customer-login' ? 'active customer' : 'customer'}
                onClick={() => switchPortalMode('customer-login')}
              >
                Customer
              </button>
              <button
                className={portalMode === 'employee-login' ? 'active employee' : 'employee'}
                onClick={() => switchPortalMode('employee-login')}
              >
                Employee
              </button>
            </div>

            <div className="auth-header">
              <h2>
                {isRegisterMode ? 'Create Account' : isEmployeeMode ? 'Employee Sign In' : 'Customer Sign In'}
              </h2>
              <p>
                {isRegisterMode ? 'Join thousands of users worldwide' : 'Access your banking dashboard'}
              </p>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            {isRegisterMode ? (
              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-wrapper">
                      <User size={20} className="input-icon" />
                      <input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="input-wrapper">
                      <User size={20} className="input-icon" />
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={20} className="input-icon" />
                    <input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Password</label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <span className="input-hint">
                    Must contain uppercase, lowercase, number & special character
                  </span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="idNumber">ID Number</label>
                    <div className="input-wrapper">
                      <Hash size={20} className="input-icon" />
                      <input
                        id="idNumber"
                        type="text"
                        placeholder="ID123456789"
                        value={registerData.idNumber}
                        onChange={(e) => setRegisterData({ ...registerData, idNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="accountNumber">Account Number</label>
                    <div className="input-wrapper">
                      <CreditCard size={20} className="input-icon" />
                      <input
                        id="accountNumber"
                        type="text"
                        placeholder="1234567890"
                        value={registerData.accountNumber}
                        onChange={(e) => setRegisterData({ ...registerData, accountNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner">Creating account...</span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={20} className="input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      placeholder={isEmployeeMode ? "employee@turtleshell.com" : "you@example.com"}
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
            )}

            {!isEmployeeMode && (
              <div className="auth-footer-toggle">
                <p>
                  {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
                  <button 
                    onClick={() => switchPortalMode(isRegisterMode ? 'customer-login' : 'customer-register')} 
                    className="switch-link"
                  >
                    {isRegisterMode ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            )}

            {isEmployeeMode && (
              <div className="auth-footer-info">
                <p>Need access? Contact your system administrator.</p>
              </div>
            )}
          </BorderRotate>
        </div>
      </div>
    </div>
  );
};

export default Auth;