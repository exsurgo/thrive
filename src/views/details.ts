import { state, onChange, State } from '../state';
import { getStock, getCompany, getWatchList, IStock, ICompany } from '../libs/data';
import { html, customElement, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { Buy } from './buy';
import 'carbon-custom-elements/es/components/tabs/tabs';
import 'carbon-custom-elements/es/components/tabs/tab';

const LIMIT = 1000;

@customElement('app-details')
export class Details extends AppElement {
  @property() stock!: IStock;
  @property() company!: ICompany;

  async init() {
    onChange(State.selectedStock, async (value: string) => {
      const [stock, company] = await Promise.all([getStock(value), getCompany(value)]);
      this.stock = stock;
      this.company = company;
    });

    // Set as first stock on watch list
    if (!state.selectedStock) {
      const stocks = await getWatchList();
      if (stocks.length) state.selectedStock = stocks[0].symbol;
    }
  }

  render() {
    return this.stock && html`
      <div class="header">
        ${this.stock.name} (${this.stock.symbol})
        <ui-button class="buy-button" @click="${() => Buy.open()}">BUY</ui-button>
      </div>
      <bx-tabs value="chart">
        <bx-tab target="chart" value="chart">Chart</bx-tab>
        <bx-tab target="overview" value="overview">Overview</bx-tab>
        <bx-tab target="fundamentals" value="fundamentals">Fundamentals</bx-tab>
      </bx-tabs>
      <div class="content">
        <div id="chart" hidden>
          <app-chart
            class="chart" 
            symbol="${this.stock.symbol}"
            limit="${LIMIT}"
            showVolume
          ></app-chart>
        </div>
        <div id="overview" hidden>
          <h1>${this.company!.Name}</h1>
          <table>
            <tr><td class="label">Asset Type</td><td class="content">${this.company.AssetType}</td></tr>
            <tr><td class="label">Exchange</td><td class="content">${this.company.Exchange}</td></tr>
            <tr><td class="label">Country</td><td class="content">${this.company.Country}</td></tr>
            <tr><td class="label">Industry</td><td class="content">${this.company.Industry}</td></tr>
            <tr><td class="label">Address</td><td class="content">${this.company.Address}</td></tr>
            <tr><td class="label">Employees</td><td class="content">${this.company.FullTimeEmployees}</td></tr>
          </table>
          <p>${this.company.Description}</p>
        </div>
        <div id="fundamentals" hidden>
        <table>
            <tr><td class="label">PERatio</td><td class="content">${this.company.PERatio}</td></tr>
            <tr><td class="label">PEGRatio</td><td class="content">${this.company.PEGRatio}</td></tr>
            <tr><td class="label">DividendPerShare</td><td class="content">${this.company.DividendPerShare}</td></tr>
            <tr><td class="label">DividendYield</td><td class="content">${this.company.DividendYield}</td></tr>
            <tr><td class="label">ProfitMargin</td><td class="content">${this.company.ProfitMargin}</td></tr>
            <tr><td class="label">PayoutRatio</td><td class="content">${this.company.PayoutRatio}</td></tr>
          </table>
        </div>
      </div>
    `;
  }

  static css = html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .header {
        font-size: 1.4rem;
        position: relative;
      }
      .buy-button {
        position: absolute;
        right: 10px;
      }
      .content {
        flex: 1;
        padding-top: 10px;
      }
      .content > * {
        height: 100%;
      }
      td.label {
        font-weight: bold;
        padding-right: 20px;
      }
    </style>
  `;
}
