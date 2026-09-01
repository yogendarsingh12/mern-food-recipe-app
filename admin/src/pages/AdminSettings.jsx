import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  KeyRound, 
  Server, 
  HardDrive, 
  Sliders,
  Eye,
  EyeOff
} from 'lucide-react';
import { fetchAdminTeam, createAdminAccount, updateAdminAccount, deleteAdminAccount } from '../services/api';

export default function AdminSettings({ currentAdmin, showNotification }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit modal state
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchAdminTeam();
      if (res?.data) {
        setAdmins(res.data);
      }
    } catch (err) {
      console.error('Fetch admins error:', err);
      setError(err.response?.data?.message || 'Failed to load admin team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      alert('Please provide all fields');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    try {
      setCreating(true);
      const res = await createAdminAccount({
        name: newName.trim(),
        email: newEmail.toLowerCase().trim(),
        password: newPassword,
      });
      if (showNotification) showNotification(res.message, 'success');
      setShowCreateModal(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setShowNewPassword(false);
      loadAdmins();
    } catch (err) {
      console.error('Create admin error:', err);
      if (showNotification) showNotification(err.response?.data?.message || 'Failed to create admin', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    try {
      setUpdating(true);
      const data = { name: editName.trim() };
      if (editPassword.trim()) {
        data.password = editPassword.trim();
      }
      const res = await updateAdminAccount(editingAdmin._id, data);
      if (showNotification) showNotification(res.message, 'success');
      setEditingAdmin(null);
      setShowEditPassword(false);
      loadAdmins();
    } catch (err) {
      console.error('Update admin error:', err);
      if (showNotification) showNotification(err.response?.data?.message || 'Failed to update admin', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAdmin = async (id, name) => {
    if (id === currentAdmin._id) {
      alert('You cannot delete your own active admin session!');
      return;
    }
    if (window.confirm(`Are you sure you want to revoke Administrator access for "${name}"?`)) {
      try {
        const res = await deleteAdminAccount(id);
        if (showNotification) showNotification(res.message, 'success');
        setAdmins((prev) => prev.filter((a) => a._id !== id));
      } catch (err) {
        console.error('Delete admin error:', err);
        if (showNotification) showNotification(err.response?.data?.message || 'Failed to delete admin', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Executive Team & Access Control</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Administrator Accounts & Security
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-1">
            Create, manage, and revoke administrator privileges for the Vyanjan platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdmins}
            title="Refresh list"
            className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <UserPlus className="w-4 h-4 stroke-[3]" />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      {/* Admin Team Table */}
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>Active Administrators ({admins.length})</span>
          </h3>
          <span className="text-xs text-slate-400 dark:text-zinc-500">
            Current Session: <strong className="text-slate-900 dark:text-white">{currentAdmin.name}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-zinc-400">
            <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 font-bold border-b border-slate-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Administrator</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Role Privileges</th>
                <th className="py-4 px-4">Created Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-slate-50 dark:hover:bg-zinc-850/50 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center text-xs border border-amber-500/30 shrink-0">
                      {admin.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <span>{admin.name}</span>
                        {admin._id === currentAdmin._id && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">ID: {admin._id.slice(-6)}</p>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-700 dark:text-zinc-300">{admin.email}</td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-black text-[10px] uppercase tracking-wider">
                      <Shield className="w-3 h-3 text-amber-500" />
                      <span>SUPER ADMIN</span>
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-500 dark:text-zinc-500 text-[11px]">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingAdmin(admin);
                          setEditName(admin.name);
                          setEditPassword('');
                          setShowEditPassword(false);
                        }}
                        title="Edit Admin"
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {admin._id !== currentAdmin._id && (
                        <button
                          onClick={() => handleDeleteAdmin(admin._id, admin.name)}
                          title="Revoke Admin Access"
                          className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Administrator */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-500" />
                <span>Create Administrator Account</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Chef Admin"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@vyanjan.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Secure Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="•••••••• (Min 6 chars)"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-slate-900 dark:text-white font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black text-xs shadow-md"
                >
                  {creating ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Administrator */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <span>Edit Admin Profile</span>
              </h3>
              <button
                onClick={() => setEditingAdmin(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Reset Password <span className="text-slate-400 font-normal">(Leave blank to keep unchanged)</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="New password (optional)"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-2.5 p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md"
                >
                  {updating ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
