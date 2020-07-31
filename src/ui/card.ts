import {customElement, html} from 'lit-element';
import {AppElement} from './app-element';

@customElement('ui-card')
export class Card extends AppElement {
  render() {
    return html`
      <div class="top">
        <slot name="top"></slot>
      </div>
      <slot name="menu"></slot>
      <p class="content">
        <slot></slot>
      </p>
    `;
  }

  static css = html`
    <style>
      :host {
        display: block;
        border-radius: 5px;
        background: #fff;
        margin: 10px;
        padding: 10px;
        position: relative;
        box-shadow: var(--shadow);
        transition: box-shadow .8s;
      }
      
      :host(:hover) {
        box-shadow: var(--shadow-elevated);
      }
      
      ::slotted(app-context-menu) {
        position: absolute;
        top: -3px;
        right: 1px;
      }
     
      .top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0;
      }
      
      .top ::slotted(a) {
        font-size: 1.2em;
        display: inline-block;
      }
      
      .top ::slotted(header) {
        font-size: 1.5em;
      }
      
      .content {
        padding: 8px;
        margin: 0;
      }
    </style>
  `;
}
