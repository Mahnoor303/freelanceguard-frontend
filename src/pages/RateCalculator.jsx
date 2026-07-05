import { useState } from 'react';
import { Calculator, Clock, DollarSign, TrendingUp, Briefcase, Lightbulb } from 'lucide-react';

const skillOptions = [
  'Graphic Design', 'Web Development', 'Content Writing',
  'Social Media Management', 'Video Editing', 'UI/UX Design',
  'Data Entry', 'Translation', 'Mobile App Development',
  'SEO', 'Digital Marketing', 'Illustration',
];

const skillSuggestions = {
  'Graphic Design': 'Learn motion graphics to increase your rate by 30%.',
  'Web Development': 'Add backend skills (Node.js, Python) to charge premium rates.',
  'Content Writing': 'Specialize in technical writing or copywriting for higher pay.',
  'Social Media Management': 'Offer paid ads management to boost income.',
  'Video Editing': 'Learn color grading and motion graphics for premium projects.',
  'UI/UX Design': 'Master Figma prototyping and user research to stand out.',
  'Data Entry': 'Transition to virtual assistant or data analysis for better pay.',
  'Translation': 'Get certified in legal or medical translation for higher rates.',
  'Mobile App Development': 'Learn cross‑platform frameworks like Flutter or React Native.',
  'SEO': 'Add content marketing and analytics to your service list.',
  'Digital Marketing': 'Specialize in email marketing or conversion optimization.',
  'Illustration': 'Offer custom branding packages to increase your value.',
};

export default function RateCalculator() {
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState(1);
  const [desiredIncome, setDesiredIncome] = useState(1000);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [result, setResult] = useState(null);

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const calculate = () => {
    // SAVE SKILLS TO localStorage (persists even after navigation)
    localStorage.setItem('selectedSkills', JSON.stringify(skills));

    // Calculate rates
    const workingDays = 22;
    const totalHours = hoursPerDay * workingDays;
    const hourlyRate = desiredIncome / totalHours;
    const dailyRate = hourlyRate * hoursPerDay;
    const expMultiplier = 1 + (experience - 1) * 0.1;
    const adjustedHourly = hourlyRate * expMultiplier;
    const adjustedDaily = dailyRate * expMultiplier;

    setResult({
      hourlyRate: adjustedHourly.toFixed(2),
      dailyRate: adjustedDaily.toFixed(2),
      monthly: desiredIncome,
      skills: skills,
      suggestions: skills.map((s) => skillSuggestions[s] || 'Keep improving your skills!'),
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Freelance Rate Calculator
        </h1>
        <p className="text-text-secondary">
          Find out how much you should charge based on your skills and income goals.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Briefcase className="text-primary" size={24} /> Your Details
          </h2>

          {/* Skills */}
          <div>
            <label className="text-sm text-text-secondary mb-2 block">Your Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    skills.includes(skill)
                      ? 'bg-primary/20 text-primary border border-primary'
                      : 'bg-bg-secondary text-text-secondary border border-border hover:border-primary/50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="text-sm text-text-secondary mb-2 block flex items-center gap-2">
              <Clock size={16} /> Years of Experience
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0 years</span>
              <span className="text-primary font-bold">{experience} years</span>
              <span>10+ years</span>
            </div>
          </div>

          {/* Desired Income */}
          <div>
            <label className="text-sm text-text-secondary mb-2 block flex items-center gap-2">
              <DollarSign size={16} /> Desired Monthly Income (USD)
            </label>
            <input
              type="number"
              min="100"
              max="20000"
              step="100"
              value={desiredIncome}
              onChange={(e) => setDesiredIncome(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          {/* Hours per Day */}
          <div>
            <label className="text-sm text-text-secondary mb-2 block flex items-center gap-2">
              <Clock size={16} /> Hours You Work Per Day
            </label>
            <input
              type="number"
              min="1"
              max="12"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculate}
            className="w-full bg-primary text-black py-3 rounded-xl font-bold text-lg hover:bg-primary-dark transition"
          >
            <Calculator className="inline mr-2" size={20} />
            Calculate My Rate
          </button>
        </div>

        {/* Results */}
        <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
            <TrendingUp className="text-primary" size={24} /> Your Suggested Rates
          </h2>

          {result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-secondary rounded-xl p-4 text-center">
                  <p className="text-xs text-text-secondary mb-1">Hourly Rate</p>
                  <p className="text-3xl font-bold text-primary">${result.hourlyRate}</p>
                </div>
                <div className="bg-bg-secondary rounded-xl p-4 text-center">
                  <p className="text-xs text-text-secondary mb-1">Daily Rate</p>
                  <p className="text-3xl font-bold text-primary">${result.dailyRate}</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm text-text-secondary">
                  To earn <span className="text-primary font-bold">${result.monthly}/month</span>, working{' '}
                  {hoursPerDay}h/day for 22 days, charge at least:
                </p>
                <p className="text-2xl font-bold text-primary mt-2">${result.hourlyRate}/hour</p>
              </div>

              {result.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-3">
                    <Lightbulb className="text-yellow-400" size={18} /> Skill Tips
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((tip, i) => (
                      <li
                        key={i}
                        className="text-sm text-text-secondary bg-bg-secondary rounded-lg p-3 border border-border"
                      >
                        💡 {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <Calculator size={48} className="mx-auto mb-4 opacity-30" />
              <p>Fill in your details and click Calculate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}