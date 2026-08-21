// Graveyard Mock Data
// IMPORTANT: reason_tag may ONLY ever be one of these 5 exact values:
// 'Too Busy', 'Too Hard', 'Lost Interest', 'No Deadline', 'Other'

export const VALID_REASON_TAGS = [
  'Too Busy',
  'Too Hard',
  'Lost Interest',
  'No Deadline',
  'Other'
];

export const INITIAL_ITEMS = [
  {
    id: 'item-101',
    title: 'Advanced Multivariable Calculus',
    category: 'Course',
    status: 'active',
    started_at: '2026-07-10',
    ended_at: null,
    riskScore: 78,
    riskBadge: 'High Risk',
    riskReason: 'No fixed self-imposed deadline & approaching exam week cluster',
    note: 'Weekly problem sets taking 12+ hours',
    similarPastItems: ['item-104', 'item-106']
  },
  {
    id: 'item-102',
    title: 'Rust Systems Programming Specialization',
    category: 'Skill',
    status: 'active',
    started_at: '2026-08-01',
    ended_at: null,
    riskScore: 32,
    riskBadge: 'Low Risk',
    riskReason: 'Steady weekly cadence matching past completed skills',
    note: 'Building a micro-kernel for fun',
    similarPastItems: ['item-105']
  },
  {
    id: 'item-103',
    title: 'Daily Morning Running (5km)',
    category: 'Habit',
    status: 'active',
    started_at: '2026-08-12',
    ended_at: null,
    riskScore: 64,
    riskBadge: 'Moderate Risk',
    riskReason: 'Historical tendency to drop physical habits after 14 days',
    note: 'Preparing for 10k spring marathon',
    similarPastItems: ['item-107']
  },
  {
    id: 'item-104',
    title: 'Late Night Doom Scrolling & Shorts',
    category: 'Habit',
    status: 'quit',
    started_at: '2026-06-01',
    ended_at: '2026-07-28',
    durationDays: 57,
    reason_tag: 'Too Busy',
    reason_text: 'Interfering with 8am lab schedule and exam focus',
    voice_transcript: 'I realized I was spending two hours every night just scrolling through video feeds when I needed to sleep for early morning labs.',
    riskScore: null,
    similarPastItems: ['item-101', 'item-107']
  },
  {
    id: 'item-105',
    title: 'Full-Stack WebDev Incubator Project',
    category: 'Side Project',
    status: 'quit',
    started_at: '2026-05-15',
    ended_at: '2026-06-20',
    durationDays: 36,
    reason_tag: 'No Deadline',
    reason_text: 'Open-ended scope with no clear submission date',
    voice_transcript: 'Without a concrete hackathon demo date, scope kept expanding indefinitely until momentum died.',
    similarPastItems: ['item-102']
  },
  {
    id: 'item-106',
    title: 'Machine Learning Math Fundamentals',
    category: 'Course',
    status: 'quit',
    started_at: '2026-04-01',
    ended_at: '2026-04-22',
    durationDays: 21,
    reason_tag: 'Too Hard',
    reason_text: 'Prerequisite gaps in linear algebra made lectures impenetrable',
    voice_transcript: 'The matrix calculus concepts surpassed my current prep level, so I decided to pause and revisit linear algebra first.',
    similarPastItems: ['item-101']
  },
  {
    id: 'item-107',
    title: 'German Language Basics (B1 prep)',
    category: 'Skill',
    status: 'quit',
    started_at: '2026-03-01',
    ended_at: '2026-03-19',
    durationDays: 18,
    reason_tag: 'Lost Interest',
    reason_text: 'Shifted priority toward AI research paper readings',
    voice_transcript: 'Found my passion leaning heavily toward neural networks rather than language learning this semester.',
    similarPastItems: ['item-103']
  },
  {
    id: 'item-108',
    title: 'Classical Guitar Sight Reading',
    category: 'Skill',
    status: 'quit',
    started_at: '2026-02-10',
    ended_at: '2026-02-28',
    durationDays: 18,
    reason_tag: 'Other',
    reason_text: 'Acoustic guitar neck warped in winter dorm heating',
    voice_transcript: 'My physical guitar needed setup repairs and dorm space was too constrained to practice properly.',
    similarPastItems: ['item-107']
  }
];

export const INITIAL_PATTERN_STATS = {
  averageDaysToQuit: 30,
  totalQuitEvents: 5,
  momentumScore: 74,
  aiSummaryText: "Across your past observations, your most frequent closure driver is 'No Deadline' combined with mid-semester academic pressure. When projects lack a fixed end date, engagement naturally tapers around Day 21–30. Noticeably, your recovery periods between new commitments are expanding steadily by 40%, reflecting more intentional pacing.",
  tagBreakdown: [
    { tag: 'No Deadline', count: 2, percentage: 40 },
    { tag: 'Too Busy', count: 1, percentage: 20 },
    { tag: 'Too Hard', count: 1, percentage: 20 },
    { tag: 'Lost Interest', count: 1, percentage: 20 },
    { tag: 'Other', count: 0, percentage: 0 }
  ]
};

export const INITIAL_ADVISOR_METRICS = {
  activeStudents: 1420,
  optInRate: '94%',
  totalClosuresRecorded: 3840,
  avgStudentMomentum: 68,
  closureDrivers: [
    { tag: 'Too Busy', percentage: 42, count: 1612 },
    { tag: 'No Deadline', percentage: 28, count: 1075 },
    { tag: 'Too Hard', percentage: 16, count: 614 },
    { tag: 'Lost Interest', percentage: 9, count: 345 },
    { tag: 'Other', percentage: 5, count: 194 }
  ],
  monthlyTrend: [
    { month: 'Sep', activeCount: 1200, quitCount: 180 },
    { month: 'Oct', activeCount: 1350, quitCount: 310 },
    { month: 'Nov (Midterms)', activeCount: 1100, quitCount: 520 },
    { month: 'Dec', activeCount: 1400, quitCount: 220 },
    { month: 'Jan', activeCount: 1480, quitCount: 190 },
    { month: 'Feb (Exams)', activeCount: 1420, quitCount: 480 }
  ]
};

export const INITIAL_INTERNAL_METRICS = {
  totalUsers: 8450,
  totalItemsLogged: 24190,
  totalQuitEvents: 14820,
  aiAccuracyRate: 94.2,
  thumbsUpCount: 1284,
  thumbsDownCount: 79,
  dauTrend: [
    { day: 'Mon', dau: 3420 },
    { day: 'Tue', dau: 3890 },
    { day: 'Wed', dau: 4120 },
    { day: 'Thu', dau: 4500 },
    { day: 'Fri', dau: 4890 },
    { day: 'Sat', dau: 4200 },
    { day: 'Sun', dau: 3950 }
  ],
  recentActivity: [
    { id: 1, action: 'Quit Event Captured', tag: 'Too Busy', time: '2 mins ago', details: 'Item: CS224N Stanford Course (Day 24)' },
    { id: 2, action: 'RAG Synthesis Generated', tag: 'No Deadline', time: '7 mins ago', details: 'Fact-checked ground statement verified in code' },
    { id: 3, action: 'Anonymized Advisor Digest', tag: 'Cohort Trend', time: '14 mins ago', details: 'MIT Campus Wellness Office (Aggregate report)' },
    { id: 4, action: 'Re-Commit Flow Triggered', tag: 'Easier Version', time: '21 mins ago', details: 'User restarted 15-min modular version of Rust course' }
  ]
};
