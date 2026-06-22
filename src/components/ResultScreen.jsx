export function ResultScreen({
  menu,
  alternatives = [],
  selectedSummary = [],
  onConfirm,
  onShare,
  onRetry,
  onDislike,
}) {
  return (
    <main className="app result-page">
      <section className="start-card result-card">
        <p className="result-label">🐿️ 찾았지!</p>

        <div className="result-hero">
          <div
            className="result-visual"
            role="img"
            aria-label={`${menu.name} 음식 이미지 자리`}
          >
            <span className="visual-sparkle">✦</span>
            <span className="visual-plate">🍽️</span>
            <span className="visual-sparkle">✦</span>
          </div>

          <p className="today-text">오늘은</p>
          <h2 className="result-menu">{menu.name}</h2>
          <p className="today-text">가 괜찮겠지.</p>
        </div>

        <button className="start-button result-decision-button" onClick={onConfirm}>
          이걸로 정했지!
        </button>

        <div className="result-detail-box">
          <span className="detail-label">왜 이 메뉴냐면</span>
          <p>{menu.reason}</p>
        </div>

        <div className="result-compact-info">
          {selectedSummary.length > 0 && (
            <div className="compact-info-row selection-row">
              <span className="compact-info-label">내 선택</span>
              <div className="selection-chips">
                {selectedSummary.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          )}

          {menu.variations?.length > 0 && (
            <div className="compact-info-row">
              <span className="compact-info-label">이렇게 먹어도 좋지</span>
              <p>{menu.variations.slice(0, 3).join(' · ')}</p>
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="compact-info-row">
              <span className="compact-info-label">비슷한 선택지</span>
              <p>{alternatives.map((alternative) => alternative.name).join(' · ')}</p>
            </div>
          )}
        </div>

        <button className="share-button" onClick={onShare}>
          친구한테 공유하기
        </button>

        <div className="result-actions">
          <button className="sub-button" onClick={onRetry}>
            다시 골라줘
          </button>
          <button className="sub-button" onClick={onDislike}>
            별로야
          </button>
        </div>
      </section>
    </main>
  );
}