import { App } from './classes/App.js';
import { initListeners } from './events/events.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    app.init();
    
    initListeners(app);
});