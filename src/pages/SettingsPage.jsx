import React from 'react';
import { Mail, Bell, Download, Trash2, ShieldAlert, Check } from 'lucide-react';
import { useGravequit } from '../context/GravequitContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const SettingsPage = () => {
  const { settings, setSettings, deleteAccount, items } = useGravequit();

  const toggleWeeklyDigest = () => {
    setSettings(prev => ({ ...prev, weeklyDigest: !prev.weeklyDigest }));
  };

  const toggleReminderNudges = () => {
    setSettings(prev => ({ ...prev, reminderNudges: !prev.reminderNudges }));
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "gravequit_student_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-4 border-b border-[#2A2A2A]">
          <h1 className="text-3xl font-extrabold font-headline text-[#F5F5F0]">Settings & Account</h1>
          <p className="text-sm text-[#8A8A8A] mt-1">
            Manage your account, notification preferences, data export, and privacy.
          </p>
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
                <span className="text-sm font-mono text-[#F5F5F0]">{settings.userEmail}</span>
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
                className={`w-12 h-6 rounded-full transition-colors relative ${
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
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.reminderNudges ? 'bg-[#354F3E]' : 'bg-[#1A1A1A] border border-[#2A2A2A]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-[#F5F5F0] absolute top-1 transition-all ${
                  settings.reminderNudges ? 'left-7' : 'left-1'
                }`}></div>
              </button>
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
              <Button variant="destructive" onClick={deleteAccount}>
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
