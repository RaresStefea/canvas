import { App } from './App';
import { initListeners } from './events/events';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  initListeners(app);
});
