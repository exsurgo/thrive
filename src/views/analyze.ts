import { html, customElement} from 'lit-element';
import { AppElement } from '../ui/app-element';
import './watch-list';
import './details';

const LEFT_WIDTH = 250;

@customElement('app-analyze')
export class Analyze extends AppElement {
  render() {
    return html`
      <div class="left-pane">
        <app-watch-list></app-watch-list>
      </div>
      <div class="content">
        <app-details></app-details>
      </div>
    `;
  }

  static css = html`
    <style>
      :host {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
      }
      .left-pane {
        min-width: ${LEFT_WIDTH}px;
        background: var(--background-color);
        overflow-y: auto;
        padding: 12px 20px 80px 12px;
      }
      .content {
        flex: 1;
        padding: 12px;
      }
    </style>
  `;
}
