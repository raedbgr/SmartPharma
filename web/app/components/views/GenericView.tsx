export function GenericView({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <div className="page-hd">
        <div>
          <h1>{title}</h1>
          <p>{sub}</p>
        </div>
      </div>
      <div className="placeholder-canvas">
        <div>
          // Section prototypée — l&apos;expérience complète sera développée lors du sprint
          suivant.
        </div>
        <div className="muted">// Connectez l&apos;API backend pour activer les flux temps réel.</div>
      </div>
    </>
  );
}
