import { useRef, useState } from 'react';
import { MENU_DATA } from './data/menus';
import { getRecommendation } from './logic/recommendation';
import './App.css';

const QUESTIONS = [
  {
    id: 'mealType',
    title: (
      <>
        오늘은<br />
        뭐가 필요하지?
      </>
    ),
    options: [
      { emoji: '🍚', label: '식사', value: 'meal' },
      { emoji: '🍰', label: '디저트', value: 'dessert' },
      { emoji: '🌙', label: '야식', value: 'night' },
      { emoji: '🎲', label: '아무거나', value: 'any' },
    ],
  },
  {
    id: 'groupType',
    title: (
      <>
        누구랑<br />
        먹지?
      </>
    ),
    options: [
      { emoji: '🧍', label: '혼자', value: 'solo' },
      { emoji: '👯', label: '둘 이상', value: 'group' },
      { emoji: '🤷', label: '상관없어', value: 'any' },
    ],
  },
  {
    id: 'eatingMethod',
    title: (
      <>
        어떻게<br />
        먹을까?
      </>
    ),
    options: [
      { emoji: '🛵', label: '배달', value: 'delivery' },
      { emoji: '🚶', label: '외식', value: 'dine_out' },
      { emoji: '🏠', label: '집밥', value: 'home' },
      { emoji: '🏪', label: '편의점·간단히', value: 'convenience' },
      { emoji: '🤷', label: '상관없어', value: 'any' },
    ],
  },
  {
    id: 'priceLevel',
    title: (
      <>
        얼마 정도로<br />
        생각 중이지?
      </>
    ),
    options: [
      { emoji: '💸', label: '1만원 이하', value: 'under_10000' },
      { emoji: '💰', label: '1~2만원', value: 'between_10000_20000' },
      { emoji: '🤑', label: '2만원 이상', value: 'over_20000' },
      { emoji: '🤷', label: '상관없어', value: 'any' },
    ],
  },
  {
    id: 'tasteTag',
    title: (
      <>
        오늘은<br />
        어떤 느낌이지?
      </>
    ),
    options: [
      { emoji: '🍲', label: '따뜻한 거', value: 'warm' },
      { emoji: '🔥', label: '자극적인 거', value: 'stimulating' },
      { emoji: '💪', label: '든든한 거', value: 'filling' },
      { emoji: '🥗', label: '가벼운 거', value: 'light' },
      { emoji: '🍰', label: '달달한 거', value: 'sweet' },
      { emoji: '🍟', label: '바삭한 거', value: 'crispy' },
      { emoji: '✨', label: '유행하는 거', value: 'trendy' },
      { emoji: '🎲', label: '모르겠어', value: 'unsure' },
    ],
  },
  {
    id: 'conditionTag',
    title: (
      <>
        지금 상태는<br />
        좀 어때?
      </>
    ),
    options: [
      { emoji: '🙂', label: '괜찮아', value: 'okay' },
      { emoji: '😵', label: '피곤해', value: 'tired' },
      { emoji: '🤒', label: '몸이 안 좋아', value: 'sick' },
      { emoji: '🤯', label: '스트레스 받아', value: 'stressed' },
      { emoji: '🤤', label: '배고픔 MAX', value: 'very_hungry' },
      { emoji: '😎', label: '기분전환 필요해', value: 'refresh' },
    ],
  },
];

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
  function handleShareResult() {
  if (!currentResult) return;

  const variationText =
    currentResult.variations?.length > 0
      ? `

이렇게 먹어도 좋지
${currentResult.variations.slice(0, 3).join(' · ')}`
      : '';

  const shareUrl = window.location.origin;

  const shareText = `🐿️ 머먹지가 오늘 메뉴를 골라줬지!

오늘의 추천은
🍽️ ${currentResult.name}

${currentResult.reason}${variationText}

나도 메뉴 추천 받아보기
${shareUrl}`;

  if (navigator.share) {
    navigator
      .share({
        title: '머먹지 추천 결과',
        text: shareText,
      })
      .catch(() => {});

    return;
  }

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert('추천 결과를 복사했지! 친구에게 붙여넣어 보내면 돼.');
      })
      .catch(() => {
        window.prompt('아래 내용을 복사해서 공유하면 돼.', shareText);
      });

    return;
  }

  window.prompt('아래 내용을 복사해서 공유하면 돼.', shareText);
}
  async function copyShareText(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('추천 결과를 복사했지! 친구에게 붙여넣어 보내면 돼.');
  } catch (error) {
    window.prompt('아래 내용을 복사해서 공유하면 돼.', text);
  }
}

async function handleShareResult() {
  if (!currentResult) return;

  const shareText = `오늘의 머먹지 추천은 ${currentResult.name}!

${currentResult.reason}

머뭇거리는 시간을 줄여주는 메뉴 추천 서비스, 머먹지 🐿️`;

  const shareUrl = window.location.origin;

  const fullShareText = `${shareText}

${shareUrl}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: '머먹지 추천 결과',
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      // 공유창을 닫은 경우에는 아무것도 하지 않음
    }

    return;
  }

  copyShareText(fullShareText);
}
  async function copyShareText(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('추천 결과를 복사했지! 친구에게 붙여넣어 보내면 돼.');
  } catch (error) {
    window.prompt('아래 내용을 복사해서 공유하면 돼.', text);
  }
}

async function handleShareResult() {
  if (!currentResult) return;

  const shareText = `오늘의 머먹지 추천은 ${currentResult.name}!

${currentResult.reason}

머뭇거리는 시간을 줄여주는 메뉴 추천 서비스, 머먹지 🐿️`;

  const shareUrl = window.location.origin;

  const fullShareText = `${shareText}

${shareUrl}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: '머먹지 추천 결과',
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      // 공유창을 닫은 경우에는 아무것도 하지 않음
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

          <p className="today-text">오늘은</p>

          <h2 className="result-menu">{currentResult.name}</h2>

          <p className="today-text">가 괜찮겠지.</p>

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

          <button
            className="start-button"
            onClick={() => setScreen('complete')}
          >
            이걸로 정했지!
          </button>
          
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