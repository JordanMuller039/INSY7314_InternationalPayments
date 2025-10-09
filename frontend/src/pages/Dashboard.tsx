import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountsAPI, transactionsAPI } from '../services/api';
import { BorderRotate } from '../components/ui/animated-gradient-border';
import { 
  Wallet, 
  TrendingUp, 
  Send, 
  ArrowUpRight, 
  ArrowDownRight,
  CreditCard,
  Eye,
  EyeOff,
  Plus,
  History,
  DollarSign
} from 'lucide-react';
import type { Account, Transaction } from '../types';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [accountsRes, transactionsRes] = await Promise.all([
        accountsAPI.getAccounts(),
        transactionsAPI.getTransactions()
      ]);
      setAccounts(accountsRes.data.accounts);
      setRecentTransactions(transactionsRes.data.transactions.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Here's what's happening with your accounts today</p>
          </div>
          <Link to="/payments" className="quick-action-btn primary">
            <Send size={20} />
            <span>Send Money</span>
          </Link>
        </div>

        {/* Balance Overview */}
        <section className="balance-section">
          <BorderRotate
            className="balance-card"
            animationMode="auto-rotate"
            animationSpeed={10}
            borderWidth={3}
            borderRadius={24}
          >
            <div className="balance-content">
              <div className="balance-header">
                <div className="balance-label">
                  <Wallet size={24} />
                  <span>Total Balance</span>
                </div>
                <button 
                  className="visibility-toggle"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                >
                  {balanceVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <div className="balance-amount">
                {balanceVisible ? formatCurrency(totalBalance) : '••••••'}
              </div>
              <div className="balance-footer">
                <div className="balance-stat">
                  <TrendingUp size={16} />
                  <span>+2.5% this month</span>
                </div>
                <div className="balance-accounts">
                  {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'}
                </div>
              </div>
            </div>
          </BorderRotate>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/payments" className="action-card">
              <div className="action-icon send">
                <Send size={24} />
              </div>
              <h3>Send Money</h3>
              <p>International transfer</p>
            </Link>

            <Link to="/accounts" className="action-card">
              <div className="action-icon accounts">
                <CreditCard size={24} />
              </div>
              <h3>My Accounts</h3>
              <p>View all accounts</p>
            </Link>

            <Link to="/transactions" className="action-card">
              <div className="action-icon history">
                <History size={24} />
              </div>
              <h3>Transactions</h3>
              <p>View history</p>
            </Link>

            <button className="action-card" onClick={() => alert('Coming soon!')}>
              <div className="action-icon add">
                <Plus size={24} />
              </div>
              <h3>Add Account</h3>
              <p>Open new account</p>
            </button>
          </div>
        </section>

        {/* Accounts Grid */}
        <section className="accounts-section">
          <div className="section-header">
            <h2 className="section-title">My Accounts</h2>
            <Link to="/accounts" className="view-all-link">
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="accounts-grid">
            {accounts.map((account) => (
              <BorderRotate
                key={account._id}
                className="account-card-small"
                animationMode="rotate-on-hover"
                animationSpeed={3}
                borderRadius={16}
              >
                <div className="account-card-content">
                  <div className="account-type">
                    <CreditCard size={20} />
                    <span>{account.accountType}</span>
                  </div>
                  <div className="account-balance">
                    {balanceVisible ? formatCurrency(account.balance) : '••••••'}
                  </div>
                  <div className="account-number">
                    •••• {account.accountNumber.slice(-4)}
                  </div>
                </div>
              </BorderRotate>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="transactions-section">
          <div className="section-header">
            <h2 className="section-title">Recent Transactions</h2>
            <Link to="/transactions" className="view-all-link">
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <BorderRotate
            className="transactions-card"
            animationMode="stop-rotate-on-hover"
            animationSpeed={8}
            borderRadius={20}
          >
            <div className="transactions-list">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.type === 'payment' || transaction.type === 'withdrawal' ? (
                        <ArrowUpRight size={20} className="outgoing" />
                      ) : (
                        <ArrowDownRight size={20} className="incoming" />
                      )}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-title">
                        {transaction.recipientName || transaction.description || transaction.type}
                      </div>
                      <div className="transaction-date">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                    <div className={`transaction-amount ${transaction.type === 'payment' || transaction.type === 'withdrawal' ? 'negative' : 'positive'}`}>
                      {transaction.type === 'payment' || transaction.type === 'withdrawal' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className={`transaction-status ${transaction.status}`}>
                      {transaction.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <DollarSign size={48} />
                  <p>No transactions yet</p>
                  <Link to="/payments" className="empty-action">Make your first payment</Link>
                </div>
              )}
            </div>
          </BorderRotate>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;