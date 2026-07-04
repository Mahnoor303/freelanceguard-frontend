import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Search, MessageSquare, FileText, UserCheck } from 'lucide-react';

const demoScans = [
  {
    id: 1,
    type: 'jobPost',
    title: 'Safe Job Post',
    description: 'A legitimate job posting from a reputable company.',
    riskLevel: 'safe',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    inputText: 'We are a reputable company looking for a graphic designer. The salary is competitive. Please send your portfolio and we will schedule an interview.',
  },
  {
    id: 2,
    type: 'jobPost',
    title: 'Caution Job Post',
    description: 'A job posting with some suspicious elements.',
    riskLevel: 'caution',
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    inputText: 'Hiring immediately for a remote position. Good pay. Some experience required. Contact us with your details.',
  },
  {
    id: 3,
    type: 'jobPost',
    title: 'Danger Job Post',
    description: 'A scam job posting with multiple red flags.',
    riskLevel: 'danger',
    icon: Shield,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
    inputText: 'URGENT HIRING! Earn $5000 per week! No experience needed! Send your ID, passport, and bank details immediately to secure your spot.',
  },
  {
    id: 4,
    type: 'message',
    title: 'Safe Message',
    description: 'A normal client message.',
    riskLevel: 'safe',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    inputText: 'Hello, I saw your LinkedIn profile and portfolio. I\'d like to discuss a potential project. Let me know when you\'re free.',
  },
  {
    id: 5,
    type: 'message',
    title: 'Caution Message',
    description: 'A message with some pressure tactics.',
    riskLevel: 'caution',
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    inputText: 'Hey, I have a quick task for you. Can you deliver by tonight? I\'ll pay you after the work is done.',
  },
  {
    id: 6,
    type: 'message',
    title: 'Danger Message',
    description: 'A clear scam message with multiple red flags.',
    riskLevel: 'danger',
    icon: Shield,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
    inputText: 'Dear sir, URGENT! I have a huge project for you. I can pay you double but you must contact me on WhatsApp immediately. Do not use the platform.',
  },
  {
    id: 7,
    type: 'contract',
    title: 'Safe Contract',
    description: 'A standard freelance contract.',
    riskLevel: 'safe',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    inputText: 'Standard freelance agreement. Payment within 15 days. Clear IP ownership terms. No non-compete clause.',
  },
  {
    id: 8,
    type: 'contract',
    title: 'Caution Contract',
    description: 'A contract with some risky clauses.',
    riskLevel: 'caution',
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    inputText: 'Payment net 60 days after completion. Some restrictions on future work.',
  },
  {
    id: 9,
    type: 'contract',
    title: 'Danger Contract',
    description: 'A highly risky contract with dangerous clauses.',
    riskLevel: 'danger',
    icon: Shield,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
    inputText: 'This contract includes a worldwide non-compete clause for 10 years. Payment will be made 120 days after project completion. All intellectual property rights are transferred immediately.',
  },
  {
    id: 10,
    type: 'client',
    title: 'Safe Client',
    description: 'A well-known, trustworthy client.',
    riskLevel: 'safe',
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    inputText: 'Google',
  },
  {
    id: 11,
    type: 'client',
    title: 'Caution Client',
    description: 'A new client with limited online presence.',
    riskLevel: 'caution',
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    inputText: 'A new startup with a LinkedIn profile but no website yet.',
  },
  {
    id: 12,
    type: 'client',
    title: 'Danger Client',
    description: 'An unknown client with no verifiable information.',
    riskLevel: 'danger',
    icon: Shield,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
    inputText: 'Unknown company, no online presence, no LinkedIn, just a generic email address.',
  },
];

const typeIcons = {
  jobPost: Search,
  message: MessageSquare,
  contract: FileText,
  client: UserCheck,
};

const typeLabels = {
  jobPost: 'Job Post',
  message: 'Message',
  contract: 'Contract',
  client: 'Client',
};

const typeRoutes = {
  jobPost: '/job-analyzer',
  message: '/message-scanner',
  contract: '/contract-checker',
  client: '/client-lookup',
};

export default function SampleScans() {
  const navigate = useNavigate();

  const handleDemoScan = (scan) => {
    // Store the demo text temporarily so the scanner can pick it up
    sessionStorage.setItem('demoScanText', scan.inputText);
    sessionStorage.setItem('demoScanType', scan.type);
    navigate(typeRoutes[scan.type]);
  };

  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? demoScans
    : demoScans.filter((s) => s.riskLevel === filter);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Sample Scan Library
        </h1>
        <p className="text-text-secondary">
          Click on any example below to see how FreelanceGuard detects scams.
          Each demo will open the real scanner with pre‑filled text.
        </p>
      </div>

      {/* Filter buttons */}
      <div className="flex justify-center gap-3 mb-8">
        {['all', 'safe', 'caution', 'danger'].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
              filter === level
                ? level === 'all'
                  ? 'bg-primary text-black'
                  : level === 'safe'
                  ? 'bg-success/20 text-success border border-success/30'
                  : level === 'caution'
                  ? 'bg-warning/20 text-warning border border-warning/30'
                  : 'bg-danger/20 text-danger border border-danger/30'
                : 'bg-bg-secondary text-text-secondary border border-border'
            }`}
          >
            {level === 'all' ? 'All' : level}
          </button>
        ))}
      </div>

      {/* Demo cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((scan) => {
          const TypeIcon = typeIcons[scan.type];
          return (
            <button
              key={scan.id}
              onClick={() => handleDemoScan(scan)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${scan.bgColor} ${scan.borderColor} group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center ${scan.color}`}>
                  <TypeIcon size={20} />
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${scan.bgColor} ${scan.color}`}
                >
                  {scan.riskLevel}
                </span>
              </div>
              <h3 className="font-semibold text-text-primary mb-1">{scan.title}</h3>
              <p className="text-sm text-text-secondary mb-3">{scan.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">{typeLabels[scan.type]}</span>
                <span className="text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it <ArrowRight size={14} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}