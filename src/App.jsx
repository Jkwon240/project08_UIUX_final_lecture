// App.jsx
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [imagePair, setImagePair] = useState([]);
  const [usedImages, setUsedImages] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const realImageCount = 10;
  const fakeImageCount = 10;

  const getUniqueIndex = (usedSet, max, prefix) => {
    let index;
    do {
      index = Math.floor(Math.random() * max) + 1;
    } while (usedSet.has(`${prefix}_${index}`));
    return index;
  };

  const getRandomFinalMessage = (score) => {
    const safeMsgs = [
      "🎉 당신은 AI의 위협에서 안전합니다!",
      "🛡️ AI를 완벽하게 구분해낸 당신, 대단합니다!",
      "✅ 진짜를 꿰뚫어보는 눈을 가지셨군요!",
    ];
    const dangerMsgs = [
      "⚠️ AI에 속지 않도록 더 주의하세요!",
      "😨 진짜와 가짜의 구분이 필요해요. AI가 지배하지 않도록 정신을 차리세요.",
      "🚨 AI의 발전 속도, 무시할 수 없습니다.",
    ];
    const pool = score >= 7 ? safeMsgs : dangerMsgs;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  useEffect(() => {
    if (gameOver || showIntro) return;

    const usedSet = new Set(usedImages);
    const realIndex = getUniqueIndex(usedSet, realImageCount, "R");
    const fakeIndex = getUniqueIndex(usedSet, fakeImageCount, "F");

    const realKey = `R_${realIndex}`;
    const fakeKey = `F_${fakeIndex}`;

    const real = { src: `/image/REAL/${realKey}.jpg`, type: "REAL" };
    const fake = { src: `/image/FAKE/${fakeKey}.jpg`, type: "FAKE" };

    const shuffled = Math.random() > 0.5 ? [real, fake] : [fake, real];
    setImagePair(shuffled);
    setUsedImages((prev) => [...prev, realKey, fakeKey]);
    setIsLocked(false);
    setMessage("");
  }, [currentRound, gameOver, showIntro]);

  const handleChoice = (index) => {
    if (gameOver || isLocked) return;
    setIsLocked(true);

    const chosen = imagePair[index];
    const isCorrect = chosen.type === "REAL";

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setMessage("✅ 정답입니다! 진짜 사진이에요.");
    } else {
      setWrongCount((prev) => {
        const newCount = prev + 1;
        setMessage("❌ 오답입니다! AI가 만든 사진이에요.");
        if (newCount >= 3) {
          setTimeout(() => {
            setFinalMessage(getRandomFinalMessage(score));
            setGameOver(true);
          }, 1000);
        }
        return newCount;
      });
    }

    if (currentRound >= 10 && isCorrect) {
      setTimeout(() => {
        setFinalMessage(getRandomFinalMessage(score + 1));
        setGameOver(true);
      }, 1000);
    } else if (currentRound < 10) {
      setTimeout(() => {
        setCurrentRound((prev) => prev + 1);
      }, 1200);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentRound(1);
    setUsedImages([]);
    setWrongCount(0);
    setGameOver(false);
    setMessage("");
    setFinalMessage("");
    setShowShareOptions(false);
    setShowIntro(true);
  };

  const shareText = encodeURIComponent(
    `AI vs Real 이미지 게임 결과\n점수: ${score}/10\n${finalMessage}\n지금 도전해보세요!`
  );
  const currentUrl = encodeURIComponent(window.location.href);

  return (
    <div className="app-container">
      {showIntro ? (
        <div className="intro-screen">
          <h1 className="intro-title">AI vs Real</h1>
          <p className="intro-text">
            당신은 AI 사진을
            <br />
            구분할 수 있다고 믿으시나요?
            <br />
            세상은 빠르게 변하고 있습니다.
            <br />
            <strong>⚠️ AI에 속지 마세요.</strong>
          </p>
          <button className="start-btn" onClick={() => setShowIntro(false)}>
            🚀 게임 시작하기
          </button>
        </div>
      ) : (
        <div className="content-box">
          <header className="header">
            <h1>🤖 AI vs Real 이미지 게임</h1>
          </header>

          {!gameOver ? (
            <div className="game-container">
              <div className="score-board">
                <h2>🧐 진짜 사진을 찾아라!</h2>
                <p>점수: {score}</p>
                <p>라운드: {currentRound}/10</p>
                <div className="lives">
                  <span className="life-label">목숨:</span>
                  {Array.from({ length: 3 - wrongCount }).map((_, i) => (
                    <span key={i} className="heart">
                      ❤️
                    </span>
                  ))}
                </div>
                {message && (
                  <p
                    className={`feedback-message ${
                      message.includes("정답") ? "correct" : "incorrect"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>

              <div className="image-container">
                {imagePair.map((img, idx) => (
                  <div
                    className="image-box"
                    key={idx}
                    onClick={() => handleChoice(idx)}
                  >
                    <img
                      src={img.src}
                      alt={`option-${idx}`}
                      className="select-image"
                    />
                  </div>
                ))}
              </div>

              <div className="controls">
                <button className="choice-btn" onClick={() => handleChoice(0)}>
                  선택
                </button>
                <button className="choice-btn" onClick={() => handleChoice(1)}>
                  선택
                </button>
              </div>
            </div>
          ) : (
            <div className="result-screen">
              <h2>🎯 최종 결과</h2>
              <p className="final-score">최종 점수: {score}/10</p>
              <p className="final-message">{finalMessage}</p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                <button
                  className="toggle-share-btn"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                >
                  📤 결과 공유하기
                </button>

                {showShareOptions && (
                  <div className="share-buttons">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn"
                    >
                      🐦 X 공유
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn facebook"
                    >
                      📘 Facebook
                    </a>
                    <a
                      href={`https://www.instagram.com/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn instagram"
                    >
                      📸 Instagram
                    </a>
                  </div>
                )}

                <button className="reset-btn" onClick={resetGame}>
                  🔄 게임 다시 시작
                </button>

                <a
                  href="https://jkwon240.github.io/jkwon_first_project/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reset-btn"
                >
                  🎮 숫자야구 게임 가기
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
