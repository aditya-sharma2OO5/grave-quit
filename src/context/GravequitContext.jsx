import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { 
  INITIAL_ADVISOR_METRICS, 
  INITIAL_INTERNAL_METRICS,
  VALID_REASON_TAGS 
} from '../data/mockData';

const API_BASE = 'http://localhost:8000';

const GravequitContext = createContext(null);

export const GravequitProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [activeQuitItem, setActiveQuitItem] = useState(null);

  const [patternData, setPatternData] = useState(null);
  
  const [settings, setSettings] = useState({
    userEmail: 'student.reflect@university.edu',
    weeklyDigest: true,
    reminderNudges: false,
    anonymizedAdvisorOptIn: true
  });

  // ─── Load items from real API on mount ───────────────────────────
  const fetchPatternsSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/patterns/summary`);
      if (res.ok) {
        const data = await res.json();
        setPatternData(data);
      }
    } catch (err) {
      console.error('Failed to load patterns summary:', err);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/items`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      
      // Normalize API fields & fetch risk scores in parallel
      const normalized = await Promise.all(data.map(async (item) => {
        let riskScore = 20;
        let riskReason = 'Calculated from history';
        if (item.status === 'active') {
          try {
            const rRes = await fetch(`${API_BASE}/items/${item.id}/risk`);
            if (rRes.ok) {
              const rData = await rRes.json();
              riskScore = Math.round(rData.risk_percentage);
              riskReason = rData.driving_factor;
            }
          } catch (e) {
            console.error("Error fetching risk score:", e);
          }
        }
        return {
          ...item,
          id: String(item.id),
          started_at: item.started_at ? item.started_at.split('T')[0] : null,
          ended_at: item.ended_at ? item.ended_at.split('T')[0] : null,
          riskScore,
          riskBadge: riskScore > 60 ? 'High Risk' : riskScore > 30 ? 'Moderate Risk' : 'Low Risk',
          riskReason,
          reason_tag: item.quit_reason?.reason_tag ?? null,
          reason_text: item.quit_reason?.reason_text ?? null,
          durationDays: item.started_at && item.ended_at
            ? Math.ceil((new Date(item.ended_at) - new Date(item.started_at)) / (1000 * 60 * 60 * 24))
            : null,
        };
      }));

      setItems(normalized);
      setApiError(null);
    } catch (err) {
      console.error('Failed to load items from API:', err);
      setApiError('Could not connect to the backend. Is it running on port 8000?');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchPatternsSummary();
  }, [fetchItems, fetchPatternsSummary]);

  // ─── Calculate pattern stats from real items ──────────────────────
  const patternStats = useMemo(() => {
    const quitItems = items.filter(i => i.status === 'quit');
    const totalQuitEvents = quitItems.length;

    if (totalQuitEvents === 0) {
      return {
        averageDaysToQuit: 0,
        totalQuitEvents: 0,
        momentumScore: 85,
        aiSummaryText: patternData?.ai_summary ?? "No past quit items recorded yet. As you observe your journeys, gentle pattern insights will form here.",
        tagBreakdown: VALID_REASON_TAGS.map(tag => ({ tag, count: 0, percentage: 0 }))
      };
    }

    const totalDays = quitItems.reduce((acc, curr) => acc + (curr.durationDays || 14), 0);
    const averageDaysToQuit = Math.round(totalDays / totalQuitEvents);

    const counts = {};
    VALID_REASON_TAGS.forEach(tag => { counts[tag] = 0; });
    quitItems.forEach(i => {
      if (i.reason_tag && VALID_REASON_TAGS.includes(i.reason_tag)) {
        counts[i.reason_tag] += 1;
      } else {
        counts['Other'] = (counts['Other'] || 0) + 1;
      }
    });

    const tagBreakdown = VALID_REASON_TAGS.map(tag => ({
      tag,
      count: counts[tag] || 0,
      percentage: Math.round(((counts[tag] || 0) / totalQuitEvents) * 100)
    }));

    const topTagObj = [...tagBreakdown].sort((a, b) => b.count - a.count)[0];
    const topTag = topTagObj ? topTagObj.tag : 'No Deadline';

    const aiSummaryText = patternData?.ai_summary
      ?? `Across your ${totalQuitEvents} past observations, your primary closure driver is '${topTag}'. Average commitment duration is ${averageDaysToQuit} days before pausing.`;

    return {
      averageDaysToQuit,
      totalQuitEvents,
      momentumScore: Math.min(95, 65 + totalQuitEvents * 2),
      aiSummaryText,
      tagBreakdown
    };
  }, [items, patternData]);

  // ─── Add item via real API ────────────────────────────────────────
  const addItem = async (itemData) => {
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: itemData.title,
          category: itemData.category || 'Skill',
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setIsAddItemModalOpen(false);
      await fetchItems(); // Refresh the list from server
    } catch (err) {
      console.error('Failed to add item:', err);
      alert('Could not save item. Is the backend running?');
    }
  };

  // ─── Quit modal helpers ───────────────────────────────────────────
  const openQuitModal = (item) => {
    setActiveQuitItem(item);
    setIsQuitModalOpen(true);
  };

  const closeQuitModal = () => {
    setActiveQuitItem(null);
    setIsQuitModalOpen(false);
  };

  // ─── Submit quit event via real API ──────────────────────────────
  const submitQuitEvent = async ({ itemId, reason_tag, reason_text, voice_transcript }) => {
    const validTag = VALID_REASON_TAGS.includes(reason_tag) ? reason_tag : 'other';
    try {
      const res = await fetch(`${API_BASE}/items/${itemId}/quit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason_tag: validTag,
          reason_text: reason_text || '',
          voice_transcript: voice_transcript || null,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      closeQuitModal();
      await fetchItems(); // Refresh from server
    } catch (err) {
      console.error('Failed to submit quit event:', err);
      alert('Could not record quit. Is the backend running?');
    }
  };

  // ─── Recommit (local only for now) ───────────────────────────────
  const recommitItem = async (itemId) => {
    const sourceItem = items.find(i => i.id === itemId);
    if (!sourceItem) return;
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${sourceItem.title} (Modular 15-min Version)`,
          category: sourceItem.category,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      await fetchItems();
    } catch (err) {
      console.error('Failed to recommit item:', err);
    }
  };

  const deleteAccount = () => {
    setItems([]);
    alert('Account data removed permanently.');
  };

  return (
    <GravequitContext.Provider value={{
      items,
      isLoading,
      apiError,
      patternStats,
      advisorMetrics: INITIAL_ADVISOR_METRICS,
      internalMetrics: INITIAL_INTERNAL_METRICS,
      settings,
      setSettings,
      isAddItemModalOpen,
      setIsAddItemModalOpen,
      isQuitModalOpen,
      activeQuitItem,
      openQuitModal,
      closeQuitModal,
      addItem,
      submitQuitEvent,
      recommitItem,
      deleteAccount,
      refreshItems: fetchItems,
    }}>
      {children}
    </GravequitContext.Provider>
  );
};

export const useGravequit = () => {
  const ctx = useContext(GravequitContext);
  if (!ctx) throw new Error('useGravequit must be used within a GravequitProvider');
  return ctx;
};
