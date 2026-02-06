import { Shape } from '../Shape';

export class Circle extends Shape {
  radius: number;

  constructor(x: number, y: number, color: string, radius: number) {
    super(x, y, color, 'circle');
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  isPointInside(mouseX: number, mouseY: number): boolean {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.hypot(dx, dy);
    return dist <= this.radius;
  }
}
