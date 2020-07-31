/** @see https://alpaca.markets/docs/api-documentation/api-v2/market-data/streaming/ */

import { ALPACA_KEY, ALPACA_SECRET } from '../secure';

const STREAM_URL = 'wss://data.alpaca.markets/stream';

export interface Quote {
  symbol: string;
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
  time: number;
}

type QuoteHandler = (quote: Quote) => void;

export class Stream {
  symbols: string[] = [];
  private ws?: WebSocket;
  private resolveSubscribe?: Function;
  private handlers: {[symbol: string]: QuoteHandler} = {};

  async subscribe(symbol: string, handler: QuoteHandler): Promise<undefined> {
    this.symbols.push(symbol);
    this.handlers[symbol] = handler;
    this.ws = new WebSocket(STREAM_URL);
    this.ws.onopen = (e: Event) => this.onOpen(e);
    this.ws.onmessage = (e: MessageEvent) => this.onMessage(e);
    this.ws.onclose = (e: Event) => this.onClose(e);
    this.ws.onerror = (e: Event) => this.onError(e);
    return new Promise<undefined>((resolve) => {
      this.resolveSubscribe = resolve;
    });
  }

  unsubscribe(symbol: string) {
    this.send('unlisten', this.symbols);
  }

  private send(action: string, data: any) {
    this.ws!.send(JSON.stringify({
      action: action,
      data: data,
    }));
  }

  private onOpen(e) {
    this.send('authenticate', {
      key_id: ALPACA_KEY,
      secret_key: ALPACA_SECRET,
    });
  }

  private onMessage(e: MessageEvent) {
    // console.log(e);
    const msg = JSON.parse(e.data);

    // Authenticated
    if (msg.data?.status == 'authorized') {
      console.log('Streaming connection authorized')
      if (this.symbols) {
        this.send('listen', {streams: this.symbols});
      }
    }

    // Listening
    if (msg.stream == 'listening') {
      this.resolveSubscribe!();
    }

    // Quote
    if (msg.data.ev === 'Q') {
      const symbol = 'Q.' + msg.data['T'];
      const handler = this.handlers[symbol];
      if (handler) {
        const quote: Quote = {
          symbol: symbol,
          bidPrice: msg.data['p'],
          bidSize: msg.data['s'],
          askPrice: msg.data['P'],
          askSize: msg.data['S'],
          time: msg.data['t'],
        }
        console.log(quote);
        handler(quote);
      }
    }
  }

  private onError(e) {
    console.error(e);
  }

  private onClose(e) {
    if (e.wasClean) {
      console.log(`Connection closed cleanly, code=${e.code} reason=${e.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.error('Connection died');
    }
    console.log(e);
  }
}
