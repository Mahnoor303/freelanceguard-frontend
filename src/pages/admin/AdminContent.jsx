import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminContent() {
  const [content, setContent] = useState({
    heroHeading: 'Protect Your Work. Guard Your Income.',
    heroSubheading: 'AI-Powered Scam Detection Built For Freelancers.',
    cta: 'Start Free Scan',
    features: [
      { id: 1, title: 'Job Analyzer', desc: 'Risk score detection' },
      { id: 2, title: 'Message Scanner', desc: 'Manipulation detection' },
    ],
    pricing: [
      { id: 1, plan: 'Free', price: '$0', period: 'mo' },
      { id: 2, plan: 'Pro', price: '$9.99', period: 'mo' },
      { id: 3, plan: 'Elite', price: '$19.99', period: 'mo' },
    ],
    testimonials: [
      { id: 1, name: 'Priya S.', role: 'Graphic Designer', quote: 'Saved me from a fake client!' },
    ],
    faq: [
      { id: 1, question: 'Is it free?', answer: 'Yes, basic scan is free.' },
      { id: 2, question: 'How accurate?', answer: '92% detection rate.' },
    ],
  });

  // Helper to update hero fields
  const updateHero = (field, value) => {
    setContent({ ...content, [field]: value });
  };

  // Features
  const addFeature = () => {
    const newFeature = { id: Date.now(), title: 'New Feature', desc: 'Description' };
    setContent({ ...content, features: [...content.features, newFeature] });
  };
  const deleteFeature = (id) => {
    setContent({ ...content, features: content.features.filter((f) => f.id !== id) });
  };

  // Pricing
  const addPricing = () => {
    const newPlan = { id: Date.now(), plan: 'New Plan', price: '$0', period: 'mo' };
    setContent({ ...content, pricing: [...content.pricing, newPlan] });
  };
  const deletePricing = (id) => {
    setContent({ ...content, pricing: content.pricing.filter((p) => p.id !== id) });
  };

  // Testimonials
  const addTestimonial = () => {
    const newTest = { id: Date.now(), name: 'New User', role: 'Role', quote: 'Great tool!' };
    setContent({ ...content, testimonials: [...content.testimonials, newTest] });
  };
  const deleteTestimonial = (id) => {
    setContent({ ...content, testimonials: content.testimonials.filter((t) => t.id !== id) });
  };

  // FAQ
  const addFaq = () => {
    const newFaq = { id: Date.now(), question: 'New question', answer: 'New answer' };
    setContent({ ...content, faq: [...content.faq, newFaq] });
  };
  const deleteFaq = (id) => {
    setContent({ ...content, faq: content.faq.filter((f) => f.id !== id) });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Content Management</h1>

      {/* Hero Section */}
      <section className="bg-card-bg border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4 text-text-primary">Hero Section</h2>
        <div className="space-y-3">
          <input
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={content.heroHeading}
            onChange={(e) => updateHero('heroHeading', e.target.value)}
            placeholder="Hero heading"
          />
          <input
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={content.heroSubheading}
            onChange={(e) => updateHero('heroSubheading', e.target.value)}
            placeholder="Hero subheading"
          />
          <input
            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            value={content.cta}
            onChange={(e) => updateHero('cta', e.target.value)}
            placeholder="CTA text"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-card-bg border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-text-primary">Features</h2>
          <button onClick={addFeature} className="text-primary text-sm flex items-center gap-1">
            <Plus size={14} /> Add Feature
          </button>
        </div>
        {content.features.map((feat) => (
          <div key={feat.id} className="flex gap-3 mb-2">
            <input className="flex-1 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={feat.title} readOnly />
            <input className="flex-1 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={feat.desc} readOnly />
            <button onClick={() => deleteFeature(feat.id)} className="text-danger text-sm"><Trash2 size={14} /></button>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="bg-card-bg border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-text-primary">Pricing</h2>
          <button onClick={addPricing} className="text-primary text-sm flex items-center gap-1">
            <Plus size={14} /> Add Plan
          </button>
        </div>
        {content.pricing.map((plan) => (
          <div key={plan.id} className="flex gap-3 mb-2">
            <input className="flex-1 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={plan.plan} readOnly />
            <input className="w-24 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={plan.price} readOnly />
            <input className="w-20 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={plan.period} readOnly />
            <button onClick={() => deletePricing(plan.id)} className="text-danger text-sm"><Trash2 size={14} /></button>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="bg-card-bg border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-text-primary">Testimonials</h2>
          <button onClick={addTestimonial} className="text-primary text-sm flex items-center gap-1">
            <Plus size={14} /> Add Testimonial
          </button>
        </div>
        {content.testimonials.map((t) => (
          <div key={t.id} className="flex gap-3 mb-2">
            <input className="flex-1 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={t.name} readOnly />
            <input className="flex-1 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={t.role} readOnly />
            <input className="flex-1 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={t.quote} readOnly />
            <button onClick={() => deleteTestimonial(t.id)} className="text-danger text-sm"><Trash2 size={14} /></button>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="bg-card-bg border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-text-primary">FAQ</h2>
          <button onClick={addFaq} className="text-primary text-sm flex items-center gap-1">
            <Plus size={14} /> Add FAQ
          </button>
        </div>
        {content.faq.map((faq) => (
          <div key={faq.id} className="flex gap-3 mb-2">
            <input className="flex-1 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={faq.question} readOnly />
            <input className="flex-1 p-2 bg-bg-secondary border border-border rounded-lg text-text-primary" value={faq.answer} readOnly />
            <button onClick={() => deleteFaq(faq.id)} className="text-danger text-sm"><Trash2 size={14} /></button>
          </div>
        ))}
      </section>

      <p className="text-sm text-text-secondary">* Demo: changes are not saved to backend.</p>
    </div>
  );
}