import { useRef, useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { CompleteScreen } from './components/CompleteScreen';
import { ResultScreen } from './components/ResultScreen';
import { QUESTIONS } from './data/questions';
import { MENU_DATA } from './data/menus';
import { getRecommendation } from './logic/recommendation';
import { shareResult } from './utils/shareResult';
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
   
    function handleShareResult() {
    shareResult(currentResult);
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
      <ResultScreen
        menu={currentResult}
        alternatives={recommendation.alternatives}
        selectedSummary={selectedSummary}
        onConfirm={() => setScreen('complete')}
        onShare={handleShareResult}
        onRetry={handleRetry}
        onDislike={handleDislike}
      />
    );
  }

    if (screen === 'complete') {
    return (
      <CompleteScreen
        menuName={currentResult?.name}
        onRestart={handleStart}
      />
    );
  }

    return <StartScreen onStart={handleStart} />;
}

export default App;
