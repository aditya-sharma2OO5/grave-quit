import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  INITIAL_ITEMS, 
  INITIAL_PATTERN_STATS, 
  INITIAL_ADVISOR_METRICS, 
  INITIAL_INTERNAL_METRICS,
  VALID_REASON_TAGS 
} from '../data/mockData';

const GravequitContext = createContext(null);

export const GravequitProvider = ({ children }) => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [activeQuitItem, setActiveQuitItem] = useState(null);
  
  const [settings, setSettings] = useState({
    userEmail: 'student.reflect@university.edu',
    weeklyDigest: true,
    reminderNudges: false,
    anonymizedAdvisorOptIn: true
  });

  // Calculate dynamic stats based on current items
  const patternStats = useMemo(() => {
    const quitItems = items.filter(i => i.status === 'quit');
    const totalQuitEvents = quitItems.length;

    if (totalQuitEvents === 0) {
      return {
        averageDaysToQuit: 0,
        totalQuitEvents: 0,
        momentumScore: 85,
        aiSummaryText: "No past quit items recorded yet. As you observe your journeys, gentle pattern insights will form here.",
        tagBreakdown: VALID_REASON_TAGS.map(tag => ({ tag, count: 0, percentage: 0 }))
      };
    }

    const totalDays = quitItems.reduce((acc, curr) => acc + (curr.durationDays || 14), 0);
    const averageDaysToQuit = Math.round(totalDays / totalQuitEvents);

    // Tag breakdown count calculation strictly for the 5 allowed tags
    const counts = {};
    VALID_REASON_TAGS.forEach(tag => { counts[tag] = 0; });
    quitItems.forEach(i => {
      if (VALID_REASON_TAGS.includes(i.reason_tag)) {
        counts[i.reason_tag] += 1;
      } else {
        counts['Other'] += 1;
      }
    });

    const tagBreakdown = VALID_REASON_TAGS.map(tag => ({
      tag,
      count: counts[tag],
      percentage: Math.round((counts[tag] / totalQuitEvents) * 100)
    }));

    const topTagObj = [...tagBreakdown].sort((a, b) => b.count - a.count)[0];
    const topTag = topTagObj ? topTagObj.tag : 'No Deadline';

    const aiSummaryText = `Across your ${totalQuitEvents} past observations, your primary closure driver is '${topTag}'. Average commitment duration is ${averageDaysToQuit} days before pausing. Momentum score remains strong at 74/100, reflecting extended recovery windows between attempts.`;

    return {
      averageDaysToQuit,
      totalQuitEvents,
      momentumScore: Math.min(95, 65 + totalQuitEvents * 2),
      aiSummaryText,
      tagBreakdown
    };
  }, [items]);

  const addItem = (itemData) => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: itemData.title,
      category: itemData.category || 'Skill',
      status: 'active',
      started_at: itemData.started_at || new Date().toISOString().split('T')[0],
      ended_at: null,
      riskScore: Math.floor(Math.random() * 40) + 30,
      riskBadge: 'Moderate Risk',
      riskReason: itemData.category === 'Course' ? 'No self-imposed exam milestone' : 'Historical drop-off window at Day 21',
      note: itemData.note || '',
      similarPastItems: ['item-104', 'item-106']
    };

    setItems(prev => [newItem, ...prev]);
    setIsAddItemModalOpen(false);
  };

  const openQuitModal = (item) => {
    setActiveQuitItem(item);
    setIsQuitModalOpen(true);
  };

  const closeQuitModal = () => {
    setActiveQuitItem(null);
    setIsQuitModalOpen(false);
  };

  const submitQuitEvent = ({ itemId, reason_tag, reason_text, voice_transcript }) => {
    // Ensure tag is strictly one of the 5 allowed tags
    const validTag = VALID_REASON_TAGS.includes(reason_tag) ? reason_tag : 'Other';

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const start = new Date(item.started_at);
        const end = new Date();
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 14;

        return {
          ...item,
          status: 'quit',
          ended_at: end.toISOString().split('T')[0],
          durationDays: diffDays,
          reason_tag: validTag,
          reason_text: reason_text || 'No additional note provided',
          voice_transcript: voice_transcript || null,
          riskScore: null
        };
      }
      return item;
    }));

    closeQuitModal();
  };

  const recommitItem = (itemId) => {
    const sourceItem = items.find(i => i.id === itemId);
    if (!sourceItem) return;

    const newItem = {
      id: `item-re-${Date.now()}`,
      title: `${sourceItem.title} (Modular 15-min Version)`,
      category: sourceItem.category,
      status: 'active',
      started_at: new Date().toISOString().split('T')[0],
      ended_at: null,
      riskScore: 24,
      riskBadge: 'Low Risk',
      riskReason: 'Reduced friction & micro-milestone structure',
      note: 'Re-committed with reduced scope',
      similarPastItems: [sourceItem.id]
    };

    setItems(prev => [newItem, ...prev]);
  };

  const deleteAccount = () => {
    setItems([]);
    alert("Account data removed permanently.");
  };

  return (
    <GravequitContext.Provider value={{
      items,
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
      deleteAccount
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
