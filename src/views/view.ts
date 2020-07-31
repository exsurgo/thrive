import { html, customElement, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { onChange, State, state } from '../state';

@customElement('app-view')
export class View extends AppElement {
  @property() property = 'property';

  init() {

  }

  render() {
    return html`

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
    </style>
  `;
}
