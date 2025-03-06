// ---- mouseHandler.js ----
class MouseHandler {
  constructor(config) {
    this.config = config;
    this.position = createVector(0, 0);
    this.prevPosition = createVector(0, 0);
    this.cursorSize = 4;
    this.baseRadius = config.BLOCK.ACTIVATION_RADIUS;
  }
  
  update() {
    this.prevPosition.set(this.position);
    this.position.set(mouseX, mouseY);
  }
  
  setCursorSize(size) {
    this.cursorSize = size;
  }
  
  get hasMoved() {
    return this.position.dist(this.prevPosition) > 0;
  }
  
  get activationRadius() {
    return this.baseRadius * this.cursorSize;
  }
  
  isWithinCanvas() {
    return (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height);
  }
}