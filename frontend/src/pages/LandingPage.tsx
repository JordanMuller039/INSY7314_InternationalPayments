import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Lock, Globe, ArrowRight, CheckCircle} from 'lucide-react';
import { BorderRotate } from '../components/ui/animated-gradient-border';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Banking Reimagined
              <span className="gradient-text">for the Modern Era</span>
            </h1>
            <p className="hero-description">
              Experience seamless international payments with bank-grade security.
              Your financial future, simplified.
            </p>
            <div className="hero-buttons">
              <Link to="/auth" className="primary-button">
                Get Started
                <ArrowRight size={20} />
              </Link>
              <button className="secondary-button">
                Learn More
              </button>
            </div>
            <div className="trust-indicators">
              <div className="trust-item">
                <CheckCircle size={16} />
                <span>Bank-grade encryption</span>
              </div>
              <div className="trust-item">
                <CheckCircle size={16} />
                <span>24/7 support</span>
              </div>
              <div className="trust-item">
                <CheckCircle size={16} />
                <span>Instant transfers</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-wrapper">
              <BorderRotate
                className="hero-card"
                animationMode="auto-rotate"
                animationSpeed={8}
                borderWidth={3}
                borderRadius={24}
                backgroundColor="transparent"
              >
                <div className="card-inner">
                  <div className="card-header">
                    <span>Turtle Shell Account</span>
                    <Shield size={24} />
                  </div>
                  <div className="card-balance">
                    <span className="balance-label">Available Balance</span>
                    <span className="balance-amount">$24,512.89</span>
                  </div>
                  <div className="card-footer">
                    <span>•••• 4567</span>
                    <span>12/26</span>
                  </div>
                </div>
              </BorderRotate>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Turtle Shell Banking</h2>
          <p className="section-description">
            Built with security and simplicity at its core
          </p>
        </div>
        <div className="features-grid">
          <BorderRotate
            className="feature-card"
            animationMode="rotate-on-hover"
            animationSpeed={3}
            borderRadius={16}
            backgroundColor="white"
          >
            <div className="feature-content">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Bank-Grade Security</h3>
              <p>Your data is protected with industry-leading encryption and security protocols</p>
            </div>
          </BorderRotate>

          <BorderRotate
            className="feature-card"
            animationMode="rotate-on-hover"
            animationSpeed={3}
            borderRadius={16}
            backgroundColor="white"
          >
            <div className="feature-content">
              <div className="feature-icon">
                <Globe size={32} />
              </div>
              <h3>Global Transfers</h3>
              <p>Send money internationally with competitive rates and fast processing</p>
            </div>
          </BorderRotate>

          <BorderRotate
            className="feature-card"
            animationMode="rotate-on-hover"
            animationSpeed={3}
            borderRadius={16}
            backgroundColor="white"
          >
            <div className="feature-content">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Real-Time Insights</h3>
              <p>Track your transactions and manage your finances with powerful analytics</p>
            </div>
          </BorderRotate>

          <BorderRotate
            className="feature-card"
            animationMode="rotate-on-hover"
            animationSpeed={3}
            borderRadius={16}
            backgroundColor="white"
          >
            <div className="feature-content">
              <div className="feature-icon">
                <Lock size={32} />
              </div>
              <h3>FDIC Insured</h3>
              <p>Your deposits are insured up to $250,000 for complete peace of mind</p>
            </div>
          </BorderRotate>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <BorderRotate
          className="cta-card"
          animationMode="auto-rotate"
          animationSpeed={10}
          borderWidth={3}
          borderRadius={32}
          backgroundColor="transparent"
        >
          <div className="cta-content">
            <h2>Ready to Transform Your Banking?</h2>
            <p>Join thousands of users who trust Turtle Shell for their financial needs</p>
            <Link to="/auth" className="cta-button">
              Create Free Account
              <ArrowRight size={20} />
            </Link>
          </div>
        </BorderRotate>
      </section>
    </div>
  );
};

export default LandingPage;