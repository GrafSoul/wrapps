const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const windowStateKeeper = require('electron-window-state');
require('electron-reload')(__dirname);
const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
} = require('electron-devtools-installer');
const path = require('path');
const isDev = require('electron-is-dev');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const getIcon = () => {
    if (process.platform === 'win32')
        return `${path.join(__dirname, '/icons/icon.ico')}`;
    if (process.platform === 'darwin')
        return `${path.join(__dirname, '/icons/icon.icns')}`;
    return `${path.join(__dirname, '/icons/16x16.png')}`;
};

let mainWindow, tray, contextMenu;
let childWindows = {};

const createWindow = () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 350,
        defaultHeight: 600,
    });

    mainWindow = new BrowserWindow({
        title: 'Wrapps',
        show: false,
        frame: false,
        icon: getIcon(),
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        maxWidth: 800,
        maxHeight: 600,
        minWidth: 350,
        minHeight: 600,
        titleBarStyle: 'hidden',
        backgroundColor: '#282c34',
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            webSecurity: false,
        },
    });

    mainWindowState.manage(mainWindow);

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '/index.html')}`,
    );

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (isDev) {
            installExtension(REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS);
            mainWindow.webContents.openDevTools();
        }
    });

    // Tray ///////////////////////////////////////////////////////////

    tray = new Tray(getIcon());

    if (isDev) {
        contextMenu = Menu.buildFromTemplate([
            {
                label: 'Developer Tools',
                async click() {
                    await installExtension(
                        REACT_DEVELOPER_TOOLS,
                        REDUX_DEVTOOLS,
                    );
                    mainWindow.toggleDevTools();
                },
            },
            { type: 'separator' },
            {
                label: 'Exit',
                role: 'quit',
            },
        ]);
    } else {
        contextMenu = Menu.buildFromTemplate([
            {
                label: 'Exit',
                role: 'quit',
            },
        ]);
    }

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    tray.setToolTip('Wrapps');

    tray.setContextMenu(contextMenu);

    console.log(mainWindow.getTitle());

    // Tray End ////////////////////////////////////////////////////////

    mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

/////////////////////////////////////////////////////////

ipcMain.on('openWindow', (event, title, url, id) => {
    childWindows[id] = new BrowserWindow({
        title: title,
        width: 1280,
        height: 720,
        minWidth: 340,
        minHeight: 220,
        frame: false,
        show: false,
        parent: 'mainWindow',
        focusable: true,
        fullscreenable: false,
        icon: getIcon(),
        backgroundColor: '#282c34',
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false,
        },
    });

    childWindows[id].setMenuBarVisibility(false);

    childWindows[id].loadURL(`file://${path.join(__dirname, '/browser.html')}`);
    childWindows[id].show();
    childWindows[id].setAlwaysOnTop(false);
    childWindows[id].webContents.on('did-finish-load', () => {
        childWindows[id].webContents.send('urlOpen', id, title, url);
    });

    childWindows[id].on('close', () => {
        mainWindow.webContents.send('removeWin', id);
        childWindows[id] = null;
    });
});

ipcMain.on('on-top-browser', (event, id, args) => {
    childWindows[id].setAlwaysOnTop(args);
});

ipcMain.on('on-devtools', (event, id) => {
    childWindows[id].openDevTools();
});

ipcMain.on('closeWindow', (event, id) => {
    childWindows[id].close();
});
