import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, Clock, AlertCircle, RotateCcw, CheckCircle2, Trash2, LogIn } from 'lucide-react';
import { useGravequit } from '../context/GravequitContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TagPill } from '../components/TagPill';

export const MyItemsPage = () => {
  const navigate = useNavigate();
  const { items, setIsAddItemModalOpen, openQuitModal, recommitItem, deleteItem, isAuthenticated, user } = useGravequit();

  const activeItems = items.filter(i => i.status === 'active');
  const quitItems = items.filter(i => i.status === 'quit');

  const handleDelete = async (e, id, title) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteItem(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2A]">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-[#F5F5F0]">My Items</h1>
            <p className="text-sm text-[#8A8A8A] mt-1">
              {isAuthenticated 
                ? `Logged in as ${user?.email} — observe your active pursuits and reflect on completed observations.`
                : 'Observe your active pursuits and reflect on completed observations.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Button variant="secondary" onClick={() => navigate('/login')}>
                <LogIn className="w-4 h-4 mr-2" />
                <span>Sign In to Sync</span>
              </Button>
            ) : null}

            <Button variant="primary" onClick={() => setIsAddItemModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              <span>Add Item</span>
            </Button>
          </div>
        </div>

        {/* Section 1: Currently Active Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-headline text-[#F5F5F0] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8C5B0] inline-block animate-pulse"></span>
              <span>Currently Active</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#8A8A8A]">
                {activeItems.length}
              </span>
            </h2>
          </div>

          {activeItems.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-sm text-[#8A8A8A]">No active items being tracked right now.</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsAddItemModalOpen(true)}>
                Start Logging a New Item
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeItems.map((item) => (
                <Card 
                  key={item.id} 
                  hoverable={true}
                  className="flex flex-col justify-between space-y-4"
                  onClick={() => navigate(`/items/${item.id}`)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#20201F] text-[#A8C5B0] border border-[#2A2A2A]">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.riskScore !== undefined && (
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                            item.riskScore > 65 
                              ? 'bg-[#1A1A1A] text-[#C5C7C1] border-[#454843]' 
                              : 'bg-[#1A1A1A] text-[#8A8A8A] border-[#2A2A2A]'
                          }`}>
                            Risk: {item.riskScore}%
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item.id, item.title)}
                          className="p-1 text-[#8A8A8A] hover:text-[#FFB4AB] transition-colors rounded"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-headline text-[#F5F5F0] group-hover:text-[#A8C5B0] transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Started: {item.started_at}</span>
                    </div>

                    {item.note && (
                      <p className="text-xs text-[#8A8A8A] line-clamp-2 italic bg-[#131313] p-2.5 rounded-lg border border-[#2A2A2A]">
                        "{item.note}"
                      </p>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/items/${item.id}`)}
                      className="text-xs text-[#8A8A8A] hover:text-[#F5F5F0] flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openQuitModal(item)}
                    >
                      Mark as Quit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Past Observations (Quit Items) */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-headline text-[#F5F5F0] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8A8A8A] inline-block"></span>
              <span>Past Observations</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#8A8A8A]">
                {quitItems.length}
              </span>
            </h2>
          </div>

          {quitItems.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-xs text-[#8A8A8A]">No past quit reflections recorded yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quitItems.map((item) => (
                <Card 
                  key={item.id}
                  hoverable={true}
                  className="flex flex-col justify-between space-y-4 border-[#2A2A2A]/80 opacity-90 hover:opacity-100"
                  onClick={() => navigate(`/items/${item.id}`)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#8A8A8A]">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#8A8A8A] font-mono">
                          {item.durationDays} days active
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item.id, item.title)}
                          className="p-1 text-[#8A8A8A] hover:text-[#FFB4AB] transition-colors rounded"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-semibold font-headline text-[#F5F5F0]">
                      {item.title}
                    </h3>

                    <div>
                      <span className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1">
                        Closure Tag
                      </span>
                      <TagPill tag={item.reason_tag || 'Other'} selected={true} size="sm" />
                    </div>

                    {item.reason_text && (
                      <p className="text-xs text-[#8A8A8A] line-clamp-2 italic bg-[#131313] p-2.5 rounded-lg border border-[#2A2A2A]">
                        "{item.reason_text}"
                      </p>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/items/${item.id}`)}
                      className="text-xs text-[#8A8A8A] hover:text-[#F5F5F0] flex items-center gap-1"
                    >
                      <span>View Detail</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => recommitItem(item.id)}
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      <span>Re-Commit (Easier)</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
