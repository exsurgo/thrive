import { html, customElement, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { onChange, State, state } from '../state';

const LEFT_WIDTH = 250;

@customElement('app-search')
export class Search extends AppElement {
  render() {
    return html`
      <div class="left-pane">
        Search
      </div>
      <div class="content">
        Content
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
