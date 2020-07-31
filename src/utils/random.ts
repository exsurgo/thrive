
export function getRandomInt(min: number, max: number): number {
  return Math.floor(max - Math.random() * (max-min));
}

export function getRandomDecimal(min: number, max: number): number {
  return parseFloat((getRandomInt(min, max) + Math.random()).toFixed(2));
}

export function getRandomArrayItem<T>(array): T {
  return array[getRandomInt(0, array.length)];
}

/**
 * Generates a unique ID of random alphanumeric characters.
 * The returned ID always begins with a letter.
 */
export function getRandomId(length = 10): string {
  let id = '';
  for (let i = 0; i < length; i++) {
    let range = (i === 0 ? 51 : 61); // Starts with letter
    id += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        [getRandomInt(0, range)];
  }
  return id;
}
