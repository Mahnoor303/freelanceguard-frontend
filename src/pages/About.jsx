export default function About({ dark, setDark }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-heading font-bold mb-6">About FreelanceGuard</h1>
      <p className="max-w-2xl text-text-secondary">
        We're a team of freelancers and AI engineers who have been scammed too many times. 
        Our mission is to protect every freelancer from online fraud.
      </p>
    </div>
  );
}