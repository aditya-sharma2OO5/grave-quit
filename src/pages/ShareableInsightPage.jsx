import React, { useState } from 'react';
import { Share2, Download, Copy, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ShareCardPreview } from '../components/ShareCardPreview';
import { useGravequit } from '../context/GravequitContext';
import { VALID_REASON_TAGS } from '../data/mockData';

export const ShareableInsightPage = () => {
  const { patternStats } = useGravequit();
  const [selectedTag, setSelectedTag] = useState('No Deadline');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    alert("Shareable pattern card image downloaded to your local device!");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-4 border-b border-[#2A2A2A] text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs text-[#A8C5B0]">
            <Sparkles className="w-3.5 h-3.5 text-[#A8C5B0]" />
            <span>Social & Portfolio Export</span>
          </div>
          <h1 className="text-3xl font-extrabold font-headline text-[#F5F5F0]">Shareable Insight Card</h1>
          <p className="text-sm text-[#8A8A8A] max-w-xl mx-auto">
            Generate an auto-styled image card of your closure reflection for Product Hunt, X/Twitter, or personal archives.
          </p>
        </div>

        {/* Tag Selector Controls */}
        <Card header="Select Insight Topic to Share">
          <div className="space-y-4">
            <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block">
              Choose Target Tag Focus
            </span>
            <div className="flex flex-wrap gap-2">
              {VALID_REASON_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedTag === tag
                      ? 'bg-[#354F3E] text-[#B0CEB8] border-[#A8C5B0]'
                      : 'bg-[#131313] text-[#8A8A8A] border-[#2A2A2A] hover:border-[#454843]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Large Preview Card */}
        <div className="py-4">
          <ShareCardPreview
            tag={selectedTag}
            quote={`My primary closure driver is '${selectedTag}'. When commitments lack a clear self-imposed deadline, momentum naturally pauses around Day ${patternStats.averageDaysToQuit}.`}
            stats={`${patternStats.averageDaysToQuit} Days Avg Duration · ${patternStats.momentumScore} Momentum Score`}
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="primary" size="lg" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            <span>Download Image Card</span>
          </Button>

          <Button variant="secondary" size="lg" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-2 text-[#A8C5B0]" /> : <Copy className="w-4 h-4 mr-2" />}
            <span>{copied ? 'Link Copied!' : 'Copy Shareable Link'}</span>
          </Button>
        </div>

        {/* Privacy Guarantee Note */}
        <div className="p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl text-center flex items-center justify-center gap-2 text-xs text-[#8A8A8A]">
          <ShieldCheck className="w-4 h-4 text-[#A8C5B0] shrink-0" />
          <span>Reassurance Note: Only the explicitly chosen insight leaves the app. All raw entries remain private on your device.</span>
        </div>

      </div>
    </div>
  );
};
