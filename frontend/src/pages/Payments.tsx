import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI, accountsAPI } from '../services/api';
import { BorderRotate } from '../components/ui/animated-gradient-border';
import { 
  Send, 
  Globe, 
  DollarSign, 
  CreditCard, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Building2,
  User,
  Hash
} from 'lucide-react';
import type { Account } from '../types';
import '../styles/Payments.css';

const Payments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

    const [paymentData, setPaymentData] = useState({
    fromAccount: '',
    recipientName: '',
    recipientAccount: '',
    recipientBank: '',
    amount: '',
    currency: 'USD',
    swiftCode: '',
    reference: '',
    description: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAccounts();
      setAccounts(response.data.accounts);
      if (response.data.accounts.length > 0) {
        setPaymentData(prev => ({ ...prev, fromAccount: response.data.accounts[0].accountNumber }));
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate before sending
    if (!paymentData.fromAccount) {
      setError('Please select an account');
      setLoading(false);
      return;
    }

    if (parseFloat(paymentData.amount) <= 0) {
      setError('Amount must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      interface PaymentPayload {
        fromAccount: string;
        recipientName: string;
        recipientAccount: string;
        recipientBank: string;
        amount: number;
        currency: string;
        swiftCode: string;
        reference?: string;
        description?: string;
      }

      const paymentPayload: PaymentPayload = {
        fromAccount: paymentData.fromAccount,
        recipientName: paymentData.recipientName.trim(),
        recipientAccount: paymentData.recipientAccount.trim(),
        recipientBank: paymentData.recipientBank.trim(),
        amount: parseFloat(paymentData.amount),
        currency: paymentData.currency.toUpperCase(),
        swiftCode: paymentData.swiftCode.trim().toUpperCase(),
      };

      // Only add reference if it has a value
      if (paymentData.reference.trim()) {
        paymentPayload.reference = paymentData.reference.trim();
      }

      // Only add description if it has a value
      if (paymentData.description.trim()) {
        paymentPayload.description = paymentData.description.trim();
      }

      console.log('Sending payment:', paymentPayload); // Debug log

      await paymentsAPI.createPayment(paymentPayload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } catch (err) {
      const error = err as { response?: { data?: { details?: Array<{ msg: string }>; error?: string } } };
      console.error('Payment error:', error.response?.data); // Debug log
      
      // Better error handling
      if (error.response?.data?.details) {
        // Validation errors
        const validationErrors = error.response.data.details
          .map((detail) => detail.msg)
          .join(', ');
        setError(validationErrors);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Payment failed. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  if (loadingAccounts) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading payment form...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="payments-page">
        <div className="success-container">
          <BorderRotate
            className="success-card"
            animationMode="auto-rotate"
            animationSpeed={3}
            borderRadius={24}
            backgroundColor="transparent"
          >
            <div className="success-content">
              <CheckCircle size={64} />
              <h2>Payment Submitted!</h2>
              <p>Your international payment has been submitted successfully and is pending processing.</p>
              <button onClick={() => navigate('/transactions')} className="view-btn">
                View Transactions
                <ArrowRight size={20} />
              </button>
            </div>
          </BorderRotate>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="payments-container">
        {/* Header */}
        <div className="payments-header">
          <div className="header-content">
            <h1>International Payment</h1>
            <p>Send money globally with competitive rates</p>
          </div>
          <div className="header-badge">
            <Globe size={20} />
            <span>Secure & Fast</span>
          </div>
        </div>

        <div className="payments-content">
          {/* Payment Form */}
          <div className="payment-form-section">
            <BorderRotate
              className="payment-form-card"
              animationMode="rotate-on-hover"
              animationSpeed={5}
              borderRadius={24}
              backgroundColor="transparent"
            >
              <form onSubmit={handleSubmit} className="payment-form">
                <h2>Payment Details</h2>

                {error && (
                  <div className="error-alert">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                {/* From Account */}
                <div className="form-section">
                  <h3>From</h3>
                  <div className="form-group">
                    <label htmlFor="fromAccount">
                      <CreditCard size={18} />
                      Select Account
                    </label>
                    <select
                      id="fromAccount"
                      name="fromAccount"
                      value={paymentData.fromAccount}
                      onChange={handleInputChange}
                      required
                    >
                      {accounts.map((account) => (
                        <option key={account._id} value={account.accountNumber}>
                          {account.accountType} - ****{account.accountNumber.slice(-4)} (${account.balance.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="form-section">
                  <h3>Recipient Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="recipientName">
                      <User size={18} />
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      placeholder="John Doe"
                      value={paymentData.recipientName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="recipientAccount">
                      <Hash size={18} />
                      Recipient Account Number
                    </label>
                    <input
                      type="text"
                      id="recipientAccount"
                      name="recipientAccount"
                      placeholder="1234567890"
                      value={paymentData.recipientAccount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="recipientBank">
                      <Building2 size={18} />
                      Recipient Bank
                    </label>
                    <input
                      type="text"
                      id="recipientBank"
                      name="recipientBank"
                      placeholder="Example International Bank"
                      value={paymentData.recipientBank}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="swiftCode">
                      <Globe size={18} />
                      SWIFT/BIC Code
                    </label>
                    <input
                      type="text"
                      id="swiftCode"
                      name="swiftCode"
                      placeholder="EXAMPLEGB2L"
                      value={paymentData.swiftCode}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="input-hint">8 or 11 character SWIFT code</span>
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="form-section">
                  <h3>Payment Amount</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="amount">
                        <DollarSign size={18} />
                        Amount
                      </label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        value={paymentData.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="currency">Currency</label>
                      <select
                        id="currency"
                        name="currency"
                        value={paymentData.currency}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="ZAR">ZAR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="form-section">
                  <h3>Additional Information (Optional)</h3>
                  
                  <div className="form-group">
                    <label htmlFor="reference">Reference Number</label>
                    <input
                      type="text"
                      id="reference"
                      name="reference"
                      placeholder="INV-2024-001"
                      value={paymentData.reference}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Payment for services..."
                      rows={3}
                      value={paymentData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner">Processing...</span>
                  ) : (
                    <>
                      Send Payment
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </BorderRotate>
          </div>

          {/* Info Sidebar */}
          <div className="payment-info-section">
            <BorderRotate
              className="info-card"
              animationMode="auto-rotate"
              animationSpeed={8}
              borderRadius={20}
              backgroundColor="transparent"
            >
              <div className="info-content">
                <h3>Payment Information</h3>
                <div className="info-items">
                  <div className="info-item">
                    <Send size={24} />
                    <div>
                      <h4>Fast Processing</h4>
                      <p>Most payments processed within 1-3 business days</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Globe size={24} />
                    <div>
                      <h4>Global Reach</h4>
                      <p>Send money to over 200 countries worldwide</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <DollarSign size={24} />
                    <div>
                      <h4>Competitive Rates</h4>
                      <p>Low fees and transparent exchange rates</p>
                    </div>
                  </div>
                </div>
              </div>
            </BorderRotate>

            <div className="security-badge">
              <CheckCircle size={20} />
              <div>
                <h4>Secure Payment</h4>
                <p>Bank-grade encryption protects your transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;