import { html, customElement, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { onChange, State, state } from '../state';
import { IStock, getTestData } from '../libs/data';

@customElement('app-stock-preview')
export class View extends AppElement {
  @property({type: Object}) stock!: IStock;

  render() {
    return this.stock && html`
      <div class="title">
        ${this.stock.name}
      </div>
      <div class="chart">
        <app-chart symbol="${this.stock.symbol}"></app-chart>
      </div>
    `;
  }

  static css = html`
    <style>
      :host {
        display: inline-flex;
        flex-direction: column;
        width: 300px;
        height: 200px;
        margin: 20px 20px 0 0;
      }
      .title {
        font-size: 1.2rem;
      }
      .chart {
        flex-grow: 1;
        height: 100%;
      }
    </style>
  `;
}
