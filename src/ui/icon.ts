import {customElement, html, property} from 'lit-element';
import {AppElement} from './app-element';

const DEFAULT_ICON = 'play_arrow';

@customElement('ui-icon')
export class Icon extends AppElement {
  @property() icon = DEFAULT_ICON;

  render() {
    return html`${this.icon}`;
  }

  static css = html`
    <style>
      :host {
        font-family: 'Material Icons' !important;
        color: var(--icon-color);
        font-size: var(--icon-size, 24px);
        font-weight: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        text-align: center;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        text-rendering: optimizeLegibility;
        transition: color .3s;
        cursor: pointer;
      } 
      :host(:hover) {
        color: var(--primary-color);
      }
      host(:hover) > app-icon {
        app-icon {
          color: var(--primary-color);
        }      
      }
    </style>
  `;
}
