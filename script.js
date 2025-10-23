const wordLevels = {
  "初級": ["猫", "犬", "学校", "友達", "花", "鳥", "水", "山", "川", "空", "海",
           "本", "机", "椅子", "鉛筆", "消しゴム", "時計", "帽子", "靴", "バス", "電車"],
  "中級": ["私は毎日学校へ行きます。", "電車で旅行するのが好きです。",
           "今日は良い天気ですね。", "明日は友達と映画を見に行きます。",
           "夕食はカレーを作る予定です。", "音楽を聞くのが大好きです。",
           "読書は私の趣味の一つです。", "週末は家族と買い物に行きます。",
           "新しい言語を学ぶのは楽しいです。", "スポーツをすることは健康に良いです。"],
  "上級": ["今日はとても忙しい日でした。朝早く起きて、学校に行く準備をしました。",
           "新しい環境で生活を始めることは、たくさんの挑戦と機会を伴います。",
           "科学技術の発展により、私たちの生活は大きく変化しています。",
           "文化の違いを理解することは、国際交流において重要な要素です。",
           "環境保護は現代社会において避けられない課題の一つです。",
           "歴史的な背景を考慮することで、現在の社会問題をより深く理解することができます。",
           "持続可能な発展を目指すためには、資源の有効活用が不可欠です。",
           "教育の質を向上させることで、将来の世代により良い未来を提供することができます。",
           "人間関係を円滑にするためには、共感と理解が必要不可欠です。",
           "日々の努力と継続が、成功への道を開く鍵となります。"]
};

let selectedWords = [];
let currentWord = "";
let score = 0;
let questionCount = 0;
let correctAnswers = 0;
let totalAttempts = 0;
let startTime = 0;
let levelName = "";
const MAX_QUESTIONS = 20;

const wordDisplay = document.getElementById("word-display");
const inputArea = document.getElementById("input-area");
const result = document.getElementById("result");
const progress = document.getElementById("progress");

function selectLevel(level) {
  selectedWords = wordLevels[level];
  levelName = level;
  questionCount = 0;
  score = 0;
  correctAnswers = 0;
  totalAttempts = 0;

  document.getElementById("level-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  inputArea.rows = (level === "中級" || level === "上級") ? 3 : 1;
  inputArea.value = "";
  result.textContent = "";
  progress.textContent = "";

  countdown(3);
}

function countdown(seconds) {
  let count = seconds;
  const interval = setInterval(() => {
    wordDisplay.textContent = `${count}...`;
    count--;
    if (count < 0) {
      clearInterval(interval);
      wordDisplay.textContent = "スタート！";
      setTimeout(() => {
        startTime = Date.now();
        nextWord();
      }, 500);
    }
  }, 1000);
}

function nextWord() {
  if (questionCount >= MAX_QUESTIONS) {
    endGame();
    return;
  }
  currentWord = selectedWords[Math.floor(Math.random() * selectedWords.length)];
  wordDisplay.textContent = currentWord;
  inputArea.value = "";
  questionCount++;
  progress.textContent = `残り: ${MAX_QUESTIONS - questionCount} 問`;
}

inputArea.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    checkWord();
  }
});

function checkWord() {
  const typed = inputArea.value.trim();
  const elapsed = (Date.now() - startTime) / 1000;
  if (!typed) return;

  totalAttempts++;
  if (typed === currentWord) {
    correctAnswers++;
    result.textContent = "正解！";
    result.style.color = "green";
  } else {
    result.textContent = `間違えました！\n入力: ${typed}\n正解: ${currentWord}`;
    result.style.color = "red";
  }

  const accuracy = correctAnswers / totalAttempts;
  score += Math.floor((1000 / (elapsed + 1)) * accuracy);
  startTime = Date.now();
  nextWord();
}

function endGame() {
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("end-screen").style.display = "block";

  updateScores();
  const accuracy = (correctAnswers / totalAttempts * 100).toFixed(2);
  document.getElementById("final-result").textContent = `ゲーム終了！\nスコア: ${score}\n正解率: ${accuracy}%`;
}

function restartGame() {
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("level-screen").style.display = "block";
  displayHighScores();
}

function loadScores() {
  return JSON.parse(localStorage.getItem("scores")) || {"初級": [], "中級": [], "上級": []};
}

function saveScores(scores) {
  localStorage.setItem("scores", JSON.stringify(scores));
}

function updateScores() {
  const scores = loadScores();
  scores[levelName].push(score);
  scores[levelName] = scores[levelName].sort((a, b) => b - a).slice(0, 3);
  saveScores(scores);
}

function displayHighScores() {
  const scores = loadScores();
  let text = "ハイスコア<br>";
  for (let level of ["初級", "中級", "上級"]) {
    const best = scores[level][0] || "なし";
    text += `${level}: ${best}<br>`;
  }
  document.getElementById("high-scores").innerHTML = text;
}

function resetHighScores() {
  saveScores({"初級": [], "中級": [], "上級": []});
  displayHighScores();
}

displayHighScores();
