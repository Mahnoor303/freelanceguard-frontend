import { useState, useEffect } from 'react';
import { api } from '../api';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';

export default function JobMatcher() {
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load skills saved from the Rate Calculator
  useEffect(() => {
    const savedSkills = localStorage.getItem('selectedSkills');
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  const searchJobs = async (skill) => {
    setLoading(true);
    setError(null);
    try {
const data = await api(`/jobs/search?skill=${encodeURIComponent(skill)}&location=Pakistan`);
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Job Matcher</h1>
        <p className="text-text-secondary">
          Real freelance opportunities from multiple platforms in Pakistan.
        </p>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
          <p>No skills selected yet.</p>
          <p className="mt-2">
            Go to the <a href="/rate-calculator" className="text-primary underline">Rate Calculator</a> first.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => searchJobs(skill)}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition"
              >
                {skill}
              </button>
            ))}
          </div>

          {loading && <p className="text-center text-text-secondary">Loading jobs...</p>}
          {error && <p className="text-center text-danger">{error}</p>}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-card-bg border border-border rounded-xl p-4 space-y-2 hover:border-primary/30 transition-all">
                <h3 className="font-semibold text-text-primary">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Briefcase size={14} /> {job.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={14} /> {job.location}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <DollarSign size={14} /> {job.salary}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{job.source}</span>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm flex items-center gap-1 hover:underline"
                  >
                    Apply <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}