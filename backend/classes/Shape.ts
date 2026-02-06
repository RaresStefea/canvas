export type ShapeType = 'circle' | 'square' | 'triangle' | 'oval';

export class Shape {
  x: number;
  y: number;
  color: string;
  type: ShapeType;
  id: string;

  constructor(x: number, y: number, color: string, type: ShapeType) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.id = Math.random().toString(16).slice(2, 10);
  }

  draw(ctx: CanvasRenderingContext2D) {
    console.warn('draw() not implemented on base Shape');
  }

  isPointInside(mouseX: number, mouseY: number): boolean {
    return false;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
