import { html, customElement, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { IStock, getWatchList } from '../libs/data';
import { state } from '../state';

@customElement('app-watch-list')
export class WatchList extends AppElement {
  @property({type: Array}) stocks?: IStock[];

  async init() {
    this.stocks = await getWatchList();
  }

  render() {
    if (!this.stocks) {
      return html`
        <button>Find Stocks</button>
      `;
    }

    return html`
      ${this.stocks?.map((stock) => {
        return html`
          <div id="${stock.symbol}" class="item" @click="${this.onSelect}">
            <div class="item-title" style="color: var(${stock.loss ? '--loss' : '--profit'})">${stock.name}</div>
            <div class="item-chart">
              <app-chart symbol="${stock.symbol}"></app-chart>
            </div>
          </div>
        `;
      })}
    `;
  }

  onSelect(e) {
    state.selectedStock = e.currentTarget.id;
  }

  static css = html`
    <style>
      :host {
        display: block;
      }
      .item {
        height: 150px;
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
        cursor: pointer;
      }
      .item-title {
        font-size: 1.2rem;
      }
      .item-chart {
        flex-grow: 1;
      }
      app-chart {
        pointer-events: none;
      }
    </style>
  `;
}
