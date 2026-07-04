import { useState } from 'react';
import { Search, MessageSquare, FileText, UserCheck, Shield } from 'lucide-react';

const tutorials = [
  {
    id: 1,
    title: 'How to Spot a Fake Job Post',
    description: 'Learn the red flags in fake freelance job listings.',
    videoId: 'dQw4w9WgXcQ', // Replace with real video IDs
    category: 'jobPost',
  },
  {
    id: 2,
    title: 'Detecting Scam Messages',
    description: 'See how the message scanner catches manipulation tactics.',
    videoId: 'dQw4w9WgXcQ',
    category: 'message',
  },
  {
    id: 3,
    title: 'Analyzing Freelance Contracts',
    description: 'Understand dangerous clauses before you sign.',
    videoId: 'dQw4w9WgXcQ',
    category: 'contract',
  },
  {
    id: 4,
    title: 'Checking Client Trustworthiness',
    description: 'Verify clients using our AI lookup.',
    videoId: 'dQw4w9WgXcQ',
    category: 'client',
  },
  {
    id: 5,
    title: 'Getting Started with FreelanceGuard',
    description: 'A complete walkthrough of the platform.',
    videoId: 'dQw4w9WgXcQ',
    category: 'general',
  },
];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'jobPost', label: 'Job Posts' },
  { key: 'message', label: 'Messages' },
  { key: 'contract', label: 'Contracts' },
  { key: 'client', label: 'Clients' },
  { key: 'general', label: 'General' },
];

const categoryIcons = {
  jobPost: Search,
  message: MessageSquare,
  contract: FileText,
  client: UserCheck,
  general: Shield,
};

export default function VideoTutorials() {
  const [filter, setFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filtered = filter === 'all'
    ? tutorials
    : tutorials.filter((t) => t.category === filter);

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Video Tutorials
        </h1>
        <p className="text-text-secondary">
          Learn how to use FreelanceGuard and protect yourself from freelance scams.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center flex-wrap gap-2 mb-6">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.key] || Shield;
          return (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                filter === cat.key
                  ? 'bg-primary text-black'
                  : 'bg-bg-secondary text-text-secondary border border-border hover:bg-primary/10'
              }`}
            >
              {cat.key !== 'all' && <Icon size={14} />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Selected Video Player */}
      {selectedVideo && (
        <div className="bg-card-bg border border-border rounded-2xl overflow-hidden mb-6">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-1">
              {selectedVideo.title}
            </h2>
            <p className="text-text-secondary">{selectedVideo.description}</p>
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((video) => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className={`text-left p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
              selectedVideo?.id === video.id
                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(97,255,139,0.2)]'
                : 'bg-card-bg border-border hover:border-primary/50'
            }`}
          >
            <div className="w-full h-32 bg-bg-secondary rounded-lg mb-3 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="text-primary" size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{video.title}</h3>
            <p className="text-sm text-text-secondary">{video.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}