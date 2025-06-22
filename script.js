// Game data - words and their corresponding image URLs
const WORDS = [
    // Animals
    { word: 'いぬ', img: 'https://emojicdn.elk.sh/🐕' },
    { word: 'ねこ', img: 'https://emojicdn.elk.sh/🐈' },
    { word: 'うさぎ', img: 'https://emojicdn.elk.sh/🐇' },
    { word: 'くま', img: 'https://emojicdn.elk.sh/🐻' },
    { word: 'きつね', img: 'https://emojicdn.elk.sh/🦊' },
    { word: 'さる', img: 'https://emojicdn.elk.sh/🐒' },
    { word: 'とり', img: 'https://emojicdn.elk.sh/🐦' },
    { word: 'かめ', img: 'https://emojicdn.elk.sh/🐢' },
    { word: 'かば', img: 'https://emojicdn.elk.sh/🦛' },
    { word: 'らくだ', img: 'https://emojicdn.elk.sh/🐫' },
    { word: 'ぞう', img: 'https://emojicdn.elk.sh/🐘' },
    { word: 'きりん', img: 'https://emojicdn.elk.sh/🦒' },
    { word: 'ぱんだ', img: 'https://emojicdn.elk.sh/🐼' },

    // Sea creatures
    { word: 'いか', img: 'https://emojicdn.elk.sh/🦑' },
    { word: 'たこ', img: 'https://emojicdn.elk.sh/🐙' },
    { word: 'かに', img: 'https://emojicdn.elk.sh/🦀' },
    { word: 'いるか', img: 'https://emojicdn.elk.sh/🐬' },
    { word: 'くじら', img: 'https://emojicdn.elk.sh/🐋' },

    // Fruits
    { word: 'りんご', img: 'https://emojicdn.elk.sh/🍎' },
    { word: 'みかん', img: 'https://emojicdn.elk.sh/🍊' },
    { word: 'ばなな', img: 'https://emojicdn.elk.sh/🍌' },
    { word: 'いちご', img: 'https://emojicdn.elk.sh/🍓' },
    { word: 'ぶどう', img: 'https://emojicdn.elk.sh/🍇' },
    { word: 'もも', img: 'https://emojicdn.elk.sh/🍑' },
    { word: 'なし', img: 'https://emojicdn.elk.sh/🍐' },
    { word: 'めろん', img: 'https://emojicdn.elk.sh/🍈' },
    { word: 'すいか', img: 'https://emojicdn.elk.sh/🍉' },

    // Vegetables
    { word: 'にんじん', img: 'https://emojicdn.elk.sh/🥕' },
    { word: 'たまねぎ', img: 'https://emojicdn.elk.sh/🧅' },
    { word: 'なす', img: 'https://emojicdn.elk.sh/🍆' },
    { word: 'とまと', img: 'https://emojicdn.elk.sh/🍅' },
    
    // Other
    { word: 'かばん', img: 'https://emojicdn.elk.sh/🎒' },
    { word: 'ほし', img: 'https://emojicdn.elk.sh/⭐' },
    { word: 'つき', img: 'https://emojicdn.elk.sh/🌙' },

];

// DOM elements
const wordImage = document.getElementById('wordImage');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const encouragementElement = document.getElementById('encouragement');
const textInput = document.getElementById('textInput');
const skipBtn = document.getElementById('skipBtn');
const gameArea = document.getElementById('gameArea');
const resultScreen = document.getElementById('resultScreen');
const playAgainBtn = document.getElementById('playAgainBtn');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const card = document.getElementById('card');

// Game state
let currentWordIndex = 0;
let score = 0;
let gameWords = [];
let currentWord = '';
let isAnswerShown = false;
let startTime;
let scoreByLength = {};

// Initialize the game
function initGame() {
    // Filter out words with youon (拗音) like 'きゃ', 'しょ', etc.
    const simpleWords = WORDS.filter(item => !/[ゃゅょ]/.test(item.word));
    
    // Shuffle and select 10 random words
    gameWords = [...simpleWords].sort(() => 0.5 - Math.random()).slice(0, 10);
    currentWordIndex = 0;
    score = 0;
    
    // Reset score breakdown
    scoreByLength = {};
    gameWords.forEach(word => {
        const len = word.word.length;
        if (!scoreByLength[len]) {
            scoreByLength[len] = { correct: 0, total: 0 };
        }
        scoreByLength[len].total++;
    });

    startTime = Date.now();
    updateScore();
    
    // Show game area, hide result screen
    gameArea.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    
    // Load first word
    loadCurrentWord();
}

