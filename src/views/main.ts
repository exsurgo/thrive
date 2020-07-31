import { html, customElement, property, queryAll } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { onChange, state, State, AppView } from '../state';
import './toolbar';
import './analyze';
import './search';
import './dashboard';

@customElement('app-main')
export class Main extends AppElement {
  @queryAll('main > *') views!: AppElement[];

  init() {
    onChange(State.currentView, (value) => {
      this.selectView(value);
    });
  }

  selectView(view: AppView) {
    for (const o of this.views) {
      if (o.localName.endsWith(view)) o.show();
      else o.hide();
    }
  }

  render() {
    return html`
      <app-toolbar></app-toolbar>
      <main>
        <app-dashboard></app-dashboard>
        <app-analyze></app-analyze>
        <app-search></app-search>
      </main>
    `;
  }

  static css = html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        position: relative;
      }
      app-toolbar {
        min-height: 60px;
      }
      main {
        flex: 1;
        display: flex;
        flex-direction: row;
        height: 100%;
      }
    </style>
  `;
}
