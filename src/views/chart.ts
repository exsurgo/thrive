/**
 * @see
 * - /node_modules/lightweight-charts/dist/typings.d.ts
 * - https://www.tradingview.com/lightweight-charts/
 * - https://github.com/tradingview/lightweight-charts/
 */

import { html, customElement, property, css } from 'lit-element';
import { AppElement } from '../ui/app-element';
import { createChart, CrosshairMode, IChartApi } from 'lightweight-charts';
import { getData } from '../libs/data';

@customElement('app-chart')
export class Chart extends AppElement {
  @property() symbol: string = '';
  @property({type: Number}) limit: number = 50;
  @property({type: Boolean}) showVolume = false;

  private chart!: IChartApi;
  private currentSymbol: string = '';
  private chartRen = () => this.renderChart();

  async init() {
    this.initAutoResize();
    this.debounce(this.chartRen);
  }

  update(props) {
    super.update(props);
    this.debounce(this.chartRen);
  }

  async renderChart() {
    const {currentSymbol, symbol, limit} = this;
    if (!symbol || currentSymbol === symbol) return;
    const data = await getData(symbol, limit);

    if (data && data.prices.length) {

      // Chart config
      this.empty();
      this.chart = createChart(this, {
        width: this.clientWidth,
        height: this.clientHeight,
        rightPriceScale: {
          scaleMargins: {
            top: 0.3,
            bottom: 0.25,
          },
          borderVisible: false,
        },
        layout: {
          backgroundColor: '#131722',
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: {
            color: 'rgba(42, 46, 57, 0)',
          },
          horzLines: {
            color: 'rgba(42, 46, 57, 0.6)',
          },
        },
      });

      // Area data
      const areaSeries = this.chart.addAreaSeries({
        topColor: 'rgba(38,198,218, 0.56)',
        bottomColor: 'rgba(38,198,218, 0.04)',
        lineColor: 'rgba(38,198,218, 1)',
        lineWidth: 2,
      });
      areaSeries.setData(data.prices);

      // Volume data
      if (this.showVolume && data.volumes && data.volumes.length) {
        const volumeSeries = this.chart.addHistogramSeries({
          color: 'rgba(76, 175, 80, 0.5)',
          priceFormat: {
            type: 'volume',
          },
          priceLineVisible: false,
          overlay: true,
          scaleMargins: {
            top: 0.85,
            bottom: 0,
          },
        } as any);
        volumeSeries.setData(data.volumes);
      }
    }

    this.currentSymbol = symbol;
  }

  private initAutoResize() {
    const observer = new (window as any).ResizeObserver(() => {
      this.chart?.resize(this.clientWidth, this.clientHeight);
    });
    observer.observe(this);
    window.addEventListener('resize', () => {
      this.chart?.resize(this.clientWidth, this.clientHeight);
    });
  }

  static css = html`
    <style>
      :host {
        border: 1px solid #aaa;
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>
  `;
}
