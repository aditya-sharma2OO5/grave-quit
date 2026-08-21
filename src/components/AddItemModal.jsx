import React, { useState } from 'react';
import { X, Calendar, BookOpen, Layers } from 'lucide-react';
import { useGraveyard } from '../context/GraveyardContext';
import { Button } from './Button';

export const AddItemModal = () => {
  const { isAddItemModalOpen, setIsAddItemModalOpen, addItem } = useGraveyard();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Course');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  if (!isAddItemModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addItem({
      title,
      category,
      started_at: startDate,
      note
    });

    setTitle('');
    setNote('');
  };

  const categories = ['Course', 'Skill', 'Habit', 'Side Project'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[16px] max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
          <div>
            <h2 className="text-xl font-bold font-headline text-[#F5F5F0]">Log What You're Starting</h2>
            <p className="text-xs text-[#8A8A8A] mt-0.5">Observe your initial commitment with clarity.</p>
          </div>
          <button 
            onClick={() => setIsAddItemModalOpen(false)}
            className="p-1 rounded-full text-[#8A8A8A] hover:text-[#F5F5F0] hover:bg-[#222222]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5 uppercase tracking-wider">
              Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Advanced Linear Algebra or 10k Marathon Prep"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#A8C5B0] text-[#F5F5F0] placeholder-[#8A8A8A]/50 text-sm rounded-lg px-3.5 py-2.5 outline-none transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    category === cat
                      ? 'bg-[#354F3E] text-[#B0CEB8] border-[#A8C5B0]'
                      : 'bg-[#1A1A1A] text-[#8A8A8A] border-[#2A2A2A] hover:border-[#454843]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5 uppercase tracking-wider">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#A8C5B0] text-[#F5F5F0] text-sm rounded-lg px-3.5 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5 uppercase tracking-wider">
              Starting Reflection / Goal (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="What motivated you to start this right now?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#A8C5B0] text-[#F5F5F0] placeholder-[#8A8A8A]/50 text-sm rounded-lg px-3.5 py-2.5 outline-none transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2A2A2A]">
            <Button variant="secondary" onClick={() => setIsAddItemModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add to My Items
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
