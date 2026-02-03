import { Shape } from '../Shape.js';

export class Square extends Shape {
    constructor(x, y, color, size) {
        super(x, y, color, 'square');
        this.size = size;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    isPointInside(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.size &&
            mouseY >= this.y &&
            mouseY <= this.y + this.size
        );
    }
}