export class Shape {
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        
        this.id = Math.random().toString(16).slice(2, 10);
    }
    draw(ctx) {
        console.warn('draw() not implemented on base Shape');
    }

    isPointInside(mouseX, mouseY) {
        return false;
    }
}
