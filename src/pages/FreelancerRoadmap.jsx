import { useState } from 'react';
import {
  CheckCircle, Circle, User, Briefcase, Shield,
  FileText, MessageSquare, Star, ArrowRight, ChevronRight
} from 'lucide-react';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Get Started',
    icon: User,
    color: 'from-blue-500/20 to-blue-600/10',
    steps: [
      'Create your freelancer profile',
      'Write a professional bio',
      'Set a competitive hourly rate',
      'Upload a professional profile picture',
      'List your top 3 services clearly',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Build Portfolio',
    icon: Briefcase,
    color: 'from-purple-500/20 to-purple-600/10',
    steps: [
      'Add at least 3 sample projects',
      'Write short case studies',
      'Ask previous clients for testimonials',
      'Create a simple personal website',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Find Safe Work',
    icon: Shield,
    color: 'from-green-500/20 to-green-600/10',
    steps: [
      'Learn to spot fake job posts',
      'Use the Job Analyzer before applying',
      'Never pay to apply for a job',
      'Keep communication on the platform',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Communicate',
    icon: MessageSquare,
    color: 'from-orange-500/20 to-orange-600/10',
    steps: [
      'Use the Message Scanner',
      'Write clear proposals',
      'Set expectations early',
      'Keep communication on the platform',
    ],
  },
  {
    phase: 'Phase 5',
    title: 'Sign Contracts',
    icon: FileText,
    color: 'from-red-500/20 to-red-600/10',
    steps: [
      'Download a contract template',
      'Use the Contract Checker',
      'Ensure payment terms are clear',
      'Agree on revision limits',
    ],
  },
  {
    phase: 'Phase 6',
    title: 'Deliver & Grow',
    icon: Star,
    color: 'from-yellow-500/20 to-yellow-600/10',
    steps: [
      'Deliver high‑quality work on time',
      'Ask for a testimonial',
      'Gradually increase your rates',
      'Apply to bigger projects',
    ],
  },
];

export default function FreelancerRoadmap() {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('roadmapCompleted');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleStep = (phaseIdx, stepIdx) => {
    const key = `${phaseIdx}-${stepIdx}`;
    const updated = { ...completed, [key]: !completed[key] };
    setCompleted(updated);
    localStorage.setItem('roadmapCompleted', JSON.stringify(updated));
  };

  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const completedSteps = Object.values(completed).filter(Boolean).length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header & Progress */}
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Freelancer Roadmap
        </h1>
        <p className="text-text-secondary mb-6">
          Follow these steps to launch and grow your freelance career safely.
        </p>
        {/* Progress bar */}
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

      {/* Roadmap Timeline */}
      <div className="relative">
        {/* Vertical connecting line (desktop) */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-1/2" />

        <div className="space-y-12 lg:space-y-0">
          {phases.map((phase, phaseIdx) => {
            const phaseCompleted = phase.steps.every((_, stepIdx) =>
              completed[`${phaseIdx}-${stepIdx}`]
            );
            const isLeft = phaseIdx % 2 === 0;

            return (
              <div
                key={phaseIdx}
                className={`relative lg:flex lg:items-center ${
                  isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } lg:gap-8 mb-12 lg:mb-24`}
              >
                {/* Phase card */}
                <div className={`flex-1 lg:w-1/2 ${isLeft ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div
                    className={`bg-card-bg border rounded-2xl p-6 relative ${
                      phaseCompleted
                        ? 'border-success/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                        : 'border-border'
                    }`}
                  >
                    {/* Phase header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                        <phase.icon className="text-white" size={24} />
                      </div>
                      <div>
                        <span className="text-xs text-text-secondary">{phase.phase}</span>
                        <h3 className="text-xl font-heading font-bold text-text-primary">
                          {phase.title}
                        </h3>
                      </div>
                      {phaseCompleted && (
                        <CheckCircle className="text-success ml-auto" size={20} />
                      )}
                    </div>

                    {/* Steps */}
                    <ul className="space-y-2">
                      {phase.steps.map((step, stepIdx) => {
                        const key = `${phaseIdx}-${stepIdx}`;
                        const done = completed[key];
                        return (
                          <li
                            key={stepIdx}
                            onClick={() => toggleStep(phaseIdx, stepIdx)}
                            className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                              done
                                ? 'bg-success/5'
                                : 'hover:bg-bg-secondary'
                            }`}
                          >
                            {done ? (
                              <CheckCircle className="text-success shrink-0 mt-0.5" size={18} />
                            ) : (
                              <Circle className="text-text-secondary shrink-0 mt-0.5" size={18} />
                            )}
                            <span
                              className={`text-sm leading-relaxed ${
                                done ? 'text-success line-through' : 'text-text-primary'
                              }`}
                            >
                              {step}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Timeline dot (desktop only) */}
                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-black z-10 items-center justify-center">
                  <span className="text-xs font-bold text-black">{phaseIdx + 1}</span>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden lg:block flex-1 lg:w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}