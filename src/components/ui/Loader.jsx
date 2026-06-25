export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
      {/* Brand name */}
      <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-primary tracking-wider uppercase">
        FreelanceGuard
      </h1>

      {/* Bouncing dots */}
      <div className="mt-6 flex gap-2">
        <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-0" />
        <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-100" />
        <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-200" />
      </div>
    </div>
  );
}