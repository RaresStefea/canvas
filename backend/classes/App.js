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

    addShape(type) {
        const x = Math.random() * (this.canvas.width - 60) + 30; 
        const y = Math.random() * (this.canvas.height - 60) + 30;
        
        const color = `hsl(${Math.random() * 360}, 70%, 50%)`;

        let newShape;

        if (type === 'circle') {
            newShape = new Circle(x, y, color, 30); 
        } else {
            newShape = new Square(x, y, color, 60); 
        }

        this.shapes.push(newShape);
        
        return this.shapes.length; 
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      
        this.shapes.forEach(shape => shape.draw(this.ctx));

        requestAnimationFrame(() => this.animate());
    }
}