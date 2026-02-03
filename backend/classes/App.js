import { Circle } from './shape-children/Circle.js';
import { Square } from './shape-children/Square.js';

export class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.querySelector('.playground');
        
        // The master list
        this.shapes = []; 
        this.isRunning = true;
    }

    init() {
        if (this.container) {
            this.container.appendChild(this.canvas);
            this.resize();
            this.animate();
            console.log("App Initialized");
        } else {
            console.error("Playground container not found!");
        }
    }

    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        
        return { w: this.canvas.width, h: this.canvas.height };
    }
    addShape(type, customColor, customSize, collisionMode) {
    let newShape;
    let isOverlapping = false;
    let attempts = 0;
    const maxAttempts = (collisionMode === 'on') ? 50 : 1;

    do {
        const color = customColor;

        let x, y;

        if (type === 'circle') {
        const r = customSize / 2;
        x = Math.random() * (this.canvas.width - 2 * r) + r;   
        y = Math.random() * (this.canvas.height - 2 * r) + r; 
        newShape = new Circle(x, y, color, r);
        } else {
        x = Math.random() * (this.canvas.width - customSize);   
        y = Math.random() * (this.canvas.height - customSize); 
        newShape = new Square(x, y, color, customSize);
        }

        isOverlapping = (collisionMode === 'on') ? this.checkSpawnCollision(newShape) : false;
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

      
        this.shapes.forEach(shape => shape.draw(this.ctx));

        requestAnimationFrame(() => this.animate());
    }
    checkSpawnCollision(newItem) {
        return this.shapes.some(existingItem => {
            const r1 = newItem.type === 'circle' ? newItem.radius : newItem.size / 2;
            const r2 = existingItem.type === 'circle' ? existingItem.radius : existingItem.size / 2;

            const x1 = newItem.type === 'circle' ? newItem.x : newItem.x + r1;
            const y1 = newItem.type === 'circle' ? newItem.y : newItem.y + r1;

            const x2 = existingItem.type === 'circle' ? existingItem.x : existingItem.x + r2;
            const y2 = existingItem.type === 'circle' ? existingItem.y : existingItem.y + r2;

            const dx = x1 - x2;
            const dy = y1 - y2;
            const distance = Math.hypot(dx, dy);

            return distance < (r1 + r2);
  });
}
}