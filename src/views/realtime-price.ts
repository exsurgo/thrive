import { html, customElement, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { getRandomDecimal } from '../utils/random';

@customElement('app-realtime-price')
export class RealtimePrice extends AppElement {
  @property() label = 'Price';
  @property() amount!: number;
  @property({type: Number}) min = 100;
  @property({type: Number}) max = 500;

  init() {
    this.amount = getRandomDecimal(this.min, this.max);
    setInterval(() => {
      this.amount = parseFloat((this.amount + getRandomDecimal(1, 3)).toFixed(2));
    }, 3000);
  }

  render() {
    return html`
      <span class="label">${this.label}:</span>
      <span class="amount">$${this.amount}</span>
    `;
  }

  static css = html`
    <style>
      :host {
        display: inline-flex;
        align-items: center;
        align-content: center;
      }
      .label {
        color: #929191;
        margin-right: 10px;
        display: inline-block;
      }
      .amount {
        color: var(--profit);
        font-size: 1.6rem;
      }
    </style>
  `;
}
