import {customElement, html, property, TemplateResult} from 'lit-element';
import {AppElement} from './app-element';

const OPEN_DIALOGS = new Set<Dialog>();

@customElement('ui-dialog')
export class Dialog extends AppElement {
  @property({type: String}) header?: string;
  @property({type: String}) submitText = 'OK';
  @property({type: String}) cancelText = 'Cancel';

  init() {
    // Close on escape
    this.listen(window, 'keyup', (e: KeyboardEvent) => {
      if (e.key == 'Escape') {
        this.cancelDialog();
      }
    });
  }

  render(content?: TemplateResult) {
    return html`
      <div class="modal" @pointerup="${this.cancelDialog}"></div>
      <div class="dialog">
        <div class="header">${this.header}</div>
        <ui-icon class="exit" icon="close" @click="${this.cancelDialog}"></ui-icon>
        <div class="content">
          <slot>${content}</slot>
        </div>
        <div class="footer">
          <ui-button basic @click="${this.cancelDialog}">${this.cancelText}</ui-button>
          <ui-button @click="${this.submitDialog}">${this.submitText}</ui-button>
        </div>
      </div>
    `;
  }

  static css = html`
    <style>
      :host {
        z-index: 101;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :host, .modal {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
      }
      .modal {
        opacity: .9;
        background-color: #666;
      }
      .dialog {
        display: flex;
        flex-direction: column;
        z-index: 102;
        min-width: 600px;
        min-height: 400px;
        background-color: #fff;
        position: relative;
        border-radius: 2px;
        box-shadow: var(--shadow-elevated);
      }
      .exit {
        position: absolute;
        top: 5px;
        right: 2px;
        height: 32px;
        width: 32px;
        cursor: pointer;
        padding: 0;
      }
      .header, .footer {
        min-height: 40px;
      }
      .header {
        font-size: 1.2rem;
        font-weight: 500;
        padding: 5px;
        background-color: var(--background-color);
      }
      .content {
        flex: 1;
        padding: 20px;
      }
      .footer {
        display: flex;
      }
      .footer > ui-button {
        flex: 1;
        border-radius: 0;
      }
    </style>
  `;

  static open() {
    return new this().show();
  }

  /* Show/Remove */

  private resolver?: Function;

  async show(): Promise<boolean> {
    document.querySelector('app-main')!.shadowRoot!.append(this);
    super.show();
    OPEN_DIALOGS.add(this);
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  /** @override */
  remove() {
    OPEN_DIALOGS.delete(this);
    super.remove();
  }

  /* Submit/Cancel */

  private submitDialog() {
    const promise = this.onSubmit();
    if (this.resolver) {
      // If promise was returned from onSubmit, wait until
      // it completes, otherwise resolve immediately
      if (promise) {
        promise.then(() => {
          this.resolver!(true);
          this.resolver = undefined;
        });
      } else {
        this.resolver(true);
        this.resolver = undefined;
      }
    }
    this.remove();
  }

  protected onSubmit(): Promise<boolean>|void {}

  private cancelDialog() {
    const promise = this.onCancel();
    if (this.resolver) {
      // If promise was returned from onCancel, wait until it
      // completes, otherwise resolve immediately
      if (promise) {
        promise.then(() => {
          this.resolver!(false);
          this.resolver = undefined;
        });
      } else {
        this.resolver(false);
        this.resolver = undefined;
      }
    }
    this.remove();
  }

  protected onCancel(): Promise<boolean>|void {}

  /* All dialogs */

  /** Hides all open dialogs. */
  static hideAll() {
    OPEN_DIALOGS.forEach((dialog: Dialog) => void dialog.hide());
    OPEN_DIALOGS.clear();
  }

  /** Returns true if any dialogs are open. */
  static get isOpen(): boolean {
    return OPEN_DIALOGS.size > 0;
  }
}
