import React, { useState, useMemo } from 'react';
import { Search, Trash2, Users, RefreshCw, X, Plus, Edit3, BookOpen } from 'lucide-react';
import { deleteAdminUser } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../context/LanguageContext';
import AdminUserModal from '../components/AdminUserModal';
import AdminUserRecipesModal from '../components/AdminUserRecipesModal';

export default function UserManager({ users, setUsers, currentAdmin, onRefresh, onPreviewRecipe, showNotification }) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [viewingUserRecipes, setViewingUserRecipes] = useState(null);

  // Debounce search query
  const debouncedSearch = useDebounce(search, 200);

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Admin Action: Are you sure you want to delete account for "${userName}" and all their published recipes?`)) {
      try {
        const res = await deleteAdminUser(userId);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        if (showNotification) showNotification(res.message, 'success');
        onRefresh();
      } catch (err) {
        console.error('Delete user error:', err);
        if (showNotification) showNotification(err.response?.data?.message || 'Failed to delete user', 'error');
      }
    }
  };

  const handleUserSaved = (savedUser, action) => {
    if (action === 'created') {
      setUsers((prev) => [savedUser, ...prev]);
      if (showNotification) showNotification(`🎉 Chef "${savedUser.name}" created successfully!`, 'success');
    } else {
      setUsers((prev) => prev.map((u) => (u._id === savedUser._id ? savedUser : u)));
      if (showNotification) showNotification(`Chef "${savedUser.name}" updated successfully!`, 'success');
    }
  };

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return users;

    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
    );
  }, [users, debouncedSearch]);

  return (
    <div className="bg-white dark:bg-zinc-900/90 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel overflow-hidden animate-fadeIn transition-colors">
      {/* Table Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-3 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chefs by name, email..."
            className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium hidden md:inline">
            Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> of {users.length} registered accounts
          </span>

          <button
            onClick={onRefresh}
            title="Refresh users"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-700/60 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Create User Button */}
          <button
            onClick={() => setIsCreatingUser(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Chef / User</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-zinc-400">
          <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 font-bold border-b border-slate-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-4 px-6">{t('users')}</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">{t('recipes')}</th>
              <th className="py-4 px-4">{t('date')}</th>
              <th className="py-4 px-6 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                  No user accounts found matching "{debouncedSearch}"
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const isSelf = currentAdmin?._id === user._id;

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* User Name & Initial */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs flex items-center justify-center shadow-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isSelf && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-500 font-black">
                                (You)
                              </span>
                            )}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            ID: {user._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
                      {user.email}
                    </td>

                    {/* Recipes Created Count & View Recipes Button */}
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-zinc-200">
                      <button
                        onClick={() => setViewingUserRecipes(user)}
                        title="View chef's dishes"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-amber-500/20 text-slate-700 dark:text-zinc-300 hover:text-amber-500 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                        <span>{user.recipeCount !== undefined ? `${user.recipeCount} ${t('dishes')}` : '0 dishes'}</span>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 text-slate-500 dark:text-zinc-400 text-[11px]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>

                    {/* Actions (Edit, View Dishes, Delete) */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit User Button */}
                        <button
                          onClick={() => setEditingUser(user)}
                          title="Edit Chef Details & Password"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-zinc-300 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            title="Delete User Account"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-red-600 hover:text-white text-slate-600 dark:text-zinc-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* User Create / Edit Modal */}
      {(isCreatingUser || editingUser) && (
        <AdminUserModal
          isOpen={Boolean(isCreatingUser || editingUser)}
          user={editingUser}
          onClose={() => {
            setIsCreatingUser(false);
            setEditingUser(null);
          }}
          onSaved={handleUserSaved}
        />
      )}

      {/* User Recipes Preview Modal */}
      {viewingUserRecipes && (
        <AdminUserRecipesModal
          user={viewingUserRecipes}
          onClose={() => setViewingUserRecipes(null)}
          onPreviewRecipe={onPreviewRecipe}
        />
      )}
    </div>
  );
}
