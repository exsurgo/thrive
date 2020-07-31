import { html, customElement, property } from 'lit-element';
import { AppElement } from './app-element';

@customElement('ui-button')
export class Button extends AppElement {
  @property() basic = false;

  render() {
    return html`
      <slot></slot>
    `;
  }

  static css = html`
    <style>
      :host {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        background-color: var(--primary-color);
        border-color: #999;
        border-radius: 3px;
        font-size: 1rem;
        font-weight: 500;
        padding: 5px 10px 4px 10px;
        cursor: pointer;
        min-width: 80px;
        transition: opacity .4s;
      }
      :host(:hover) {
        opacity: .85;
      }
      :host([basic]) {
        background-color: #333;
      }
    </style>
  `;
}
