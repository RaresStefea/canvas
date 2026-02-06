import { Circle } from './classes/shape-children/Circle';
import { Square } from './classes/shape-children/Square';
import type { Shape } from './classes/Shape';

export class App {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  container: HTMLElement | null;
  shapes: Shape[];
  isRunning: boolean;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not supported');
    this.ctx = ctx;
    this.container = document.querySelector('.playground');
    this.shapes = [];
    this.isRunning = true;
  }

  init() {
    if (this.container) {
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.container.appendChild(this.canvas);
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.animate();
      console.log('App Initialized');
    } else {
      console.error('Playground container not found!');
    }
  }

  resize() {
    if (!this.container) return { w: 0, h: 0 };
    // match drawing buffer to display size for crisp rendering
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    return { w: this.canvas.width, h: this.canvas.height };
  }

  addShape(type: string, customColor: string, customSize: number, collisionMode: string) {
    let newShape: any;
    let isOverlapping = false;
    let attempts = 0;
    const maxAttempts = collisionMode === 'on' ? 50 : 1;

    do {
      const color = customColor;
      let x: number, y: number;

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

      isOverlapping = collisionMode === 'on' ? this.checkSpawnCollision(newShape) : false;
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

  checkSpawnCollision(newItem: any) {
    return this.shapes.some((existingItem: any) => {
      const r1 = newItem.type === 'circle' ? newItem.radius : newItem.size / 2;
      const r2 = existingItem.type === 'circle' ? existingItem.radius : existingItem.size / 2;

      const x1 = newItem.type === 'circle' ? newItem.x : newItem.x + r1;
      const y1 = newItem.type === 'circle' ? newItem.y : newItem.y + r1;

      const x2 = existingItem.type === 'circle' ? existingItem.x : existingItem.x + r2;
      const y2 = existingItem.type === 'circle' ? existingItem.y : existingItem.y + r2;

      const dx = x1 - x2;
      const dy = y1 - y2;
      const distance = Math.hypot(dx, dy);

      return distance < r1 + r2;
    });
  }
}
