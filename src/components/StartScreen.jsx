export function StartScreen({ onStart }) {
  return (
    <main className="app">
      <section className="start-card start-landing-card">
        <div className="start-badge">오늘 뭐 먹지?</div>

        <div className="start-mascot-scene" aria-hidden="true">
          <span className="start-mascot-glow"></span>
          <span className="start-mascot">🐿️</span>
          <span className="start-spoon">🥄</span>
          <span className="start-food start-food-1">🍜</span>
          <span className="start-food start-food-2">🍰</span>
          <span className="start-food start-food-3">🍙</span>
        </div>

        <h1>머먹지?</h1>

        <p className="subtitle">
          오늘 메뉴 고민,<br />
          짧게 끝내지!
        </p>

        <div className="speech-bubble start-speech">
          오늘도 메뉴 앞에서<br />
          머뭇거리고 있지?
        </div>

        <button className="start-button" onClick={onStart}>
          먹자!
        </button>
      </section>
    </main>
  );
}