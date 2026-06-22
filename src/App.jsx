import { useRef, useState } from 'react';
import { QUESTIONS } from './data/questions';
import { MENU_DATA } from './data/menus';
import { getRecommendation } from './logic/recommendation';
import './App.css';



function App() {
  const [screen, setScreen] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);
  const [excludedIds, setExcludedIds] = useState([]);
  const [dislikedIds, setDislikedIds] = useState([]);

  const answersRef = useRef({});

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentResult = recommendation?.main;
    const selectedSummary = QUESTIONS.map((question) => {
    const selectedOption = question.options.find(
      (option) => option.value === answers[question.id]
    );

    return selectedOption?.label;
  }).filter(Boolean);
    async function copyShareText(text) {
    if (!navigator.clipboard) {
      window.prompt('아래 내용을 복사해서 공유하면 돼.', text);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      alert('추천 결과를 복사했지! 친구에게 붙여넣어 보내면 돼.');
    } catch (error) {
      window.prompt('아래 내용을 복사해서 공유하면 돼.', text);
    }
  }

  async function handleShareResult() {
    if (!currentResult) return;

    const shareUrl = window.location.origin;

    const variationText =
      currentResult.variations?.length > 0
        ? `

이렇게 먹어도 좋지
${currentResult.variations.slice(0, 3).join(' · ')}`
        : '';

    const shareMessage = `🐿️ 머먹지가 오늘 메뉴를 골라줬지!

오늘의 추천은
🍽️ ${currentResult.name}

${currentResult.reason}${variationText}`;

    const fullShareText = `${shareMessage}

나도 메뉴 추천 받아보기
${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '머먹지? 추천 결과',
          text: shareMessage,
          url: shareUrl,
        });
      } catch (error) {
        // 사용자가 공유창을 닫은 경우에는 아무것도 하지 않음
      }

      return;
    }

    copyShareText(fullShareText);
  }

  function handleStart() {
    setScreen('question');
    setCurrentQuestionIndex(0);
    setAnswers({});
    answersRef.current = {};
    setRecommendation(null);
    setExcludedIds([]);
    setDislikedIds([]);
  }

  function handleSelectOption(option) {
    const questionId = currentQuestion.id;

    const nextAnswers = {
      ...answersRef.current,
      [questionId]: option.value,
    };

    setAnswers(nextAnswers);
    answersRef.current = nextAnswers;

    const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

    if (isLastQuestion) {
      setScreen('ready');
      return;
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleBack() {
    if (currentQuestionIndex === 0) {
      setScreen('start');
      return;
    }

    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }

  function showLoadingThenResult(nextOptions = {}) {
    setScreen('loading');

    setTimeout(() => {
      const nextRecommendation = getRecommendation(MENU_DATA, answersRef.current, {
        excludedIds: nextOptions.excludedIds ?? excludedIds,
        dislikedIds: nextOptions.dislikedIds ?? dislikedIds,
      });

      setRecommendation(nextRecommendation);
      setScreen('result');
    }, 1200);
  }

  function handleRetry() {
    const currentId = recommendation?.main?.id;

    const nextExcludedIds = currentId
      ? [...excludedIds, currentId]
      : excludedIds;

    setExcludedIds(nextExcludedIds);

    showLoadingThenResult({
      excludedIds: nextExcludedIds,
    });
  }

  function handleDislike() {
    const currentId = recommendation?.main?.id;

    const nextDislikedIds = currentId
      ? [...dislikedIds, currentId]
      : dislikedIds;

    const nextExcludedIds = currentId
      ? [...excludedIds, currentId]
      : excludedIds;

    setDislikedIds(nextDislikedIds);
    setExcludedIds(nextExcludedIds);

    showLoadingThenResult({
      dislikedIds: nextDislikedIds,
      excludedIds: nextExcludedIds,
    });
  }

  if (screen === 'question') {
    return (
      <main className="app">
        <section className="start-card question-card">
          <button className="back-button" onClick={handleBack}>
            ←
          </button>

          <p className="progress">
            {currentQuestionIndex + 1} / {QUESTIONS.length}
          </p>
          <div className="progress-bar">
  <div
    className="progress-fill"
    style={{
      width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%`,
    }}
  />
