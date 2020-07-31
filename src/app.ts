import {state, State, AppView} from './state';
import {Main} from './views/main';
import './ui/app-element';
import './ui/icon';
import './ui/button';
import './ui/confirm';
import './ui/dialog';
import './views/chart';
import './views/watch-list';
import './views/realtime-price';

let main!: Main;

async function start() {
  main = new Main();
  document.body.append(main);

  // Set initial state
  setTimeout(() => {
    state.currentView = AppView.dashboard;
  }, 100)
}

window.addEventListener('load', start);
