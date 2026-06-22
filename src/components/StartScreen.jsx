export function StartScreen({ onStart }) {
  return (
    <main className="app">
      <section className="start-card">
        <div className="mascot">🐿️</div>

        <h1>머먹지</h1>

        <p className="subtitle">
          머뭇거리는 시간을 줄여주는<br />
          메뉴 추천 서비스
        </p>

        <div className="speech-bubble">
          오늘도 메뉴 앞에서<br />
          머뭇거리고 있지?
        </div>

        <p className="description">
          머먹쥐가 딱 하나 골라줄게.
        </p>

        <button className="start-button" onClick={onStart}>
          시작하기
        </button>
      </section>
    </main>
  );
}