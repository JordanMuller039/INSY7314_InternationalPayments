import { useEffect, useState } from 'react';
import { usersAPI } from '../services/api';
import { User } from '../types';
import '../styles/Admin.css';

const EmployeesPage = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await usersAPI.getCustomers();
        // normalize id field (_id from Mongo -> id) for frontend consistency
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = (res.data.customers || []).map((u: any) => ({ ...u, id: u.id || u._id }));
        setCustomers(items);
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = err as any;
        setError(e?.response?.data?.error || e?.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Customers</h1>
        <p className="admin-sub">All customers (sensitive financial data excluded)</p>
      </header>

      <main>
        {loading && <div>Loading customers...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="card-blue">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>ID Number</th>
                  <th>Account Number</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.firstName} {c.lastName}</td>
                    <td>{c.email}</td>
                    <td>{c.idNumber}</td>
                    <td>{c.accountNumber}</td>
                    <td>{c.role}</td>
                    <td>{c.isActive ? 'Yes' : 'No'}</td>
                    <td>{c.isVerified ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeesPage;
