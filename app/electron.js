// Import necessary modules from Electron
import { app, BrowserWindow } from "electron";
// Import path module to handle file paths
import path from "path";
// Import electron-is-dev to check if the app is in development mode
import isDev from "electron-is-dev";

let mainWindow; // Declare a variable to hold the main window instance

function createWindow() {
  // Create a new browser window with specified dimensions
  mainWindow = new BrowserWindow({
    width: 800, // Set the width of the window
    height: 600, // Set the height of the window
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration in the renderer process
    },
  });

  // Determine the URL to load based on the environment (development or production)
  const startURL = isDev
    ? "http://localhost:3000" // In development, load the React app from localhost
    : `file://${path.join(__dirname, "../build/index.html")}`; // In production, load the built React app

  mainWindow.loadURL(startURL); // Load the determined URL into the window

  // Handle the 'closed' event to dereference the window object
  mainWindow.on("closed", () => (mainWindow = null));
}

// Event listener for when Electron has finished initialization
app.on("ready", createWindow);

// Event listener for when all windows are closed
app.on("window-all-closed", () => {
  // On macOS, it's common for applications to stay active until the user quits explicitly
  if (process.platform !== "darwin") {
    app.quit(); // Quit the app if not on macOS
  }
});

// Event listener for when the app is activated (e.g., clicking the dock icon on macOS)
app.on("activate", () => {
  // Re-create the window if it was closed
  if (mainWindow === null) {
    createWindow();
  }
});
