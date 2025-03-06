// ---- blockManager.js ----
class BlockManager {
  constructor(config) {
    this.config = config;
    this.blocks = [];
    this.cols = 0;
    this.rows = 0;
    this.settings = {
      clockwiseReturn: true,
      independentHueShift: false,
      hueShiftType: 'lfo'
    };
  }

  initialize(width, height, vSize, hSize) {
    this.cols = Math.floor(width / vSize);
    this.rows = Math.floor(height / hSize);
    
    // Create grid of blocks
    for (let i = 0; i < this.cols; i++) {
      this.blocks[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.blocks[i][j] = new Block(
          i * vSize + vSize / 2,  // X position
          j * hSize + hSize / 2,   // Y position
          vSize,                   // Vertical size
          hSize,                   // Horizontal size
          true                     // Enable color effect
        );
      }
    }
  }

  updateBlocks(mouseHandler) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.blocks[i][j].move(mouseHandler);
        this.blocks[i][j].display();
      }
    }
  }

  updateSettings(setting, value) {
    this.settings[setting] = value;
    
    // Apply settings to all blocks
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.blocks[i][j].setClockwiseReturn(this.settings.clockwiseReturn);
        this.blocks[i][j].setIndependentHueShift(
          this.settings.independentHueShift, 
          this.settings.hueShiftType
        );
      }
    }
  }
  
  getSettings() {
    return this.settings;
  }
}