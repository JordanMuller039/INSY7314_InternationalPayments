import { useState, useEffect } from 'react';
import { accountsAPI } from '../services/api';
import { BorderRotate } from '../components/ui/animated-gradient-border';
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  ArrowUpRight,
  DollarSign,
  Calendar,
  Shield,
  Plus
} from 'lucide-react';
import type { Account } from '../types';
import '../styles/Accounts.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAccounts();
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading your accounts...</div>
      </div>
    );
  }

  return (
    <div className="accounts-page">
      <div className="accounts-container">
        {/* Header */}
        <div className="accounts-header">
          <div className="header-content">
            <h1>My Accounts</h1>
            <p>Manage your Turtle Shell Banking accounts</p>
          </div>
          <button className="add-account-btn" onClick={() => alert('Coming soon!')}>
            <Plus size={20} />
            <span>Add Account</span>
          </button>
        </div>

        {/* Total Balance Card */}
        <section className="total-balance-section">
          <BorderRotate
            className="total-balance-card"
            animationMode="auto-rotate"
            animationSpeed={12}
            borderWidth={3}
            borderRadius={24}
            backgroundColor="transparent"
          >
            <div className="total-balance-content">
              <div className="balance-header">
                <div className="balance-label">
                  <DollarSign size={28} />
                  <div>
                    <h3>Total Balance</h3>
                    <p>Across all accounts</p>
                  </div>
                </div>
                <button 
                  className="visibility-toggle"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                >
                  {balanceVisible ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
              <div className="total-amount">
                {balanceVisible ? formatCurrency(totalBalance) : '••••••••'}
              </div>
              <div className="balance-stats">
                <div className="stat-item">
                  <TrendingUp size={18} />
                  <span>+2.5% this month</span>
                </div>
                <div className="stat-item">
                  <Shield size={18} />
                  <span>FDIC Insured</span>
                </div>
              </div>
            </div>
          </BorderRotate>
        </section>

        {/* Accounts Grid */}
        <section className="accounts-grid-section">
          <h2 className="section-title">Your Accounts ({accounts.length})</h2>
          <div className="accounts-grid">
            {accounts.map((account) => (
              <BorderRotate
                key={account._id}
                className="account-card"
                animationMode="rotate-on-hover"
                animationSpeed={4}
                borderRadius={20}
                backgroundColor="transparent"
              >
                <div className="account-card-inner">
                  <div className="account-header">
                    <div className="account-type-badge">
                      <CreditCard size={20} />
                      <span>{account.accountType}</span>
                    </div>
                    <div className={`account-status ${account.isActive ? 'active' : 'inactive'}`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className="account-balance-section">
                    <div className="balance-label">Available Balance</div>
                    <div className="account-balance">
                      {balanceVisible ? formatCurrency(account.balance) : '••••••'}
                    </div>
                    <div className="account-currency">{account.currency}</div>
                  </div>

                  <div className="account-details">
                    <div className="detail-item">
                      <span className="detail-label">Account Number</span>
                      <span className="detail-value">
                        •••• •••• •••• {account.accountNumber.slice(-4)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span className="detail-label">Opened</span>
                      <span className="detail-value">
                        {formatDate(account.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="account-actions">
                    <button className="action-btn primary">
                      View Details
                      <ArrowUpRight size={16} />
                    </button>
                    <button className="action-btn secondary">
                      Transactions
                    </button>
                  </div>
                </div>
              </BorderRotate>
            ))}
          </div>

          {accounts.length === 0 && (
            <div className="empty-accounts">
              <CreditCard size={64} />
              <h3>No Accounts Yet</h3>
              <p>Create your first account to get started</p>
              <button className="create-account-btn">
                <Plus size={20} />
                Create Account
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Accounts;