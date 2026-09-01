import React, { useState, useEffect, lazy, Suspense } from 'react';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import AdminErrorBoundary from './components/AdminErrorBoundary';
import AdminPageLoader from './components/AdminPageLoader';
import { fetchAdminStats, fetchAdminRecipes, fetchAdminUsers } from './services/api';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// Production Code-Splitting: Lazy load Admin Views & Modals
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RecipeManager = lazy(() => import('./pages/RecipeManager'));
const UserManager = lazy(() => import('./pages/UserManager'));
const SystemStatus = lazy(() => import('./pages/SystemStatus'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminEditModal = lazy(() => import('./components/AdminEditModal'));
const RecipePreviewModal = lazy(() => import('./components/RecipePreviewModal'));

export default function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data
  const [stats, setStats] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Modals
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [previewRecipe, setPreviewRecipe] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check existing session
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('recipe_admin_user');
      const storedToken = localStorage.getItem('recipe_admin_token');
      if (storedUser && storedToken) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'admin') {
          setAdminUser(parsed);
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all admin data
  const loadData = async () => {
    if (!adminUser) return;
    try {
      const [statsRes, recipesRes, usersRes] = await Promise.all([
        fetchAdminStats(),
        fetchAdminRecipes(),
        fetchAdminUsers(),
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      if (recipesRes?.data) setRecipes(recipesRes.data);
      if (usersRes?.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast(err.response?.data?.message || 'Failed to sync data', 'error');
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadData();
    }
  }, [adminUser]);

  const handleLoginSuccess = (userData) => {
    setAdminUser(userData);
    showToast(`👑 Welcome to Vyanjan Studio, Admin ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('recipe_admin_token');
    localStorage.removeItem('recipe_admin_user');
    setAdminUser(null);
    showToast('Logged out of Vyanjan Studio.', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] flex items-center justify-center text-slate-900 dark:text-white">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // If not logged in as Admin, show login screen
  if (!adminUser) {
    return (
      <Suspense fallback={<AdminPageLoader />}>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </Suspense>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-300">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
            <div
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-semibold ${
                toast.type === 'error'
                  ? 'bg-red-900 text-white border-red-700'
                  : 'bg-slate-900 dark:bg-zinc-800 text-white border-slate-700 dark:border-zinc-700'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Admin Navbar */}
        <AdminNavbar adminUser={adminUser} onLogout={handleLogout} />

        {/* Main Container with Suspense Fallback */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
          {/* Navigation Tabs */}
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={{ recipes: recipes.length, users: users.length }}
          />

          <Suspense fallback={<AdminPageLoader />}>
            {/* Tab 1: Dashboard */}
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                onNavigateTab={setActiveTab}
                onPreviewRecipe={(r) => setPreviewRecipe(r)}
              />
            )}

            {/* Tab 2: Recipes */}
            {activeTab === 'recipes' && (
              <RecipeManager
                recipes={recipes}
                setRecipes={setRecipes}
                onEditRecipe={(r) => setEditingRecipe(r)}
                onPreviewRecipe={(r) => setPreviewRecipe(r)}
                onRefresh={loadData}
                showNotification={showToast}
              />
            )}

            {/* Tab 3: Users */}
            {activeTab === 'users' && (
              <UserManager
                users={users}
                setUsers={setUsers}
                currentAdmin={adminUser}
                onRefresh={loadData}
                onPreviewRecipe={(r) => setPreviewRecipe(r)}
                showNotification={showToast}
              />
            )}

            {/* Tab 4: Admin Team & Settings */}
            {activeTab === 'settings' && (
              <AdminSettings
                currentAdmin={adminUser}
                showNotification={showToast}
              />
            )}

            {/* Tab 5: System Health */}
            {activeTab === 'system' && (
              <SystemStatus
                stats={stats}
                adminUser={adminUser}
                onUserUpdated={(u) => {
                  setAdminUser(u);
                  localStorage.setItem('recipe_admin_user', JSON.stringify(u));
                }}
                showNotification={showToast}
              />
            )}
          </Suspense>
        </main>

        {/* Edit Recipe Modal */}
        <Suspense fallback={null}>
          {editingRecipe && (
            <AdminEditModal
              recipe={editingRecipe}
              onClose={() => setEditingRecipe(null)}
              onUpdated={(updated) => {
                setRecipes((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
                showToast('Recipe successfully updated by Admin', 'success');
              }}
            />
          )}

          {/* Preview Recipe Modal */}
          {previewRecipe && (
            <RecipePreviewModal
              recipe={previewRecipe}
              onClose={() => setPreviewRecipe(null)}
            />
          )}
        </Suspense>

        {/* Clean Admin Footer */}
        <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] py-5 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium transition-colors">
          &copy; {new Date().getFullYear()} Vyanjan Studio &bull; Executive Platform Administration
        </footer>
      </div>
    </AdminErrorBoundary>
  );
}
