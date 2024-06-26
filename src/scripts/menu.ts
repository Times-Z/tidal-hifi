import { BrowserWindow, Menu, app } from "electron";
import { showSettingsWindow } from "./settings";
const isMac = process.platform === "darwin";
import name from "./../constants/values";

const settingsMenuEntry = {
  label: "Settings",
  click() {
    showSettingsWindow();
  },
  accelerator: "Control+=",
};

const tidalMagazineEntry = {
  label: "Magazine",
  click() {
    const magazineWindow = new BrowserWindow({
      autoHideMenuBar: true,
      webPreferences: {
        sandbox: false,
        plugins: true,
        devTools: true, // I like tinkering, others might too
      },
    });
    magazineWindow.loadURL("https://tidal.com/magazine/");
    magazineWindow.show();
  },
  accelerator: "Control+M",
};

const quitMenuEntry = {
  label: "Quit",
  click() {
    app.exit(0);
  },
  accelerator: "Control+Q",
};

export const getMenu = function (mainWindow: BrowserWindow) {
  const toggleWindow = {
    label: "Toggle Window",
    click: function () {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    },
  };

  const mainMenu = [
    ...(isMac
      ? [
          {
            label: name,
            submenu: [
              settingsMenuEntry,
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              tidalMagazineEntry,
              quitMenuEntry,
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [settingsMenuEntry, tidalMagazineEntry, isMac ? { role: "close" } : quitMenuEntry],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
        { type: "separator" },
        settingsMenuEntry,
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
        { role: "toggledevtools" },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        toggleWindow,
        ...(isMac
          ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }]
          : [{ role: "close" }]),
      ],
    },
    settingsMenuEntry,
    toggleWindow,
    tidalMagazineEntry,
    quitMenuEntry,
  ];

  return Menu.buildFromTemplate(mainMenu as any);
};

export const addMenu = function (mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(getMenu(mainWindow));
};
