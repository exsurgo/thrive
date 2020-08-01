import { onChange, State, state } from '../state';
import { IStock, getWatchList } from '../libs/data';
import { html, customElement, property } from 'lit-element';
import { AppElement } from '../ui/app-element';
import './stock-preview';
import 'carbon-custom-elements/es/components/input/input';
import 'carbon-custom-elements/es/components/search/search';
import 'carbon-custom-elements/es/components/number-input/number-input';
import 'carbon-custom-elements/es/components/multi-select/multi-select';
import 'carbon-custom-elements/es/components/dropdown/dropdown';
import 'carbon-custom-elements/es/components/dropdown/dropdown-item';
import 'carbon-custom-elements/es/components/slider/slider';
import 'carbon-custom-elements/es/components/toggle/toggle';
import 'carbon-custom-elements/es/components/radio-button/radio-button';

const LEFT_WIDTH = 250;

@customElement('app-search')
export class Search extends AppElement {
  @property({type: Array}) stocks: IStock[] = [];

  async init() {
    this.stocks = await getWatchList();
  }

  render() {
    return html`
      <div class="left-pane">
        <bx-radio-button-group id="type" label-text="Type">
          <bx-radio-button value="Momentum" label-text="Momentum"></bx-radio-button>
          <bx-radio-button value="Trending" label-text="Trending"></bx-radio-button>
          <bx-radio-button value="Value" label-text="Value"></bx-radio-button>
        </bx-radio-button-group>
        <bx-search id="search" label-text="Search"></bx-search>
        <bx-dropdown id="industry" label-text="Industry">
          <bx-dropdown-item value="technology">Technology</bx-dropdown-item>
          <bx-dropdown-item value="communications">Communications</bx-dropdown-item>
          <bx-dropdown-item value="finance">Finance</bx-dropdown-item>
          <bx-dropdown-item value="real-estate">Real estate</bx-dropdown-item>
          <bx-dropdown-item value="manufacturing">Manufacturing</bx-dropdown-item>
          <bx-dropdown-item value="retail">Retail</bx-dropdown-item>
          <bx-dropdown-item value="transportation">Transportation</bx-dropdown-item>
        </bx-dropdown>
        <bx-dropdown id="activity" label-text="Activity">
          <bx-dropdown-item value="momentum">Momentum</bx-dropdown-item>
          <bx-dropdown-item value="trending">Trending</bx-dropdown-item>
          <bx-dropdown-item value="high-volume">High Volume</bx-dropdown-item>
        </bx-dropdown>
      </div>
      <div class="content">
        ${this.stocks?.map(o => html`<app-stock-preview .stock="${o}"></app-stock-preview>`)}
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
      .left-pane > * {
        margin: 20px 0;
      }
      .content {
        flex: 1;
        padding: 20px;
      }
      #type {
        margin-bottom: 35px;
      }
      bx-dropdown {
        display: block;
      }
    </style>  
  `;
}
