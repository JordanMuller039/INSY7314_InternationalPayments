import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, usersAPI } from '../services/api';
import { User } from '../types';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const emptyForm = { firstName: '', lastName: '', email: '', password: '', idNumber: '', accountNumber: '' };
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await usersAPI.getAllUsers();
      // normalize id (server may return _id)
      type RawUser = User & { _id?: string; isActive?: boolean; isVerified?: boolean };
      const raw = (res.data.users || []) as RawUser[];
      const items = raw.map(u => ({ ...u, id: u.id ?? u._id } as User));
      setAllUsers(items);
    } catch (err: unknown) {
      setError(extractError(err) || 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await authAPI.registerEmployee(form);
      setMessage('Employee created successfully');
      setForm(emptyForm);
      await fetchUsers();
    } catch (err: unknown) {
      setError(extractError(err) || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  // Admin actions
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user and all their accounts?')) return;
    try {
      await usersAPI.deleteUser(id);
      setMessage('User deleted');
      await fetchUsers();
    } catch (err: unknown) {
      setError(extractError(err) || 'Failed to delete user');
    }
  };

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setEditForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, idNumber: u.idNumber, accountNumber: u.accountNumber, role: u.role, isActive: u.isActive, isVerified: u.isVerified });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      const payload = { ...editForm } as Partial<User & { password?: string }>; 
      await usersAPI.updateUser(id, payload);
      setMessage('User updated');
      setEditingId(null);
      setEditForm({});
      await fetchUsers();
    } catch (err: unknown) {
      setError(extractError(err) || 'Failed to update user');
    }
  };

  // Helper: safely extract error messages from unknown errors (including Axios)
  function extractError(err: unknown): string | null {
    if (!err) return null;
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    // Try Axios-like shape
    const maybe = err as { response?: { data?: { error?: string } }; message?: string };
    return maybe.response?.data?.error || maybe.message || null;
  }

  return (
    <div className="admin-page admin-centered">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-sub">Manage employees and customers</p>
      </header>

      <main className="admin-main admin-grid">
        <section className="create-employee card-blue admin-card">
          <h2>Create Employee</h2>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="create-form">
            <div className="row">
              <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
              <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="row">
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <input name="password" type="password" placeholder="Temporary password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="row">
              <input name="idNumber" placeholder="ID number" value={form.idNumber} onChange={handleChange} required />
              <input name="accountNumber" placeholder="Account number" value={form.accountNumber} onChange={handleChange} required />
            </div>

            <div className="actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Employee'}
              </button>
            </div>
          </form>
        </section>
        <div className="right-column">
        <section className="admin-card">
          <h2>Employees</h2>
          {loadingUsers ? <div>Loading...</div> : (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>ID</th>
                    <th>Account</th>
                    <th>Active</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.filter(u => u.role === 'employee' || u.role === 'admin').map(u => (
                    <tr key={u.id}>
                      <td>{editingId === u.id ? <input value={(editForm.firstName || '') + ' ' + (editForm.lastName || '')} readOnly /> : `${u.firstName} ${u.lastName}`}</td>
                      <td>{editingId === u.id ? <input value={editForm.email as string || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /> : u.email}</td>
                      <td>{editingId === u.id ? <input value={editForm.idNumber as string || ''} onChange={e => setEditForm({ ...editForm, idNumber: e.target.value })} /> : u.idNumber}</td>
                      <td>{editingId === u.id ? <input value={editForm.accountNumber as string || ''} onChange={e => setEditForm({ ...editForm, accountNumber: e.target.value })} /> : u.accountNumber}</td>
                      <td>{editingId === u.id ? <input type="checkbox" checked={Boolean(editForm.isActive)} onChange={e => setEditForm({ ...editForm, isActive: e.target.checked })} /> : (u.isActive ? 'Yes' : 'No')}</td>
                      <td>{editingId === u.id ? <input type="checkbox" checked={Boolean(editForm.isVerified)} onChange={e => setEditForm({ ...editForm, isVerified: e.target.checked })} /> : (u.isVerified ? 'Yes' : 'No')}</td>
                      <td>
                        {editingId === u.id ? (
                          <>
                            <button className="btn-small" onClick={() => saveEdit(u.id)}>Save</button>
                            <button className="btn-small btn-muted" onClick={cancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-small" onClick={() => startEdit(u)}>Edit</button>
                            <button className="btn-small btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-card">
          <h2>Customers</h2>
          {loadingUsers ? <div>Loading...</div> : (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>ID</th>
                    <th>Account</th>
                    <th>Active</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.filter(u => u.role === 'customer').map(u => (
                    <tr key={u.id}>
                      <td>{u.firstName} {u.lastName}</td>
                      <td>{u.email}</td>
                      <td>{u.idNumber}</td>
                      <td>{u.accountNumber}</td>
                      <td>{u.isActive ? 'Yes' : 'No'}</td>
                      <td>{u.isVerified ? 'Yes' : 'No'}</td>
                      <td>
                        <button className="btn-small" onClick={() => startEdit(u)}>Edit</button>
                        <button className="btn-small btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
