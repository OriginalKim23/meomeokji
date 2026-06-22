export function CompleteScreen({ menuName, onRestart }) {
  return (
    <main className="app">
      <section className="start-card complete-card">
        <div className="mascot">🐿️✨</div>

        <h2 className="ready-title">
          좋아, 오늘 메뉴는<br />
          {menuName}로 정했지!
        </h2>

        <p className="description">
          이제 맛있는 시간만<br />
          남았지.
        </p>

        <button className="start-button" onClick={onRestart}>
          처음부터 다시
        </button>
      </section>
    </main>
  );
}