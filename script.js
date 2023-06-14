const images = [
    "ACMilan.jpg",
    "BayernMunich.jpg",
    "BenficaFC.jpg",
    "Chelsea.jpg",
    "InterMilan.jpg",
    "ManchesterCity.jpg",
    "Napoli.jpg",
    "RealMadridFC.jpg"
];

const cardGrid = document.getElementById("card-grid");
let cards = [];
let flippedCards = [];
let lockBoard = false;
let matches = 0;
let timer;
let isTimerRunning = false;
const maxTime = 60; // Duración del temporizador en segundos

function createCard(image) {
    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("div");
    front.classList.add("front");

    const back = document.createElement("div");
    back.classList.add("back");
    back.style.backgroundImage = `url(Imagenes/${image})`;

    card.appendChild(back);
    card.appendChild(front);

    card.addEventListener("click", flipCard);

    return card;
}

function generateCards() {
    cards = [];
    const selectedImages = getRandomImages(8);
    for (let i = 0; i < selectedImages.length; i++) {
        cards.push(createCard(selectedImages[i]));
        cards.push(createCard(selectedImages[i]));
    }
    cards = shuffle(cards);
}

function getRandomImages(numImages) {
    const shuffledImages = shuffle(images);
    return shuffledImages.slice(0, numImages);
}

function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function flipCard(event) {
    if (lockBoard || flippedCards.length >= 2) return;
    const card = event.target.parentElement;
    card.classList.add("flipped");
    card.removeEventListener("click", flipCard);
    flippedCards.push(card);

    if (!isTimerRunning) {
        startTimer();
        isTimerRunning = true;
    }

    if (flippedCards.length === 2) {
        lockBoard = true;
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    if (card1.querySelector(".back").style.backgroundImage === card2.querySelector(".back").style.backgroundImage) {
        cardMatch(card1, card2);
    } else {
        cardMismatch(card1, card2);
    }
}

function cardMatch(card1, card2) {
    card1.style.border = "2px solid green";
    card2.style.border = "2px solid green";
    card1.classList.add("matched");
    card2.classList.add("matched");
    matches += 2;
    flippedCards = [];
    lockBoard = false;

    if (matches === cards.length) {
        endGame(true);
    }
}

function cardMismatch(card1, card2) {
    card1.style.border = "2px solid red";
    card2.style.border = "2px solid red";
    setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.addEventListener("click", flipCard);
        card2.addEventListener("click", flipCard);
        card1.style.border = "2px solid black";
        card2.style.border = "2px solid black";
        flippedCards = [];
        lockBoard = false;
    }, 1000);
}

function newGame() {
    endGame(false);
    lockBoard = false;
    flippedCards = [];
    matches = 0;
    generateCards();
    renderCards();
    const messageContainer = document.getElementById("message");
    messageContainer.textContent = "";

    // Dar vuelta todas las cartas durante 4 segundos al iniciar el juego
    setTimeout(() => {
        cards.forEach((card) => {
            card.classList.add("flipped");
        });
        setTimeout(() => {
            cards.forEach((card) => {
                card.classList.remove("flipped");
            });
        }, 4000);
    }, 1000);
}

function renderCards() {
    cardGrid.innerHTML = "";
    cards.forEach((card) => {
        cardGrid.appendChild(card);
    });
}

function startTimer() {
    let timeLeft = maxTime;
    const timerDisplay = document.getElementById("timer");

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function endGame(isWinner) {
    clearInterval(timer);
    isTimerRunning = false;
    lockBoard = true;

    const messageContainer = document.getElementById("message");

    if (isWinner) {
        messageContainer.textContent = "¡Felicidades, has ganado el juego!";
    } else {
        const unmatchedCards = cards.filter((card) => !card.classList.contains("matched"));
        if (unmatchedCards.length > 0) {
            messageContainer.textContent = "Perdiste";
        }
    }

    messageContainer.style.display = "block";

    // Dar vuelta todas las cartas
    cards.forEach((card) => {
        card.classList.add("flipped");
    });
}

const newGameButton = document.getElementById("new-game-button");
newGameButton.addEventListener("click", newGame);


// Iniciar una partida al cargar la página
newGame();
