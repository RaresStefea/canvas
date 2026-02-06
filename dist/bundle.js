// backend/classes/Shape.ts
var Shape = class {
  constructor(x, y, color, type) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.id = Math.random().toString(16).slice(2, 10);
  }
  draw(ctx) {
    console.warn("draw() not implemented on base Shape");
  }
  isPointInside(mouseX, mouseY) {
    return false;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
};

// backend/classes/shape-children/Circle.ts
var Circle = class extends Shape {
  constructor(x, y, color, radius) {
    super(x, y, color, "circle");
    this.radius = radius;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  isPointInside(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.hypot(dx, dy);
    return dist <= this.radius;
  }
};

// backend/classes/shape-children/Square.ts
var Square = class extends Shape {
  constructor(x, y, color, size) {
    super(x, y, color, "square");
    this.size = size;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  isPointInside(mouseX, mouseY) {
    return mouseX >= this.x && mouseX <= this.x + this.size && mouseY >= this.y && mouseY <= this.y + this.size;
  }
};

// backend/App.ts
var App = class {
  constructor() {
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("2D context not supported");
    this.ctx = ctx;
    this.container = document.querySelector(".playground");
    this.shapes = [];
    this.isRunning = true;
  }
  init() {
    if (this.container) {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      this.container.appendChild(this.canvas);
      this.resize();
      window.addEventListener("resize", () => this.resize());
      this.animate();
      console.log("App Initialized");
    } else {
      console.error("Playground container not found!");
    }
  }
  resize() {
    if (!this.container) return { w: 0, h: 0 };
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    return { w: this.canvas.width, h: this.canvas.height };
  }
  addShape(type, customColor, customSize, collisionMode) {
    let newShape;
    let isOverlapping = false;
    let attempts = 0;
    const maxAttempts = collisionMode === "on" ? 50 : 1;
    do {
      const color = customColor;
      let x, y;
      if (type === "circle") {
        const r = customSize / 2;
        x = Math.random() * (this.canvas.width - 2 * r) + r;
        y = Math.random() * (this.canvas.height - 2 * r) + r;
        newShape = new Circle(x, y, color, r);
      } else {
        x = Math.random() * (this.canvas.width - customSize);
        y = Math.random() * (this.canvas.height - customSize);
        newShape = new Square(x, y, color, customSize);
      }
      isOverlapping = collisionMode === "on" ? this.checkSpawnCollision(newShape) : false;
      attempts++;
    } while (isOverlapping && attempts < maxAttempts);
    if (!isOverlapping) {
      this.shapes.push(newShape);
    } else {
      console.warn("Can't find space for a new shape!!");
    }
    return this.shapes.length;
  }
  animate() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapes.forEach((shape) => shape.draw(this.ctx));
    requestAnimationFrame(() => this.animate());
  }
  checkSpawnCollision(newItem) {
    return this.shapes.some((existingItem) => {
      const r1 = newItem.type === "circle" ? newItem.radius : newItem.size / 2;
      const r2 = existingItem.type === "circle" ? existingItem.radius : existingItem.size / 2;
      const x1 = newItem.type === "circle" ? newItem.x : newItem.x + r1;
      const y1 = newItem.type === "circle" ? newItem.y : newItem.y + r1;
      const x2 = existingItem.type === "circle" ? existingItem.x : existingItem.x + r2;
      const y2 = existingItem.type === "circle" ? existingItem.y : existingItem.y + r2;
      const dx = x1 - x2;
      const dy = y1 - y2;
      const distance = Math.hypot(dx, dy);
      return distance < r1 + r2;
    });
  }
};

// backend/events/events.ts
function initListeners(app) {
  const ui = {
    width: document.getElementById("width-val"),
    height: document.getElementById("height-val"),
    color: document.getElementById("color-val"),
    mouse: document.getElementById("mouse-val"),
    idClass: document.getElementById("id-val"),
    count: document.getElementById("count-val"),
    addBtn: document.getElementById("add-btn"),
    shapeSelect: document.getElementById("shapes"),
    colorPicker: document.getElementById("color-picker"),
    sizeInput: document.getElementById("size-input"),
    getCollisionState: () => document.querySelector('input[name="collision"]:checked')?.value ?? "off"
  };
  if (ui.addBtn) {
    ui.addBtn.addEventListener("click", () => {
      const type = ui.shapeSelect?.value || "square";
      const color = ui.colorPicker?.value || "#000000";
      const size = parseInt(ui.sizeInput?.value || "50", 10);
      const collisionMode = ui.getCollisionState();
      const count = app.addShape(type, color, size, collisionMode);
      if (ui.count) ui.count.innerText = String(count);
    });
  }
  let isDragging = false;
  let dragShape = null;
  let offsetX = 0;
  let offsetY = 0;
  app.canvas.addEventListener("mousedown", (event) => {
    const rect = app.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    for (let i = app.shapes.length - 1; i >= 0; i--) {
      const s = app.shapes[i];
      if (s.isPointInside(canvasX, canvasY)) {
        isDragging = true;
        dragShape = s;
        offsetX = canvasX - s.x;
        offsetY = canvasY - s.y;
        app.shapes.splice(i, 1);
        app.shapes.push(dragShape);
        break;
      }
    }
  });
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  window.addEventListener("mousemove", (event) => {
    const rect = app.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    if (ui.mouse) ui.mouse.innerText = `${Math.round(canvasX)}, ${Math.round(canvasY)}`;
    if (isDragging && dragShape) {
      if (dragShape instanceof Circle) {
        const newX = clamp(canvasX - offsetX, dragShape.radius, app.canvas.width - dragShape.radius);
        const newY = clamp(canvasY - offsetY, dragShape.radius, app.canvas.height - dragShape.radius);
        dragShape.setPosition(newX, newY);
      } else if (dragShape instanceof Square) {
        const newX = clamp(canvasX - offsetX, 0, app.canvas.width - dragShape.size);
        const newY = clamp(canvasY - offsetY, 0, app.canvas.height - dragShape.size);
        dragShape.setPosition(newX, newY);
      } else {
        dragShape.setPosition(canvasX - offsetX, canvasY - offsetY);
      }
      app.canvas.style.cursor = "grabbing";
      return;
    }
    let foundShape = null;
    for (let i = app.shapes.length - 1; i >= 0; i--) {
      if (app.shapes[i].isPointInside(canvasX, canvasY)) {
        foundShape = app.shapes[i];
        break;
      }
    }
    if (foundShape) {
      app.canvas.style.cursor = "pointer";
      const size = foundShape instanceof Circle ? Math.round(foundShape.radius * 2) : foundShape instanceof Square ? foundShape.size : 0;
      const finalData = {
        width: `${size}px`,
        height: `${size}px`,
        color: foundShape.color,
        idClass: `${foundShape.id} (Shape)`
      };
      updateLegend(ui, finalData);
    } else {
      app.canvas.style.cursor = "default";
      updateLegend(ui, {
        width: `${Math.round(app.canvas.width)}px`,
        height: `${Math.round(app.canvas.height)}px`,
        color: window.getComputedStyle(app.canvas).backgroundColor || "transparent",
        idClass: "Canvas Element"
      });
    }
  });
  window.addEventListener("mouseup", () => {
    isDragging = false;
    dragShape = null;
    app.canvas.style.cursor = "default";
  });
}
function updateLegend(ui, data) {
  if (ui.width) ui.width.innerText = data.width;
  if (ui.height) ui.height.innerText = data.height;
  if (ui.color) {
    ui.color.innerText = data.color;
    ui.color.style.color = data.color === "rgba(0, 0, 0, 0)" || data.color === "transparent" ? "black" : data.color;
  }
  if (ui.idClass) ui.idClass.innerText = data.idClass;
}

// backend/index.ts
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
  initListeners(app);
});
//# sourceMappingURL=bundle.js.map
