// Events copied verbatim from the original RxUpcomingEvents component
const RX_LIVE_EVENTS = [
  {
    id: 1,
    type: 'webinar',
    category: 'Rx Live • AI & Pharma',
    topic: 'AI & Machine Learning in Modern Clinical Pharmacy & Drug Design',
    date: 'Sat, Dec 14, 2024',
    time: '06:00 PM – 07:30 PM IST',
    image: 'images/blog/blog-1/4.png',
    imageAlt: 'AI and clinical pharmacy webinar',
    registerUrl: 'rx-live.html#register',
    highlights: [
      'Real-world AI algorithms in molecular target mapping & automated pharmacokinetics.',
      'Clinical case study: Accelerating trial matching and predicting drug-drug interactions.',
      'Live Q&A session with senior pharmaceutical AI consultants & research directors.',
    ],
    benefits: [
      'Verified Certificate of Completion accredited by Rx Analytica One.',
      'Downloadable AI in Pharmacy Starter Toolkit & complete session presentation deck.',
      'Exclusive fast-track access to industry mentorship & pharma network channels.',
    ],
  },
  {
    id: 2,
    type: 'webinar',
    category: 'Rx Live | Industry Careers',
    topic: 'Pharma Career Launchpad: Skills for a Changing Industry',
    date: 'Wed, Dec 18, 2024',
    time: '07:00 PM – 08:30 PM IST',
    image: 'images/blog/blog-1/1.png',
    imageAlt: 'Expert webinar on pharmaceutical career pathways',
    registerUrl: 'rx-live.html#register',
    highlights: [
      'Explore career paths across pharmaceutical research, manufacturing, quality, and clinical practice.',
      'Learn which digital, AI, and communication skills employers value in new graduates.',
      'Join an expert-led Q&A about building a strong start in the pharmaceutical industry.',
    ],
    benefits: [
      'Get a practical career roadmap with suggested skills and next steps.',
      'Download an industry skills checklist to guide your learning plan.',
      'Receive the webinar notes and links to recommended learning resources.',
    ],
  },
];

const RX_EXAM_EVENTS = [
  {
    id: 3,
    type: 'exam',
    category: 'Rx Exam • Evaluative Analytics',
    topic: 'Evaluation Masterclass: How Mock Analytics Drive 3x Retention',
    date: 'Sat, Dec 28, 2024',
    time: '05:30 PM – 07:00 PM IST',
    image: 'images/blog/blog-1/3.png',
    imageAlt: 'Mock evaluation and test analytics masterclass',
    registerUrl: 'rx-exam.html#register',
    highlights: [
      'Cognitive error-tagging: How identifying silly mistakes boosts scores by 25%.',
      'Time-per-question behavioral pacing tactics to eliminate negative marking penalty.',
      'Live demonstration of Rx Exam’s AI-powered student diagnostic progress dashboard.',
    ],
    benefits: [
      '1 Complimentary Full-Length Mock Evaluation Test with AI diagnostic feedback.',
      'Customized weak-spot remediation plan generated based on your performance.',
      'Access to the Rx Exam peer percentile benchmarking leaderboard.',
    ],
  },
  {
    id: 4,
    type: 'exam',
    category: 'Rx Exam • Mock Simulation',
    topic: 'National Mock Simulation & Diagnostic Performance Benchmarking',
    date: 'Sun, Jan 05, 2025',
    time: '10:30 AM – 12:30 PM IST',
    image: 'images/blog/blog-1/2.png',
    imageAlt: 'National mock simulation and test analytics',
    registerUrl: 'rx-exam.html#register',
    highlights: [
      'Standardized test simulation modeling real exam conditions and negative marking algorithms.',
      'Multi-parameter question-level accuracy reports and cognitive stamina breakdown.',
      'Comprehensive peer percentile mapping across statewide and national applicant pools.',
    ],
    benefits: [
      'Immediate in-depth diagnostic scorecard highlighting top 3 priority improvement areas.',
      'Personalized AI revision question set targeted to your unique error categories.',
      'Exclusive invitation to post-test doubt resolution and score booster workshop.',
    ],
  },
];
export const EVENTS = [...RX_LIVE_EVENTS, ...RX_EXAM_EVENTS];
