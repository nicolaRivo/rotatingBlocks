class Block {
  constructor(x, y, vSize = 50, hSize = 100, hueEffect = false, blockColor = null) {
    // POSITION AND SIZE PROPERTIES
    this.x = x;
    this.y = y;
    this.hSize = hSize;
    this.vSize = vSize;
    this.rotationPeriod = 180;

    // ROTATION PROPERTIES
    this.angle = 0;
    this.maxSpeed = 5;
    this.currentSpeed = 0;
    this.rotStop = (this.hSize == this.vSize) ? 90 : 180;
    this.minRotSpeed = 0.5;
    this.isReturning = false;
    
    // MODE SETTINGS
    this.clockwiseReturnOnly = true;
    this.independentHueShift = false;
    this.hueShiftType = 'lfo';
    
    // LFO PROPERTIES
    this.lfoPhase = random(TWO_PI);
    this.lfoFrequency = random(0.01, 0.05);
    
    // NOISE PROPERTIES
    this.noiseOffset = random(1000);
    this.noiseSpeed = random(0.002, 0.01);
    
    // COLOR PROPERTIES
    this.hueEffect = hueEffect;
    this.color = blockColor || color(0, 0, 100);
    this.initialLight = 100;
    this.light = this.initialLight;
    this.targetLight = this.initialLight;
    this.baseHue = random(360);
    this.hueShiftAmount = 0;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    
    if (this.hueEffect) fill(this.color);
    else fill(0, 0, 100);
    
    rect(0, 0, this.vSize, this.hSize);
    pop();
  }

  move(mouseHandler) {
    // Update hue shift if independent mode is on
    if (this.independentHueShift) {
      this.updateHueShift();
    }
    
    // Check if mouse is within canvas
    if (mouseHandler.isWithinCanvas()) {
      const distance = dist(mouseX, mouseY, this.x, this.y);
      
      // Calculate rotation speed based on distance (closer = faster)
      let rotSpeed = map(distance, 0, mouseHandler.activationRadius, this.maxSpeed, this.minRotSpeed);
      rotSpeed = constrain(rotSpeed, this.minRotSpeed, this.maxSpeed);
      
      let mouseDistNoise = mouseHandler.activationRadius + map(noise(this.noiseOffset), 0, 1, -90, 90);
      
      // Activate rotation if mouse is close and moving
      if (distance < mouseDistNoise && mouseHandler.hasMoved) {
        this.isReturning = false;
        this.currentSpeed = rotSpeed;
        this.angle += this.currentSpeed;
        
        // Set target lightness for smooth transition
        this.targetLight = 50;
        
        // Update color if hue effect is enabled
        if (this.hueEffect) this.updateColor();
      } else {
        this.returnToRest();
      }
    } else {
      this.returnToRest();
    }
    
    // Smooth lightness transition
    this.light = lerp(this.light, this.targetLight, 0.05);
  }

  updateHueShift() {
    if (this.hueShiftType === 'lfo') {
      // LFO-based hue shift: oscillates between -60 and 60 degrees of hue
      this.lfoPhase += this.lfoFrequency;
      this.hueShiftAmount = sin(this.lfoPhase) * 60;
    } else {
      // Noise-based hue shift: creates more organic, unpredictable shifts
      this.noiseOffset += this.noiseSpeed;
      this.hueShiftAmount = map(noise(this.noiseOffset), 0, 1, -90, 90);
    }
  }

  updateColor() {
    let hue;
    
    if (this.independentHueShift) {
      // Use base hue + rotation-based shift + independent shift
      hue = (this.baseHue + map(this.angle % 360, 0, 360, 0, 180) + this.hueShiftAmount) % 360;
    } else {
      // Just use rotation-based hue
      hue = map(this.angle % 360, 0, 360, 0, 360);
    }
    
    // Create new HSL color with current hue and light values
    this.color = color(hue, 60, this.light);
  }

  returnToRest() {
    if (this.x == this.y){
      this.rotationPeriod = 90;
    }
    // Set flag for returning state
    this.isReturning = true;
    
    // Set target lightness back to initial
    this.targetLight = this.initialLight;
    
    // Keep angle within 0-this.rotationPeriod degree range
    this.angle = this.angle % this.rotationPeriod;
    
    // Determine return rotation direction and speed
    const returnSpeed = 4; // Fixed return speed
    
    // If angle is close to 0 or 360, snap to 0
    if (this.angle < returnSpeed || this.angle > this.rotationPeriod - returnSpeed) {
      this.angle = 0;
    } 
    // If clockwiseReturnOnly is enabled, always rotate clockwise to return
    else if (this.clockwiseReturnOnly) {
      this.angle += returnSpeed;
      if (this.angle >= this.rotationPeriod) this.angle = 0;
    }
    // Otherwise, take the shortest path (default behavior)
    else if (this.angle > 0 && this.angle < this.rotationPeriod/2) {
      this.angle -= returnSpeed; // Counterclockwise for first half
    } else {
      this.angle += returnSpeed; // Clockwise for second half
      if (this.angle >= this.rotationPeriod) this.angle = 0;
    }
    
    // Update color during return if hue effect enabled
    if (this.hueEffect) {
      this.updateColor();
    }
  }
  
  // Utility methods to toggle modes
  setClockwiseReturn(enabled) {
    this.clockwiseReturnOnly = enabled;
  }
  
  setIndependentHueShift(enabled, type = 'lfo') {
    this.independentHueShift = enabled;
    if (type === 'lfo' || type === 'noise') {
      this.hueShiftType = type;
    }
  }
}