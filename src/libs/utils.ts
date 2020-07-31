/**
 * Returns true if object is an Element.
 */
export function isElement(value: any): boolean {
  if (!value) {
    return false;
  }
  return (typeof value === 'object' && value.nodeType !== undefined);
}

/**
 * Returns true if object is a Window.
 */
export function isWindow(value: any) {
  return value.window && value === value.window;
}

/**
 * Waits a specific number of milliseconds before continuing.
 */
export async function wait(milliseconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => void resolve(), milliseconds);
  });
}

/**
 * Waits until a condition is true before continuing.
 */
export async function waitFor(truthy: Function): Promise<void> {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (truthy()) {
        clearInterval(interval);
        resolve();
      }
    }, 10);
  });
}

/** Get a friendly name of a web site from the url and title */
export function getFriendlySiteName(url: string, title: string): string {
  const keyTerms: string[] = [];
  const parts = title.split(' ');
  const host = new URL(url).hostname;
  for (const part of parts) {
    if (part.length > 3 && host.includes(part.toLowerCase()) &&
        !keyTerms.includes(part)) {
      keyTerms.push(part);
    }
  }
  if (keyTerms.length) {
    return keyTerms.join(' ');
  } else {
    return host.replace(/^www\./, '');
  }
}

/** Returns true if string is all alphanumeric. */
export function isAlphanumeric(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) &&   // numeric (0-9)
        !(code > 64 && code < 91) &&   // upper alpha (A-Z)
        !(code > 96 && code < 123)) {  // lower alpha (a-z)
      return false;
    }
  }
  return true;
}

/** Copies text to the clipboard. */
export function copyToClipboard(str: string) {
  const el = document.createElement('textarea');
  el.style.display = 'none !important';
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