// Check the user's answer
function checkAnswer(userAnswer) {
    if (isAnswerShown) return; // Don't check if the answer is already shown

    const reversedWord = currentWord.word.split('').reverse().join('');
    const normalizedAnswer = userAnswer.replace(/\s+/g, '');

    if (normalizedAnswer === reversedWord) {
        // Correct answer
        score++;
        const len = currentWord.word.length;
        if (scoreByLength[len]) {
            scoreByLength[len].correct++;
        }
        updateScore();
        playSound(correctSound);
        card.classList.add('bounce');
        showFeedback(true);
    } else {
        // Incorrect answer
        playSound(wrongSound);
        card.classList.add('shake');
        showFeedback(false);
    }
}

// Show feedback (〇 or ✕) and correct answer if needed
function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    textInput.disabled = true; // Disable input during feedback
    skipBtn.style.display = 'none'; // Hide skip button during feedback
    isAnswerShown = true;

    if (isCorrect) {
        feedback.textContent = '〇 せいかい！';
        feedback.className = 'feedback visible correct';
        
        // Auto-proceed to next question after delay
        setTimeout(() => {
            currentWordIndex++;
            loadCurrentWord();
        }, 1000);
    } else {
        const correctAnswer = currentWord.word.split('').reverse().join('');
        feedback.innerHTML = `✕ まちがい<br>こたえ: ${correctAnswer}`;
        feedback.className = 'feedback visible incorrect';
        
        // Auto-proceed to next question after a longer delay
        setTimeout(() => {
            currentWordIndex++;
            loadCurrentWord();
        }, 2000);
    }
}

// Load current word
function loadCurrentWord() {
    if (currentWordIndex >= gameWords.length) {
        endGame();
        return;
    }
    
    currentWord = gameWords[currentWordIndex];
    wordImage.src = currentWord.img;
    wordImage.alt = currentWord.word;
    
    // Clear input and feedback
    textInput.value = '';
    textInput.disabled = false;
    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback';
    
    // Reset UI state
    card.classList.remove('shake', 'bounce');
    skipBtn.style.display = 'block';
    isAnswerShown = false;
    
    // Focus the input
    textInput.focus();
}

// Submit typed answer
function submitTypedAnswer() {
    const answer = textInput.value.trim();
    if (answer) {
        checkAnswer(answer);
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
}

// End the game and show results
function endGame() {
    gameArea.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);

    finalScoreElement.textContent = score;
    document.getElementById('timeTaken').textContent = timeTaken;
    
    // Display score breakdown
    const breakdownElement = document.getElementById('scoreBreakdown');
    breakdownElement.innerHTML = ''; // Clear previous results
    const sortedLengths = Object.keys(scoreByLength).sort();

    sortedLengths.forEach(len => {
        const stats = scoreByLength[len];
        const correct = stats.correct || 0;
        const total = stats.total;
        if (total > 0) {
            const row = document.createElement('div');
            row.className = 'breakdown-row';
            row.textContent = `${len}もじのことば: ${correct} / ${total} もん`;
            breakdownElement.appendChild(row);
        }
    });

    // Set encouragement message based on score
    let message;
    if (score === 10) {
        message = 'すごい！ ぜんぶ せいかい です！🎉';
    } else if (score >= 7) {
        message = 'とっても じょうず です！👏';
    } else if (score >= 4) {
        message = 'がんばりました！ もっと れんしゅう しましょう！';
    } else {
        message = 'もういちど ちからを あわせて がんばりましょう！';
    }
    
    encouragementElement.textContent = message;
}

// Play sound
function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.error('Error playing sound:', e));
}

// Event listeners
skipBtn.addEventListener('click', () => {
    currentWordIndex++;
    loadCurrentWord();
});

playAgainBtn.addEventListener('click', initGame);

// Handle physical keyboard input
document.addEventListener('keydown', (e) => {
    // Handle Enter to submit from the text input
    if (e.target === textInput && e.key === 'Enter') {
        submitTypedAnswer();
        e.preventDefault(); // Prevent form submission if it's in a form
    }
});

// Start the game when the page loads
window.addEventListener('load', initGame);
