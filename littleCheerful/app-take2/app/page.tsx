export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-display font-semibold mb-6" style={{ color: 'var(--color-crimson)' }}>
          Little Cheerful
        </h1>
        <p className="text-xl mb-8" style={{ color: 'var(--color-ink)' }}>
          Your personal Socratic learning companion
        </p>
        <div className="space-y-4">
          <a
            href="/setup"
            className="inline-block px-8 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: 'var(--color-crimson)',
              color: 'var(--color-parchment)',
            }}
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
