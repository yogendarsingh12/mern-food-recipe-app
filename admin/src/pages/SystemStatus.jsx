import React, { useState } from 'react';
import { Database, Cloud, Server, Crown } from 'lucide-react';
import { claimAdminRole } from '../services/api';

export default function SystemStatus({ stats, adminUser, onUserUpdated, showNotification }) {
  const [claiming, setClaiming] = useState(false);

  const handleClaimAdmin = async () => {
    try {
      setClaiming(true);
      const res = await claimAdminRole();
      if (res?.data) {
        onUserUpdated(res.data);
        if (showNotification) showNotification('👑 Full Admin Privileges Activated!', 'success');
      }
    } catch (err) {
      if (showNotification) showNotification(err.message, 'error');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Node / Express Backend */}
        <div className="bg-white dark:bg-zinc-900/90 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel transition-colors">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Node / Express Server</h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Live on Port 5000
              </span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 text-xs space-y-2 text-slate-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">development</span>
            </div>
            <div className="flex justify-between">
              <span>Security Auth:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">JWT (30-day token)</span>
            </div>
          </div>
        </div>

        {/* MongoDB Atlas */}
        <div className="bg-white dark:bg-zinc-900/90 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel transition-colors">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">MongoDB Atlas Cluster</h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 text-xs space-y-2 text-slate-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Collections:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">recipes, users</span>
            </div>
            <div className="flex justify-between">
              <span>Total Documents:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {(stats?.totalRecipes || 0) + (stats?.totalUsers || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Cloudinary Media Storage */}
        <div className="bg-white dark:bg-zinc-900/90 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel transition-colors">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cloudinary Storage CDN</h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
                Folder: 'recipes'
              </span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 text-xs space-y-2 text-slate-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Upload Engine:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">multer-storage-cloudinary</span>
            </div>
            <div className="flex justify-between">
              <span>Max Image Dimension:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">1200x800 Max</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Session Info Card */}
      <div className="bg-gradient-to-r from-slate-100 to-amber-50 dark:from-zinc-900 dark:to-zinc-850 p-7 rounded-3xl border border-amber-500/30 shadow-xs dark:shadow-panel transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Crown className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <span>Admin Profile Summary</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
              Logged in as <strong className="text-slate-900 dark:text-white">{adminUser.name}</strong> ({adminUser.email}). Active role: <strong className="text-amber-600 dark:text-amber-400 uppercase font-black">{adminUser.role}</strong>.
            </p>
          </div>

          {adminUser.role !== 'admin' && (
            <button
              onClick={handleClaimAdmin}
              disabled={claiming}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>{claiming ? 'Processing...' : 'Claim Full Admin Privileges'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
