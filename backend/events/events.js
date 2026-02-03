export function initListeners(app) {
    const ui = {
        width: document.getElementById('width-val'),
        height: document.getElementById('height-val'),
        color: document.getElementById('color-val'),
        mouse: document.getElementById('mouse-val'),
        idClass: document.getElementById('id-val'),
        count: document.getElementById('count-val'),
        
        addBtn: document.getElementById('add-btn'),
        shapeSelect: document.getElementById('shapes'),
        colorPicker: document.getElementById('color-picker'),
        sizeInput: document.getElementById('size-input'),
        getCollisionState: () =>
        document.querySelector('input[name="collision"]:checked')?.value || 'off'
    };

    ui.addBtn.addEventListener('click', () => {
        const type = ui.shapeSelect.value;
        const color= ui.colorPicker.value;
        const size = parseInt(ui.sizeInput.value);
        
        
        const collisionMode = ui.getCollisionState();



        const count = app.addShape(type,color,size,collisionMode);

        
        if(ui.count)ui.count.innerText = count;
    });

    document.addEventListener('mousemove', (event) => {
        ui.mouse.innerText = `${event.clientX}, ${event.clientY}`;

        const domTarget = event.target;
        let finalData = {};

        if (domTarget === app.canvas) {
            
            const rect = app.canvas.getBoundingClientRect();
            const canvasX = event.clientX - rect.left;
            const canvasY = event.clientY - rect.top;

            let foundShape = null;
            for (let i = app.shapes.length - 1; i >= 0; i--) {
                if (app.shapes[i].isPointInside(canvasX, canvasY)) {
                    foundShape = app.shapes[i];
                    break;
                }
            }

            if (foundShape) {
                app.canvas.style.cursor = 'pointer';
                
                const size = foundShape.type === 'circle' 
                    ? Math.round(foundShape.radius * 2) 
                    : foundShape.size;

                finalData = {
                    width: `${size}px`,
                    height: `${size}px`,
                    color: foundShape.color,
                    idClass: `${foundShape.id} (Shape)`
                };
            } else {
                app.canvas.style.cursor = 'default';
                finalData = getDomElementInfo(domTarget);
                finalData.idClass = "Canvas Element"; 
            }

        } else {
            app.canvas.style.cursor = 'default';
            finalData = getDomElementInfo(domTarget);
        }

        updateLegend(ui, finalData);
    });
}

function getDomElementInfo(element) {
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);

    const id = element.id ? `#${element.id}` : 'no-id';
    const cls = element.className ? `.${element.className}` : 'no-class';

    return {
        width: `${Math.round(rect.width)}px`,
        height: `${Math.round(rect.height)}px`,
        color: styles.backgroundColor, 
        idClass: `${id}, ${cls}` 
    };
}

function updateLegend(ui, data) {
    ui.width.innerText = data.width;
    ui.height.innerText = data.height;
    
    ui.color.innerText = data.color;
    ui.color.style.color = (data.color === 'rgba(0, 0, 0, 0)' || data.color === 'transparent') 
        ? 'black' 
        : data.color;

    ui.idClass.innerText = data.idClass;
}