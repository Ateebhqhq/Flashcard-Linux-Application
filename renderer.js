const { ipcRenderer } = require('electron');

const flashcard = document.getElementById('flashcard');
const flashcardFront = document.getElementById('flashcard-front');
const flashcardBack = document.getElementById('flashcard-back');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const flipBtn = document.getElementById('flip-btn');
const addCardBtn = document.getElementById('add-card-btn');
const listCardsBtn = document.getElementById('list-cards-btn');
const randomBtn = document.createElement('button');
randomBtn.id = 'random-btn';
randomBtn.textContent = 'Random';
document.getElementById('controls').appendChild(randomBtn);

let cards = [];
let currentCardIndex = 0;

ipcRenderer.send('get-all-cards');

ipcRenderer.on('all-cards-main', (event, allCards) => {
  cards = allCards;
  showCard();
});

function showCard() {
  if (cards.length === 0) {
    flashcardFront.textContent = 'No cards yet!';
    flashcardBack.textContent = '';
    return;
  }
  flashcardFront.textContent = cards[currentCardIndex].front;
  flashcardBack.textContent = cards[currentCardIndex].back;
}

function flipCard() {
  flashcard.classList.toggle('flipped');
}

function nextCard() {
  if (currentCardIndex < cards.length - 1) {
    currentCardIndex++;
    showCard();
  }
}

function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    showCard();
  }
}

addCardBtn.addEventListener('click', () => {
  ipcRenderer.send('open-add-window');
});

ipcRenderer.on('card-added', (event, card) => {
  cards.push(card);
  currentCardIndex = cards.length - 1;
  showCard();
});

listCardsBtn.addEventListener('click', () => {
  ipcRenderer.send('open-list-window', cards);
});

randomBtn.addEventListener('click', () => {
  shuffleCards();
  currentCardIndex = 0;
  showCard();
});

ipcRenderer.on('card-deleted', (event, index) => {
  cards.splice(index, 1);
  if (currentCardIndex >= cards.length && cards.length > 0) {
    currentCardIndex = cards.length - 1;
  } else if (cards.length === 0) {
    currentCardIndex = 0;
  }
  showCard();
});

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

flipBtn.addEventListener('click', flipCard);
nextBtn.addEventListener('click', nextCard);
prevBtn.addEventListener('click', prevCard);

showCard();