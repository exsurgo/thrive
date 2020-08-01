import { html, customElement, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { getWatchList, IStock, getCompanyNews, INews } from '../libs/data';

const LEFT_WIDTH = 250;
const NEWS_STOCKS = ['AMZN', 'FB', 'GOOG', 'AAPL'];
const NEWS_LENGTH = 15;

@customElement('app-dashboard')
export class Dashboard extends AppElement {
  @property() news: INews[] = [];
  @property({type: Array}) stocks?: IStock[];

  async init() {
    this.news = await getCompanyNews(['AMZ', 'FB', 'GOOG'], NEWS_LENGTH);
    this.stocks = await getWatchList();
  }

  render() {
    return html`
      <div class="left-pane">
        <h2>Market News</h2>
        ${this.news!.map(o => html`
          <div class="news flex">
            <img src="${o.image_url}">
            <div class="grow">
              <a href="${o.news_url}">${o.title}</a>
              <p>${o.text.substring(0, 100)} ...</p>
            </div>
          </div>  
        `)}
      </div>
      <div class="right-pane">
        <h2>My Portfolio</h2>
        <hr>
        <img style="width: 500px" src="/assets/portfolio.png">
        <h2>Trending Stocks</h2>
        <hr>
        <div style="padding: 10px;">
          ${this.stocks?.map((stock) => {
            return html`
                <div id="${stock.symbol}" class="item">
                  <div class="item-title">${stock.name}</div>
                  <div class="item-chart">
                    <app-chart symbol="${stock.symbol}"></app-chart>
                  </div>
                </div>
              `;
          })}
        </div>        
      </div>
    `;
  }

  static css = html`
    <style>
      :host {
        display: flex;
        flex-direction: row;
        height: 100%;
        padding: 20px;
      }
      .left-pane {
        flex-grow: 1;
        padding: 14px;
        overflow: auto;
        width: 100%;
      }
      .news {
        margin-bottom: 10px;
      }
      .news img {
        width: 200px;
        height: 130px;
        margin-right: 10px;
        border: 1px solid #ddd;
      }
      .news a {
        font-size: 1em;
      }
      .right-pane {
        flex-grow: 1;
        padding: 14px;
        width: 100%;
        overflow: auto;
      }
      
      .item {
        height: 130px;
        width: 250px;
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
        cursor: pointer;
        float: left;
        margin-left: 15px;
      }
      .item-title {
        font-size: 1.2rem;
      }
      .item-chart {
        flex-grow: 1;
      }
    </style>
  `;
}
