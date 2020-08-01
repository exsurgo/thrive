import { html, customElement, property } from 'lit-element';
import { Dialog } from '../ui/dialog';
import { onChange, State, state } from '../state';
import 'carbon-custom-elements/es/components/input/input';
import 'carbon-custom-elements/es/components/number-input/number-input';


@customElement('app-buy')
export class Buy extends Dialog {
  header = 'Buy Stock'
  submitText = 'Buy';

  render() {
    return super.render(html`
      <div class="center row">
        <app-realtime-price></app-realtime-price>
      </div>
      <div class="row">
        <label>$ Amount:
          <bx-number-input id="amount" value="10000"></bx-number-input>
        </label>
      </div>
      <div class="row">
        <label>$ Maximum allowed Loss: 
          <bx-number-input id="loss" value="500"></bx-number-input>
          A stop loss order will be automatically created.
        </label>
      </div>
    `);
  }

  static css = html`
    ${Dialog.css}
    <style>
      :host {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
      }
      .center {
        text-align: center;
      }
      .row {
        padding: 10px;
      }
      bx-number-input {
        max-width: 80px;
      }
    </style>
  `;
}
