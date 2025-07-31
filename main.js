const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let win;
const dataPath = path.join(app.getAppPath(), 'data', 'flashcards.json');

let cards = [];

function readCards() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    cards = JSON.parse(data);
  } catch (err) {
    cards = [
      { front: 'What is the capital of France?', back: 'Paris' },
      { front: 'What is 2 + 2?', back: '4' }
    ];
    writeCards();
  }
}

function writeCards() {
  fs.writeFileSync(dataPath, JSON.stringify(cards, null, 2));
}

function createWindow () {
  readCards();
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

function createAddWindow () {
  const addWin = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Add New Card',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  addWin.loadFile('add.html');
}

ipcMain.on('open-add-window', () => {
  createAddWindow();
});

ipcMain.on('add-card', (event, card) => {
  cards.push(card);
  writeCards();
  win.webContents.send('card-added', card);
});

function createListWindow () {
  const listWin = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'All Cards',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  listWin.loadFile('list.html');
}

ipcMain.on('open-list-window', (event) => {
  const listWin = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'All Cards',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  listWin.loadFile('list.html');
  listWin.webContents.on('did-finish-load', () => {
    listWin.webContents.send('all-cards', cards);
  });
});

ipcMain.on('delete-card', (event, index) => {
  cards.splice(index, 1);
  writeCards();
  win.webContents.send('card-deleted', index);
});

ipcMain.on('get-all-cards', (event) => {
  event.sender.send('all-cards-main', cards);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});