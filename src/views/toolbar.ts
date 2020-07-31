import { html, customElement, queryAll, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { onChange, State, state, AppView } from '../state';
import { getRandomDecimal } from '../utils/random';

@customElement('app-toolbar')
export class Toolbar extends AppElement {
  @property() pl!: number;
  @queryAll('.toolbar-button') buttons!: HTMLElement[];

  init() {
    onChange(State.currentView, (value) => {
      this.selectView(value);
    });

    this.startRandomPL();
  }

  selectView(view: AppView) {
    for (const o of this.buttons) {
      o.classList.toggle('selected', o.id == view);
    }
  }

  startRandomPL() {
    this.pl = getRandomDecimal(500, 1000);
    setInterval(() => {
      this.pl = parseFloat((this.pl + getRandomDecimal(1, 3)).toFixed(2));
    }, 3000);
  }

  render() {
    return html`
      <div class="left">
        <span class="logo">THRIVE</span>
        <div id="dashboard" class="toolbar-button" @click="${() => state.currentView = AppView.dashboard}">
          <ui-icon icon="pie_chart"></ui-icon> Dashboard
        </div>        
        <div id="analyze" class="toolbar-button" @click="${() => state.currentView = AppView.analyze}">
          <ui-icon icon="trending_up"></ui-icon> Analyze
        </div>      
        <div id="search" class="toolbar-button" @click="${() => state.currentView = AppView.search}">
          <ui-icon icon="search"></ui-icon> Search
        </div>
        <div class="toolbar-button">
          <ui-icon icon="add_alert"></ui-icon> Alerts
        </div>
        <div class="toolbar-button">
          <ui-icon icon="security"></ui-icon> Risks
        </div>
        <div class="toolbar-button">
          <ui-icon icon="live_help"></ui-icon> Tutorials
        </div>
      </div>
      <div class="right">
        <span class="pl-label">Todays P/L:</span><span class="pl-amount">$${this.pl}</span>
      </div>
    `;
  }

  static css = html`
    <style>
      :host {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #aaa;
        background: var(--background-color);
      }
      .logo {
        font-weight: 500;
        font-size: 1.3rem;
        color: #444;
        margin-right: 50px;
      }
      .toolbar-button {
        min-width: 90px;
        display: inline-flex;
        flex-direction: column;
        cursor: pointer;
        justify-content: center;
        text-align: center;
        border-left: 1px solid #ddd;
        height: 100%;
        background-color: var(--background-color);
        transition: background-color .3s;
        padding: 0 5px 0 5px;
      }
      :host(:last-child.toolbar-button) {
        border-right: 1px solid #ddd;
      }
      .toolbar-button:hover, .toolbar-button.selected {
        color: var(--primary-color);
        --icon-color: var(--primary-color);
        background-color: #fff;
      }
      .left {
        display: flex;
        align-items: center;
        flex: 1;
        padding-left: 10px;
      }
      .right {
        display: flex;
        align-items: center;
        flex-shrink: 1;
        padding-right: 10px
      }
      .pl-label {
        color: #929191;
        margin-right: 10px;
        display: inline-block;
      }
      .pl-amount {
        color: var(--profit);
        font-size: 1.6rem;
      }
    </style>
  `;
}
