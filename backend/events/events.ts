import type { App } from "../App";
import { Circle } from "../classes/shape-children/Circle";
import { Square } from "../classes/shape-children/Square";
import { Shape } from "../classes/Shape";

type UI = {
  width: HTMLElement | null;
  height: HTMLElement | null;
  color: HTMLElement | null;
  mouse: HTMLElement | null;
  idClass: HTMLElement | null;
  count: HTMLElement | null;
  addBtn: HTMLButtonElement | null;
  shapeSelect: HTMLSelectElement | null;
  colorPicker: HTMLInputElement | null;
  sizeInput: HTMLInputElement | null;
  getCollisionState: () => string;
};

export function initListeners(app: App) {
  const ui: UI = {
    width: document.getElementById("width-val"),
    height: document.getElementById("height-val"),
    color: document.getElementById("color-val"),
    mouse: document.getElementById("mouse-val"),
    idClass: document.getElementById("id-val"),
    count: document.getElementById("count-val"),
    addBtn: document.getElementById("add-btn") as HTMLButtonElement | null,
    shapeSelect: document.getElementById("shapes") as HTMLSelectElement | null,
    colorPicker: document.getElementById(
      "color-picker",
    ) as HTMLInputElement | null,
    sizeInput: document.getElementById("size-input") as HTMLInputElement | null,
    getCollisionState: () =>
      document.querySelector<HTMLInputElement>(
        'input[name="collision"]:checked',
      )?.value ?? "off",
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
  let dragShape: Shape | Circle | Square | null = null;
  let offsetX = 0;
  let offsetY = 0;

  app.canvas.addEventListener("mousedown", (event: MouseEvent) => {
    const rect = app.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    for (let i = app.shapes.length - 1; i >= 0; i--) {
      const s = app.shapes[i];
      if (s.isPointInside(canvasX, canvasY)) {
        isDragging = true;
        dragShape = s as Shape | Circle | Square;
        offsetX = canvasX - s.x;
        offsetY = canvasY - s.y;
        app.shapes.splice(i, 1);
        app.shapes.push(dragShape);
        break;
      }
    }
  });

  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
  }

  window.addEventListener("mousemove", (event: MouseEvent) => {
    const rect = app.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    if (ui.mouse)
      ui.mouse.innerText = `${Math.round(canvasX)}, ${Math.round(canvasY)}`;

    if (isDragging && dragShape) {
      if (dragShape instanceof Circle) {
        const newX = clamp(
          canvasX - offsetX,
          dragShape.radius,
          app.canvas.width - dragShape.radius,
        );
        const newY = clamp(
          canvasY - offsetY,
          dragShape.radius,
          app.canvas.height - dragShape.radius,
        );
        dragShape.setPosition(newX, newY);
      } else if (dragShape instanceof Square) {
        const newX = clamp(
          canvasX - offsetX,
          0,
          app.canvas.width - dragShape.size,
        );
        const newY = clamp(
          canvasY - offsetY,
          0,
          app.canvas.height - dragShape.size,
        );
        dragShape.setPosition(newX, newY);
      } else {
        dragShape.setPosition(canvasX - offsetX, canvasY - offsetY);
      }
      app.canvas.style.cursor = "grabbing";
      return;
    }

    let foundShape: Shape | Circle | Square | null = null;
    for (let i = app.shapes.length - 1; i >= 0; i--) {
      if (app.shapes[i].isPointInside(canvasX, canvasY)) {
        foundShape = app.shapes[i] as Shape | Circle | Square;
        break;
      }
    }

    if (foundShape) {
      app.canvas.style.cursor = "pointer";
      const size =
        foundShape instanceof Circle
          ? Math.round(foundShape.radius * 2)
          : foundShape instanceof Square
            ? foundShape.size
            : 0;
      const finalData = {
        width: `${size}px`,
        height: `${size}px`,
        color: foundShape.color,
        idClass: `${foundShape.id} (Shape)`,
      };
      updateLegend(ui, finalData);
    } else {
      app.canvas.style.cursor = "default";
      updateLegend(ui, {
        width: `${Math.round(app.canvas.width)}px`,
        height: `${Math.round(app.canvas.height)}px`,
        color:
          window.getComputedStyle(app.canvas).backgroundColor || "transparent",
        idClass: "Canvas Element",
      });
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    dragShape = null;
    app.canvas.style.cursor = "default";
  });
}

function updateLegend(ui: any, data: any) {
  if (ui.width) ui.width.innerText = data.width;
  if (ui.height) ui.height.innerText = data.height;
  if (ui.color) {
    ui.color.innerText = data.color;
    ui.color.style.color =
      data.color === "rgba(0, 0, 0, 0)" || data.color === "transparent"
        ? "black"
        : data.color;
  }
  if (ui.idClass) ui.idClass.innerText = data.idClass;
}
