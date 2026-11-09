document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.querySelector('#score-display');
    const streakDisplay = document.querySelector('#streak-display');
    const timerDisplay = document.querySelector('#timer-display');
    const gameBoard = document.querySelector('#game-board');
    const overlayScreen = document.querySelector('#overlay-screen');
    const overlayTitle = document.querySelector('#overlay-title');
    const overlayMsg = document.querySelector('#overlay-msg');
    const btnStart = document.querySelector('#btn-start');

    let score = 0;
    let streak = 0;
    let timeLeft = 30;
    let timerInterval = null;
    let currentTarget = null;
    let isPlaying = false;

    btnStart.addEventListener('click', startGame);

    function startGame() {
        score = 0;
        streak = 0;
        timeLeft = 30;
        isPlaying = true;

        scoreDisplay.textContent = score;
        streakDisplay.textContent = streak;
        timerDisplay.textContent = `${timeLeft}s`;

        overlayScreen.classList.add('hidden');

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);

        spawnTarget();
    }

    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            endGame();
        }
    }

    function spawnTarget() {
        if (!isPlaying) return;

        if (currentTarget) {
            currentTarget.remove();
        }

        const target = document.createElement('div');
        target.classList.add('target');

        const boardWidth = gameBoard.clientWidth;
        const boardHeight = gameBoard.clientHeight;
        const targetSize = 50;

        const maxLeft = boardWidth - targetSize;
        const maxTop = boardHeight - targetSize;

        const randomLeft = Math.floor(Math.random() * maxLeft);
        const randomTop = Math.floor(Math.random() * maxTop);

        target.style.left = `${randomLeft}px`;
        target.style.top = `${randomTop}px`;

        target.addEventListener('mouseenter', handleTargetMouseEnter);
        target.addEventListener('mouseleave', handleTargetMouseLeave);
        target.addEventListener('mousedown', handleTargetClick);

        gameBoard.appendChild(target);
        currentTarget = target;

        setTimeout(() => {
            target.classList.add('active');
        }, 10);
    }

    function handleTargetMouseEnter(event) {
        event.target.classList.add('hovered');
    }

    function handleTargetMouseLeave(event) {
        event.target.classList.remove('hovered');
    }

    function handleTargetClick(event) {
        if (!isPlaying) return;

        score += 10 + (streak * 2);
        streak++;

        scoreDisplay.textContent = score;
        streakDisplay.textContent = streak;

        event.target.remove();
        currentTarget = null;

        spawnTarget();
    }

    function endGame() {
        isPlaying = false;
        clearInterval(timerInterval);

        if (currentTarget) {
            currentTarget.remove();
            currentTarget = null;
        }

        overlayTitle.textContent = '¡Tiempo Agotado!';
        overlayMsg.textContent = `Puntaje final: ${score} | Máxima racha: ${streak}`;
        btnStart.textContent = 'Jugar de Nuevo';

        overlayScreen.classList.remove('hidden');
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isPlaying) {
            endGame();
        }
    });
});