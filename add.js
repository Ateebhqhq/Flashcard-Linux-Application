
const { ipcRenderer } = require('electron');

const form = document.getElementById('add-form');
const frontInput = document.getElementById('front');
const backInput = document.getElementById('back');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const card = {
    front: frontInput.value,
    back: backInput.value
  };
  ipcRenderer.send('add-card', card);
  window.close();
});
