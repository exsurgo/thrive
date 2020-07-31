import {customElement, html, property, TemplateResult} from 'lit-element';
import {Dialog} from './dialog';

@customElement('ui-confirm')
export class Confirm extends Dialog {
  header = 'Continue?';
  submitText = 'Yes';
  cancelText = 'No';

  @property({type: Object})
  message: string|TemplateResult = 'Are you sure you want to continue?';

  render() {
    return super.render(html`
      <p>${this.message}</p>
    `);
  }
}

export async function confirm(
    header: string, message?: string|TemplateResult): Promise<boolean> {
  const dialog = new Confirm();
  dialog.header = header;
  if (message) {
    dialog.message = message;
  }
  return dialog.show();
}
