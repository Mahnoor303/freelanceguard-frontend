import { useState, useEffect } from 'react';
import { api } from '../api';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';

export default function JobMatcher() {
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load skills from Rate Calculator (saved in sessionStorage)
  useEffect(() => {
    const savedSkills = sessionStorage.getItem('selectedSkills');
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  const searchJobs = async (skill) => {
    setLoading(true);
    try {
      const data = await api(`/jobs/search?skill=${encodeURIComponent(skill)}&country=pk`);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Job Matcher</h1>
      <p className="text-text-secondary">Based on your skills, here are some live freelance opportunities.</p>

      {skills.length === 0 ? (
        <p className="text-text-secondary">Please use the Rate Calculator first to select your skills.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => searchJobs(skill)}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition"
              >
                {skill}
              </button>
            ))}
          </div>

          {loading && <p className="text-text-secondary">Loading jobs...</p>}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-card-bg border border-border rounded-xl p-4 space-y-2 hover:border-primary/30 transition">
                <h3 className="font-semibold text-text-primary">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Briefcase size={14} /> {job.company?.display_name || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={14} /> {job.location?.display_name || 'Remote'}
                </div>
                {job.salary_min && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <DollarSign size={14} /> ${job.salary_min} - ${job.salary_max}
                  </div>
                )}
                <a
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 mt-2 hover:underline"
                >
                  Apply <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}