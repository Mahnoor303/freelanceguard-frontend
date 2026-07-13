import { useState, useEffect } from 'react';
import {
  CheckCircle, Circle, User, Briefcase, Shield,
  FileText, MessageSquare, Star, TrendingUp
} from 'lucide-react';

const getRoadmapData = (skills, targetRate) => {
  const rate = targetRate || 0;
  const skillList = skills?.length ? skills.join(', ') : 'your skills';

  if (rate < 15) {
    return {
      level: 'Beginner',
      description: `You're just starting out with ${skillList}. Let's build a strong foundation.`,
      phases: [
        {
          icon: User, title: '1. Build Your Profile', color: 'from-blue-500/20 to-blue-600/10',
          steps: [
            'Complete your freelancer profile with a professional photo',
            'Write a clear bio highlighting ' + skillList,
            'Set a starter rate (no less than $10/hr)',
          ]
        },
        {
          icon: Briefcase, title: '2. Create a Portfolio', color: 'from-purple-500/20 to-purple-600/10',
          steps: [
            'Build 3 sample projects using ' + skillList,
            'Write short case studies for each project',
            'Get your first testimonial (even from a mock client)',
          ]
        },
        {
          icon: Shield, title: '3. Learn to Spot Scams', color: 'from-green-500/20 to-green-600/10',
          steps: [
            'Use Job Analyzer on every job post you apply to',
            'Never pay to apply or accept work outside the platform',
            'Keep all communication on the freelancing platform',
          ]
        },
        {
          icon: MessageSquare, title: '4. Win Your First Jobs', color: 'from-orange-500/20 to-orange-600/10',
          steps: [
            'Write personalized proposals for each job',
            'Use Message Scanner to review client messages',
            'Start with smaller projects to build reviews',
          ]
        },
      ]
    };
  } else if (rate <= 40) {
    return {
      level: 'Intermediate',
      description: `With ${skillList} at $${rate}/hr, you're ready to specialize and grow.`,
      phases: [
        {
          icon: User, title: '1. Specialize Your Niche', color: 'from-blue-500/20 to-blue-600/10',
          steps: [
            'Choose 1‑2 sub‑skills in ' + skillList + ' to focus on',
            'Update your profile and portfolio to reflect that specialty',
          ]
        },
        {
          icon: Briefcase, title: '2. Optimize Your Portfolio', color: 'from-purple-500/20 to-purple-600/10',
          steps: [
            'Add a live project or case study with measurable results',
            'Ask previous clients for detailed reviews',
            'Use Portfolio Analyzer (coming soon) to improve your presentation',
          ]
        },
        {
          icon: TrendingUp, title: '3. Increase Your Rate', color: 'from-yellow-500/20 to-yellow-600/10',
          steps: [
            'Gradually raise your rate by $5‑$10 for new clients',
            'Pitch higher‑budget projects on Upwork / Freelancer',
            'Learn to negotiate confidently',
          ]
        },
        {
          icon: FileText, title: '4. Use Contracts & Scanners', color: 'from-red-500/20 to-red-600/10',
          steps: [
            'Always use a contract (download template)',
            'Run Contract Checker before signing',
            'Use Job Analyzer for every new opportunity',
          ]
        },
      ]
    };
  } else {
    return {
      level: 'Advanced',
      description: `You're a pro at ${skillList} with a rate of $${rate}/hr. Time to scale!`,
      phases: [
        {
          icon: Star, title: '1. Build Your Brand', color: 'from-yellow-500/20 to-yellow-600/10',
          steps: [
            'Create a personal website showcasing your best work',
            'Start sharing insights on LinkedIn / Twitter',
            'Speak at online events or webinars',
          ]
        },
        {
          icon: TrendingUp, title: '2. Direct Clients & Retainers', color: 'from-green-500/20 to-green-600/10',
          steps: [
            'Reach out to agencies and startups directly',
            'Offer retainer packages for ongoing work',
            'Use Client Lookup to vet potential clients',
          ]
        },
        {
          icon: FileText, title: '3. Advanced Contracts', color: 'from-red-500/20 to-red-600/10',
          steps: [
            'Have a lawyer review your standard contract',
            'Use Contract Checker for any custom terms',
            'Set clear IP and payment milestones',
          ]
        },
        {
          icon: Briefcase, title: '4. Scale Your Business', color: 'from-purple-500/20 to-purple-600/10',
          steps: [
            'Hire a junior freelancer to help with workload',
            'Create a course or digital product related to ' + skillList,
            'Partner with other freelancers on larger projects',
          ]
        },
      ]
    };
  }
};

export default function FreelancerRoadmap() {
  const [skills, setSkills] = useState([]);
  const [targetRate, setTargetRate] = useState(0);
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('roadmapCompleted');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const savedSkills = localStorage.getItem('selectedSkills');
    const savedRate = localStorage.getItem('calculatedRate');
    if (savedSkills) setSkills(JSON.parse(savedSkills));
    if (savedRate) setTargetRate(parseFloat(savedRate));
  }, []);

  const roadmap = getRoadmapData(skills, targetRate);

  const toggleStep = (phaseIdx, stepIdx) => {
    const key = `${phaseIdx}-${stepIdx}`;
    const updated = { ...completed, [key]: !completed[key] };
    setCompleted(updated);
    localStorage.setItem('roadmapCompleted', JSON.stringify(updated));
  };

  const totalSteps = roadmap.phases.reduce((sum, p) => sum + p.steps.length, 0);
  const completedSteps = Object.values(completed).filter(Boolean).length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Your Freelance Roadmap
        </h1>
        <p className="text-text-secondary mb-2">
          {roadmap.description}
        </p>
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          {roadmap.level} Level
        </span>
        {/* Progress */}
        <div className="max-w-md mx-auto">
          <div className="w-full bg-bg-secondary rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-text-secondary">
            {completedSteps} of {totalSteps} steps completed ({progress}%)
          </p>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {roadmap.phases.map((phase, phaseIdx) => (
          <div
            key={phaseIdx}
            className="bg-card-bg border border-border rounded-2xl p-6 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                <phase.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary">{phase.title}</h3>
            </div>
            <ul className="space-y-3">
              {phase.steps.map((step, stepIdx) => {
                const key = `${phaseIdx}-${stepIdx}`;
                const done = completed[key];
                return (
                  <li
                    key={stepIdx}
                    onClick={() => toggleStep(phaseIdx, stepIdx)}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      done ? 'bg-success/5' : 'hover:bg-bg-secondary'
                    }`}
                  >
                    {done ? (
                      <CheckCircle className="text-success shrink-0 mt-0.5" size={20} />
                    ) : (
                      <Circle className="text-text-secondary shrink-0 mt-0.5" size={20} />
                    )}
                    <span className={`text-sm leading-relaxed ${
                      done ? 'text-success line-through' : 'text-text-primary'
                    }`}>
                      {step}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center p-8 bg-card-bg border border-border rounded-2xl">
          <p className="text-text-secondary">
            You haven't set your skills and rate yet. Go to the{' '}
            <a href="/rate-calculator" className="text-primary underline">Rate Calculator</a> first to see your personalized roadmap.
          </p>
        </div>
      )}
    </div>
  );
}