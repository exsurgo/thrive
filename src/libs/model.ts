/**
 * This provides dynamic access to the properties of the object, which
 * is used for custom serialization to/from JSON objects. It is normally
 * used to populate models from web requests, or serialize them before
 * sending to the server.
 */
interface Dictionary {
  [key: string]: unknown;
}

/** Provides options for the `serialize` method of model. */
export class SerializeOptions {
  /** Ran against each property, and ignores if true is returned. */
  ignoreIf?: (k: string, v: unknown) => boolean;

  /** Ignores null, undefined, '', and empty [] / {}. */
  ignoreEmpty? = false;

  /** Ignores any property in this list. */
  ignoreProperties?: string[] = [];

  /** Serialize to JSON string, rather than object.  Defaults to true. */
  stringify? = true;

  /** Format JSON for better readability. */
  format? = false;
}

/**
 * Base class for all models.
 */
export class Model {
  /**
   * Sets the initial values for the model.  In general, this is normally
   * used to populate complex models from a JSON data source.
   * @param values - Any values to initially set, usually from a data source.
   *    This can also be a JSON string which is parsed.
   * @param defaults - Default values to set if not provided by `values`.
   */
  set(values?: Dictionary|string, defaults?: Dictionary) {
    if (values || defaults) {
      if (values && typeof values === 'string') {
        values = JSON.parse(values);
      }
      Object.assign(this, defaults, values);
    }
  }

  /**
   * Create an instance of the model, and sets the values and defaults.
   * @see {@link Model#set}
   */
  static create(values?: Dictionary|string, defaults?: Dictionary) {
    // tslint:disable-next-line:no-any
    const model = new (this as any)();
    model.set(values, defaults);
    return model;
  }

  /**
   * Returns a serialized string or object of the model. Adds numerous
   * additional options beyond the standard JSON.stringify() method.
   */
  serialize(options?: SerializeOptions): string|{} {
    // Default options
    options = Object.assign(new SerializeOptions(), options);

    // Clone properties from obj to clone
    function cloneProperties(obj: Dictionary, clone: Dictionary) {
      // tslint:disable:forin Check all properties on the object
      for (const key in obj) {
        let val = obj[key];

        // `ignoreIf` param
        if (options!.ignoreIf && options!.ignoreIf!(key, val)) {
          continue;
        }

        // `ignoreEmpty` param (see isEmptyValue)
        if (options!.ignoreEmpty && isEmptyValue(val)) {
          continue;
        }

        // `ignoreProperties` param
        if (options!.ignoreProperties &&
            options!.ignoreProperties!.includes(key)) {
          continue;
        }

        // Convert Set to Array
        if (val instanceof Set) {
          val = clone[key] = Array.from(val);
        }
        // Convert Map to Object
        else if (val instanceof Map) {
          const newObj: Dictionary = {};
          val.forEach((v: unknown, k: string) => {newObj[k] = v});
          val = clone[key] = newObj;
        }

        // Array - Check objects in array
        if (Array.isArray(val)) {
          const array = val as unknown[];
          const cloneArray: unknown[] = [];
          clone[key] = cloneArray;
          for (let i = 0; i < array.length; i++) {
            if (typeof array[i] === 'object') {
              const subClone = {};
              cloneProperties(array[i] as Dictionary, subClone);
              cloneArray[i] = subClone
            } else {
              cloneArray[i] = array[i];
            }
          }
        }

        // Nested object
        else if (typeof val === 'object' && !(val instanceof Date)) {
          const subClone = {};
          cloneProperties(val as Dictionary, subClone);
          clone[key] = subClone;
        }

        // Primitive value or date
        else {
          clone[key] = val;
        }
      }
    }

    const clone = {};
    const dict = (this as unknown) as Dictionary;
    cloneProperties(dict, clone);

    if (options!.stringify) {
      return JSON.stringify(clone, null, options!.format ? 2 : undefined);
    } else {
      return clone;
    }
  }
}

/**
 * Returns true if considered "empty", and should not be serialized.
 * This includes undefined/null/'' or and empty Array/Object/Set/Map.
 */
function isEmptyValue(val: unknown): boolean {
  return (
      val === undefined || val === null || val === '' ||
      // Empty Array
      (Array.isArray(val) && (val as []).length === 0) ||
      // Empty Object
      (typeof val === 'object' && isEmptyObject(val)) ||
      // Empty Set
      (val instanceof Set && val.size === 0) ||
      // Empty Map
      (val instanceof Map && val.size === 0));
}

/**
 * Returns true if is plain object with no properties.
 */
function isEmptyObject(obj: Object|null): boolean {
  if (!obj) {
    return false;
  }
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}
