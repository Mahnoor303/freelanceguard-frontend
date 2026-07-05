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
const data = await api(`/jobs/search?skill=${encodeURIComponent(skill)}`);
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Job Matcher
        </h1>
        <p className="text-text-secondary">
          Based on your skills, here are some live freelance opportunities from Adzuna.
        </p>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
          <p>No skills selected yet.</p>
          <p className="mt-2">
            Go to the <a href="/rate-calculator" className="text-primary underline">Rate Calculator</a> to choose your skills first.
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
              <div
                key={idx}
                className="bg-card-bg border border-border rounded-xl p-4 space-y-2 hover:border-primary/30 transition-all"
              >
                <h3 className="font-semibold text-text-primary">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Briefcase size={14} /> {job.company?.display_name || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={14} /> {job.location?.display_name || 'Remote'}
                </div>
                {job.salary_min && (
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <DollarSign size={14} /> ${job.salary_min} - ${job.salary_max}
                  </div>
                )}
                <a
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 mt-2 hover:underline"
                >
                  Apply Now <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}