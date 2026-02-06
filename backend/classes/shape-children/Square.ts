import { Shape } from '../Shape';

export class Square extends Shape {
  size: number;

  constructor(x: number, y: number, color: string, size: number) {
    super(x, y, color, 'square');
    this.size = size;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  isPointInside(mouseX: number, mouseY: number): boolean {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.size &&
      mouseY >= this.y &&
      mouseY <= this.y + this.size
    );
  }
}