</div>

          <div className="mini-mascot">🐿️</div>

          <h2 className="question-title">
            {currentQuestion.title}
          </h2>

          <div className="option-list">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                className="option-button"
                onClick={() => handleSelectOption(option)}
              >
                <span>{option.emoji}</span>
                <strong>{option.label}</strong>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'ready') {
    return (
      <main className="app">
        <section className="start-card complete-card">
          <div className="mascot">🐿️🥄</div>

          <h2 className="ready-title">좋아, 다 골랐지!</h2>

          <p className="description">
            이제 머먹쥐가 메뉴를 찾아볼 차례야.
          </p>

          <div className="speech-bubble">
            냉장고 한 번<br />
            뒤져볼게.
          </div>

          <button
            className="start-button"
            onClick={() => showLoadingThenResult()}
          >
            추천 보러가기
          </button>

          <button className="text-button" onClick={handleStart}>
            처음부터 다시
          </button>
        </section>
      </main>
    );
  }

  if (screen === 'loading') {
    return (
      <main className="app">
        <section className="start-card loading-card">
          <div className="fridge-scene">
            <div className="fridge">🧊</div>
            <div className="loading-mascot">🐿️</div>
          </div>

          <h2 className="ready-title">
            머먹쥐가<br />
            냉장고 뒤지는 중...
          </h2>

          <p className="description">
            잠깐만 기다려 줄 수 있지?
          </p>

          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'result') {
    if (!currentResult) {
      return (
        <main className="app">
          <section className="start-card complete-card">
            <div className="mascot">🐿️💦</div>

            <h2 className="ready-title">
              앗, 메뉴를 못 찾았지.
            </h2>

            <p className="description">
              처음부터 다시 골라보면 괜찮을 거야.
            </p>

            <button className="start-button" onClick={handleStart}>
              처음부터 다시
            </button>
          </section>
        </main>
      );
    }

    return (
      <main className="app">
        <section className="start-card result-card">
          <p className="result-label">🐿️ 찾았지!</p>

          <div className="result-hero">
            <div
              className="result-visual"
              role="img"
              aria-label={`${currentResult.name} 음식 이미지 자리`}
            >
              <span className="visual-sparkle">✦</span>
              <span className="visual-plate">🍽️</span>
              <span className="visual-sparkle">✦</span>
            </div>

            <p className="today-text">오늘은</p>
            <h2 className="result-menu">{currentResult.name}</h2>
            <p className="today-text">가 괜찮겠지.</p>
          </div>
                    {selectedSummary.length > 0 && (
            <p className="answer-summary">
              <span>내 선택</span>
              {selectedSummary.join(' · ')}
            </p>
          )}

          <button
            className="start-button result-decision-button"
            onClick={() => setScreen('complete')}
          >
            이걸로 정했지!
          </button>

          <div className="result-detail-box">
            <span className="detail-label">왜 이 메뉴냐면</span>
            <p>{currentResult.reason}</p>
          </div>

          {currentResult.variations?.length > 0 && (
            <div className="variation-box">
              <span className="detail-label">이렇게 먹어도 좋지</span>

              <div className="variation-list">
                {currentResult.variations.slice(0, 3).map((variation) => (
                  <span className="variation-chip" key={variation}>
                    {variation}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="alternative-box">
            <p>비슷한 선택지</p>
            <strong>
              {recommendation.alternatives.map((menu) => menu.name).join(' · ')}
            </strong>
          </div>

          <button className="share-button" onClick={handleShareResult}>
            친구한테 공유하기
          </button>

          <div className="result-actions">
            <button className="sub-button" onClick={handleRetry}>
              다시 골라줘
            </button>
            <button className="sub-button" onClick={handleDislike}>
              별로야
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'complete') {
    return (
      <main className="app">
        <section className="start-card complete-card">
          <div className="mascot">🐿️✨</div>

          <h2 className="ready-title">
            좋아, 오늘 메뉴는<br />
            {currentResult?.name}로 정했지!
          </h2>

          <p className="description">
            이제 맛있는 시간만<br />
남았지.
          </p>

          <button className="start-button" onClick={handleStart}>
            처음부터 다시
          </button>
        </section>
      </main>
    );
  }

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

        <button className="start-button" onClick={handleStart}>
          시작하기
        </button>
      </section>
    </main>
  );
}

export default App;
