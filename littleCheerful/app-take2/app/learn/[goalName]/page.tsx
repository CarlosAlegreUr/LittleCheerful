export default async function GoalPage(props: { params: Promise<{ goalName: string }> }) {
  const params = await props.params;
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-display font-semibold mb-8" style={{ color: 'var(--color-crimson)' }}>
          Learning: {decodeURIComponent(params.goalName)}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-8 rounded-lg" style={{ backgroundColor: 'var(--color-marble)', borderColor: 'var(--color-border-medium)', borderWidth: '1px' }}>
            <p className="text-lg text-center" style={{ color: 'var(--color-ink)' }}>
              Chat interface will be implemented in Phase 3
            </p>
          </div>
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'var(--color-parchment)', borderColor: 'var(--color-border-medium)', borderWidth: '1px' }}>
            <p className="text-lg text-center" style={{ color: 'var(--color-ink)' }}>
              Concept tree will be implemented in Phase 3
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
