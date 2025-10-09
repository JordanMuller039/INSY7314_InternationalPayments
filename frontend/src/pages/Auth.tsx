import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BorderRotate } from '../components/ui/animated-gradient-border';
import { Mail, Lock, User, CreditCard, Hash, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import '../styles/Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register Form State
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    idNumber: '',
    accountNumber: '',
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

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
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
              <h1>SecureBank</h1>
            </div>
            
            <div className="info-text">
              <h2>Welcome to the Future of Banking</h2>
              <p>Experience seamless, secure, and instant international payments with bank-grade encryption.</p>
            </div>

            <div className="features-list">
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
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="auth-form-panel">
          <BorderRotate
            className="auth-card"
            animationMode="auto-rotate"
            animationSpeed={10}
            borderWidth={2}
            borderRadius={24}
            backgroundColor="#ffffff"
          >
            {/* Toggle Buttons */}
            <div className="auth-toggle">
              <button
                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => !isLogin && toggleAuthMode()}
              >
                Sign In
              </button>
              <button
                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => isLogin && toggleAuthMode()}
              >
                Sign Up
              </button>
              <div className={`toggle-slider ${isLogin ? 'left' : 'right'}`} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-header">
                  <h2>Welcome Back</h2>
                  <p>Sign in to your account to continue</p>
                </div>

                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={20} className="input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
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
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-header">
                  <h2>Create Account</h2>
                  <p>Join thousands of users worldwide</p>
                </div>

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

                <label className="checkbox-label terms">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </span>
                </label>

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
            )}
          </BorderRotate>

          <p className="auth-footer">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleAuthMode} className="switch-link">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;