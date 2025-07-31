
const { ipcRenderer } = require('electron');

const cardList = document.getElementById('card-list');

ipcRenderer.on('all-cards', (event, cards) => {
  cardList.innerHTML = '';
  cards.forEach((card, index) => {
    const cardItem = document.createElement('div');
    cardItem.classList.add('card-item');
    cardItem.innerHTML = `
      <span>${card.front} - ${card.back}</span>
      <button data-index="${index}">Delete</button>
    `;
    cardList.appendChild(cardItem);
  });
});

cardList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const index = e.target.dataset.index;
    ipcRenderer.send('delete-card', index);
    e.target.closest('.card-item').remove();
  }
});
