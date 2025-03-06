/*==============================
        GLOBAL SETTINGS
===============================*/
const mouseDist = 200;       // Mouse activation radius
let cols, rows;              // Grid dimensions
const hSizeBase = 5;            // Block horizontal size
const vSizeBase = 5;             // Block horizontal size
let blocks = [];             // 2D array to store blocks

// Mode settings
let clockwiseReturn = true;       // Toggle for clockwise-only return
let independentHueShift = false;   // Toggle for independent hue shift
let hueShiftType = 'lfo';          // 'lfo' or 'noise'
let mouseHandler ;
let blockManager;

//set actual size of the blocks by randomization
let hSize = hSizeBase * (1 + Math.floor(Math.random() * 9));
let vSize = vSizeBase * (1 + Math.floor(Math.random() * 9));
/*==============================
        SETUP FUNCTION
  Initializes canvas and creates
  grid of Block objects
===============================*/

function setup() {
  
  Config.CANVAS.WIDTH = Math.floor(windowWidth / 5) * 5;
  Config.CANVAS.HEIGHT = Math.floor(windowHeight / 5) * 5;
  
  createCanvas(Config.CANVAS.WIDTH, Config.CANVAS.HEIGHT);
  rectMode(CENTER);
  angleMode(DEGREES);
  colorMode(HSL, 360, 100, 100);

  // Initialize handlers with configuration
  mouseHandler = new MouseHandler(Config);
  blockManager = new BlockManager(Config);
  
  // Create grid of blocks
  blockManager.initialize(width, height, vSize, hSize);
  

  
  console.log("Controls:", 
    "\nC - Toggle clockwise return", 
    "\nH - Toggle independent hue shift",
    "\nL - Use LFO for hue shift",
    "\nN - Use Noise for hue shift",
    "\n1-9 - Set cursor size"
  );
}

// Handle window resizing
function windowResized() {
  // Update config with new dimensions (multiples of 5)
  Config.CANVAS.WIDTH = Math.floor(windowWidth / 5) * 5;
  Config.CANVAS.HEIGHT = Math.floor(windowHeight / 5) * 5;
  
  // Resize the canvas
  resizeCanvas(Config.CANVAS.WIDTH, Config.CANVAS.HEIGHT);
  
  // Reinitialize the block grid with new dimensions
  blockManager.initialize(width, height, vSize, hSize);
}

function draw() {
  // Update state
  mouseHandler.update();
  
  // Render
  background(Config.CANVAS.BACKGROUND);
  blockManager.updateBlocks(mouseHandler);
  
  // Display UI
  displayModeInfo();
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    const currentSetting = blockManager.getSettings().clockwiseReturn;
    blockManager.updateSettings('clockwiseReturn', !currentSetting);
    console.log(`Clockwise return: ${!currentSetting ? 'ON' : 'OFF'}`);
  }
  else if (key === 'h' || key === 'H') {
    const currentSetting = blockManager.getSettings().independentHueShift;
    blockManager.updateSettings('independentHueShift', !currentSetting);
    console.log(`Independent hue shift: ${!currentSetting ? 'ON' : 'OFF'}`);
  }
  else if (key === 'l' || key === 'L') {
    blockManager.updateSettings('hueShiftType', 'lfo');
    console.log("Hue shift type: LFO");
  }
  else if (key === 'n' || key === 'N') {
    blockManager.updateSettings('hueShiftType', 'noise');
    console.log("Hue shift type: Noise");
  }
  else if (key >= '1' && key <= '9') {
    mouseHandler.setCursorSize(parseInt(key));
    console.log(`Cursor size set to: ${mouseHandler.cursorSize}`);
  }
}

function displayModeInfo() {
  push();
  fill(0);
  textSize(14);
  
  const settings = blockManager.getSettings();
  
  let infoText = [
    "Controls:",
    `Clockwise Return: ${settings.clockwiseReturn ? 'ON' : 'OFF'} (C)`,
    `Independent Hue Shift: ${settings.independentHueShift ? 'ON' : 'OFF'} (H)`,
    `Shift Type: ${settings.hueShiftType.toUpperCase()} (L/N)`,
    `Cursor Size: ${mouseHandler.cursorSize} (1-9)`,
    "Random Size:",
    `Height: ${hSize}, Width: ${vSize}`
    
  ];
  
  for (let i = 0; i < infoText.length; i++) {
    text(infoText[i], 20, height - 200 + (i * 20));
  }
  pop();
}