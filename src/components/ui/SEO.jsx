import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description }) {
  return (
    <Helmet>
      <title>{title ? `${title} | FreelanceGuard` : 'FreelanceGuard – Scam Protection'}</title>
      <meta name="description" content={description || 'AI-powered scam detection for freelancers.'} />
    </Helmet>
  );
}