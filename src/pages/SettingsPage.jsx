import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Bell, Download, Trash2, ShieldAlert, Check, LogOut, Send, CheckCircle2, LogIn } from 'lucide-react';
import { useGravequit } from '../context/GravequitContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, setSettings, deleteAccount, items, isAuthenticated, user, logout, apiBase, getAuthHeaders } = useGravequit();
  const [digestStatus, setDigestStatus] = useState(null);

  const toggleWeeklyDigest = () => {
    setSettings({ weeklyDigest: !settings.weeklyDigest });
  };

  const toggleReminderNudges = () => {
    setSettings({ reminderNudges: !settings.reminderNudges });
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gravequit_observations_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleTestDigest = async () => {
    try {
      const res = await fetch(`${apiBase}/notifications/weekly-digest/preview`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setDigestStatus(`Generated preview for ${data.user_email}: "${data.ai_summary.slice(0, 80)}..."`);
      } else {
        setDigestStatus("Please sign in to preview your weekly digest.");
      }
    } catch (e) {
      setDigestStatus("Could not connect to notification service.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you ABSOLUTELY sure you want to permanently delete your account and all observations? This cannot be undone.")) {
      const success = await deleteAccount();
      if (success) {
        navigate('/login');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-[#8A8A8A] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#F5F5F0] mb-2">Authentication Required</h2>
        <p className="text-[#8A8A8A] mb-6">Please sign in to view and manage your account settings.</p>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-4 border-b border-[#2A2A2A] flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-[#F5F5F0]">Settings & Account</h1>
            <p className="text-sm text-[#8A8A8A] mt-1">
              Manage your account, notification preferences, data export, and privacy.
            </p>
          </div>

          {isAuthenticated ? (
            <Button variant="secondary" size="sm" onClick={() => { logout(); navigate('/login'); }}>
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              <span>Sign In</span>
            </Button>
          )}
        </div>

        {/* Account Info */}
        <Card header="Account Information">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8A8A8A] mb-1 uppercase tracking-wider">
                Registered Student Email
              </label>
              <div className="flex items-center gap-3 p-3 bg-[#131313] border border-[#2A2A2A] rounded-lg">
                <Mail className="w-4 h-4 text-[#A8C5B0]" />
                <span className="text-sm font-mono text-[#F5F5F0]">
                  {user?.email || settings.userEmail || ''}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card header="Notification Controls (Never Guilt-Based)">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-3.5 bg-[#131313] border border-[#2A2A2A] rounded-xl">
              <div>
                <span className="text-sm font-semibold text-[#F5F5F0] block">Weekly Digest Email</span>
                <span className="text-xs text-[#8A8A8A]">
                  Auto-summary of your weekly reflection patterns delivered every Sunday.
                </span>
              </div>
              <button
                type="button"
                onClick={toggleWeeklyDigest}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.weeklyDigest ? 'bg-[#354F3E]' : 'bg-[#1A1A1A] border border-[#2A2A2A]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-[#F5F5F0] absolute top-1 transition-all ${
                  settings.weeklyDigest ? 'left-7' : 'left-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#131313] border border-[#2A2A2A] rounded-xl">
              <div>
                <span className="text-sm font-semibold text-[#F5F5F0] block">Optional Reminder Nudges</span>
                <span className="text-xs text-[#8A8A8A]">
                  Gentle check-ins. Explicitly optional and never guilt-inducing.
                </span>
              </div>
              <button
                type="button"
                onClick={toggleReminderNudges}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.reminderNudges ? 'bg-[#354F3E]' : 'bg-[#1A1A1A] border border-[#2A2A2A]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-[#F5F5F0] absolute top-1 transition-all ${
                  settings.reminderNudges ? 'left-7' : 'left-1'
                }`}></div>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button variant="secondary" size="sm" onClick={handleTestDigest}>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>Test Weekly Digest Preview</span>
              </Button>

              {digestStatus && (
                <span className="text-xs text-[#A8C5B0] font-mono">
                  {digestStatus}
                </span>
              )}
            </div>

          </div>
        </Card>

        {/* Data Ownership */}
        <Card header="Your Data Controls">
          <div className="space-y-4">
            <p className="text-xs text-[#8A8A8A]">
              You own all your reflections. Export your complete data as JSON at any time.
            </p>
            <Button variant="secondary" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              <span>Export Observations (JSON)</span>
            </Button>
          </div>
        </Card>

        {/* Destructive Zone (THE ONLY PLACE IN APP WHERE RED STYLING IS USED) */}
        <Card header="Danger Zone" className="border-[#93000A]/40 bg-[#131313]">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#FFB4AB] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#FFB4AB]">Delete Student Account</h4>
                <p className="text-xs text-[#8A8A8A] mt-0.5">
                  Permanently delete all logged items, reason transcripts, and pattern histories. This action is irreversible.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Delete Account & Erase All Data</span>
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
