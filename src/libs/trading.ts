/**
 * @see
 * - https://alpaca.markets/docs/api-documentation/api-v2/
 * - https://github.com/alpacahq/alpaca-trade-api-js
 * - https://github.com/117/alpaca
 * - https://polygon.io/sockets
 */

import * as alpaca from "@master-chief/alpaca";
import { ALPACA_KEY, ALPACA_SECRET } from '../secure';

const client = new alpaca.Client({
  credentials: {
    key: ALPACA_KEY,
    secret: ALPACA_SECRET,
  },
  paper: true,
});

export async function long(symbol, shares) {
  const order = await client.placeOrder({
    symbol: "SPY",
    qty: 1,
    side: "buy",
    type: "market",
    time_in_force: "day",
  });

  console.log(order);
}


/*
async function buy(symbol, shares) {
  const order = await alpaca.createOrder({
    symbol: symbol, // any valid ticker symbol
    qty: shares,
    side: 'buy',
    type: 'market', // 'market' | 'limit' | 'stop' | 'stop_limit',
    time_in_force: 'day' // 'day' | 'gtc' | 'opg' | 'ioc',
    //limit_price: number,
    //stop_price: number,
  });

  console.log('Order Placed:');
  console.log(order);
  buy.disabled = false;
}
*/


