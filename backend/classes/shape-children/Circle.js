import { Shape } from '../Shape.js';

export class Circle extends Shape {

    constructor(x, y, color, radius) {
        super(x, y, color, 'circle');
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
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist <= this.radius;
    }
}