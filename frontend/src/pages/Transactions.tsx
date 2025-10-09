import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionsAPI } from '../services/api';
import { BorderRotate } from '../components/ui/animated-gradient-border';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Search,
  DollarSign,
  Calendar
} from 'lucide-react';
import type { Transaction } from '../types';
import '../styles/Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'payment' | 'deposit' | 'withdrawal'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionsAPI.getTransactions();
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = 
      transaction.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalSpent = transactions
    .filter(t => t.type === 'payment' || t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        {/* Header */}
        <div className="transactions-header">
          <div className="header-content">
            <h1>Transaction History</h1>
            <p>View and manage all your transactions</p>
          </div>
          <button className="export-btn" onClick={() => alert('Export coming soon!')}>
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <BorderRotate
            className="stat-card"
            animationMode="rotate-on-hover"
            animationSpeed={4}
            borderRadius={16}
            backgroundColor="transparent"
          >
            <div className="stat-card-inner">
              <div className="stat-icon sent">
                <ArrowUpRight size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Sent</div>
                <div className="stat-value">{formatCurrency(totalSpent)}</div>
              </div>
            </div>
          </BorderRotate>

          <BorderRotate
            className="stat-card"
            animationMode="rotate-on-hover"
            animationSpeed={4}
            borderRadius={16}
            backgroundColor="transparent"
          >
            <div className="stat-card-inner">
              <div className="stat-icon received">
                <ArrowDownRight size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Received</div>
                <div className="stat-value">{formatCurrency(totalReceived)}</div>
              </div>
            </div>
          </BorderRotate>

          <BorderRotate
            className="stat-card"
            animationMode="rotate-on-hover"
            animationSpeed={4}
            borderRadius={16}
            backgroundColor="transparent"
          >
            <div className="stat-card-inner">
              <div className="stat-icon total">
                <History size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Transactions</div>
                <div className="stat-value">{transactions.length}</div>
              </div>
            </div>
          </BorderRotate>
        </div>

        {/* Filters & Search */}
        <div className="controls-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'payment' ? 'active' : ''}`}
              onClick={() => setFilter('payment')}
            >
              Payments
            </button>
            <button
              className={`filter-btn ${filter === 'deposit' ? 'active' : ''}`}
              onClick={() => setFilter('deposit')}
            >
              Deposits
            </button>
            <button
              className={`filter-btn ${filter === 'withdrawal' ? 'active' : ''}`}
              onClick={() => setFilter('withdrawal')}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <section className="transactions-list-section">
          <BorderRotate
            className="transactions-list-card"
            animationMode="stop-rotate-on-hover"
            animationSpeed={8}
            borderRadius={20}
            backgroundColor="transparent"
          >
            <div className="transactions-list-inner">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-row">
                    <div className="transaction-icon-wrapper">
                      <div className={`transaction-type-icon ${transaction.type}`}>
                        {transaction.type === 'payment' || transaction.type === 'withdrawal' ? (
                          <ArrowUpRight size={20} />
                        ) : (
                          <ArrowDownRight size={20} />
                        )}
                      </div>
                    </div>

                    <div className="transaction-info">
                      <div className="transaction-main">
                        <div className="transaction-title">
                          {transaction.recipientName || transaction.description || transaction.type}
                        </div>
                        <div className="transaction-id">ID: {transaction.transactionId}</div>
                      </div>
                      <div className="transaction-meta">
                        <Calendar size={14} />
                        <span>{formatDate(transaction.createdAt)}</span>
                      </div>
                    </div>

                    <div className="transaction-amount-wrapper">
                      <div className={`transaction-amount ${transaction.type === 'payment' || transaction.type === 'withdrawal' ? 'negative' : 'positive'}`}>
                        {transaction.type === 'payment' || transaction.type === 'withdrawal' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="transaction-currency">{transaction.currency}</div>
                    </div>

                    <div className={`transaction-status-badge ${transaction.status}`}>
                      {transaction.status}
                    </div>

                    <button className="view-details-btn">
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-transactions">
                  <DollarSign size={64} />
                  <h3>No Transactions Found</h3>
                  <p>
                    {searchTerm 
                      ? 'Try adjusting your search or filters' 
                      : "You haven't made any transactions yet"}
                  </p>
                  {!searchTerm && (
                    <Link to="/payments" className="make-payment-btn">
                      Make Your First Payment
                    </Link>
                  )}
                </div>
              )}
            </div>
          </BorderRotate>
        </section>
      </div>
    </div>
  );
};

export default Transactions;