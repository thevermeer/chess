// Clojure Core Function Emulation
// Project: N/A - Learning React in TypeScript
// Authored by Jeff Vermeer <vermeer.ca> - May, 2024
// Based on the clojure.core functionality, R. Hickey et al.
// TypeScript Version: 5.4.5

/**
 * Module: CLJ
 * ----------------------------------------------------------------------------
 * Based on the clojure.core functionality for manipulating collections,
 * Implemented in TypeScript as an exercise in data manipulation, while 
 * transferring React component design from CLJS to TS.
 */
export const CLJ = {
  /**
   * str
   * --------------------------------------------------------------------------
   * Returns a string representation of an object
   * @param {any} obj - The object to stringify
   * @returns {string} - The string representation of the object
   */
  strInner: (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  },

  str: (obj: any): string => {
    return JSON.stringify(obj);
  },
  /**
   * deepCopy
   * --------------------------------------------------------------------------
   * Creates and returns a deep copy of an object
   * @param {any} obj - The object to copy
   * @returns {any} - The deep copied object
   */
  deepCopy: (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Set) {
      const newSet = new Set();
      obj.forEach(value => {
        newSet.add(CLJ.deepCopy(value));
      });
      return newSet;
    }
    const newObj: any = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj[key] === obj) {
        throw TypeError("Cannot copy self-referencing objects");
      }
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = CLJ.deepCopy(obj[key]);
      }
    }
    return newObj;
  },

  /**
   * range
   * --------------------------------------------------------------------------
   * Returns an array containing a range of integers
   * @param {number} startOrEnd - Start position or the end position if only one argument
   * @param {number} [end] - The end position (optional)
   * @returns {number[]} - The array containing the range of integers
   */
  range: (startOrEnd: number, end?: number): number[] => {
    if (end === undefined) {
      return Array.from({ length: startOrEnd }, (_, index) => index);
    } else {
      return Array.from({ length: end - startOrEnd + 1 }, (_, index) => startOrEnd + index);
    }
  },

  /**
   * randomElement 
   * --------------------------------------------------------------------------
   * Given an array, returns a random element from that array
   * @param {any[]} coll - The array to pick a random element from
   * @returns {any} - A random element from the array
   */
  randomElement: (coll: any[]): any => {
    const randomIndex = Math.floor(Math.random() * coll.length);
    return coll[randomIndex];
  },

  /**
   * conj
   * --------------------------------------------------------------------------
   * Adds an element to a collection
   * @param {Object} coll - The collection to add to
   * @param {any} elem - The element to add
   * @returns {Object} - The updated collection
   */
  conj: (coll: any | null | undefined, elem: any): Object => {
    if (coll === null || coll === undefined) {
      return [elem];
    } else if (Array.isArray(coll)) {
      coll[coll.length] = elem;
      return coll;
    } else {
      return { ...coll, ...elem };
    }
  },

  /**
   * repeat
   * --------------------------------------------------------------------------
   * Given an object and an integer `times`, returns an array with 
   * `times` copies of the object
   * @param {any} obj - The object to repeat
   * @param {number} times - The number of times to repeat the object
   * @returns {any[]} - The array with repeated objects
   */
  repeat: (obj: any, times: number): any[] => {
    return Array.from({ length: times }, () => {
      return CLJ.deepCopy(obj);
    });
  },

  /**
   * repeatCall
   * --------------------------------------------------------------------------
   * Given a function that returns an object and an integer `times`, 
   * returns an array with `times` copies of the object
   * @param {Function} fn - The function to call
   * @param {number} freq - The number of times to call the function
   * @returns {object[]} - The array with repeated function calls
   */
  repeatCall: (fn: () => object, freq: number): object[] => {
    let v = CLJ.range(freq).map((idx) => {
      return fn();
    });
    return v;
  },

  /**
   * flatten
   * --------------------------------------------------------------------------
   * Given an array of maybe-arrays, removes nested objects and returns an 
   * unnested array of objects and primitives
   * @param {any[] | null} coll - The array to flatten
   * @returns {any[]} - The flattened array
   */
  flatten: (coll: any[] | null): any[] => {
    if (coll === null) {
      return [];
    }
    return coll.reduce((accumulator, val) =>
      Array.isArray(val) ?
        accumulator.concat(CLJ.flatten(val)) :
        accumulator.concat(val),
      []);
  },

  /**
   * comp 
   * --------------------------------------------------------------------------
   * Given a series of functions, returns a function composed of the argument 
   * functions, invoked right-to-left
   * @param {...Function[]} functionList - The functions to compose
   * @returns {Function} - The composed function
   */
  comp: (...functionList: Function[]): Function => {
    return (value: any) => functionList.reduceRight(
      (result, fn) => fn(result),
      value);
  },

  /**
   * count 
   * --------------------------------------------------------------------------
   * Safely counts the number of items in an array; returns 0 for null and 
   * undefined values
   * @param {any[]} coll - The collection to count
   * @returns {number} - The number of items in the collection
   */
  count: (coll: any | null | undefined): number => {
    if (coll === undefined) return 0;
    if (coll === null) return 0;
    return Object.prototype.hasOwnProperty.call(coll, "length") ? coll.length : CLJ.count(CLJ.keys(coll));
  },

  /**
   * seq 
   * --------------------------------------------------------------------------
   * Given an object, attempts to sequentialize the object into an array of 
   * elements
   * @param {any} coll - The collection to sequentialize
   * @returns {any | null} - The sequentialized array or null
   */
  seq: (coll: any | Set<any> | Map<any, any>): any[] | null => {
    if (coll instanceof Set) {
      const obj: any[] = [];
      coll.forEach(value => { obj.push(value) });
      // recursive step to ensure we return null for empty sets
      return CLJ.seq(obj);
    } else if (coll instanceof Map) {
      return CLJ.seq(Object.fromEntries(coll))
    } else if (CLJ.count(coll) === 0) {
      return null;
    } else if (Array.isArray(coll)) {
      return coll;
    } else {
      let result: any[] = [];
      for (let key in coll) {
        CLJ.conj(result, [key, coll[key]]);
      }
      return CLJ.seq(result);
    }
  },

  /**
   * assoc
   * --------------------------------------------------------------------------
   * Given a nested collection as a vector of string properties and numbers as 
   * array indices, updates the value within the nested structure
   * @param {any} state - The initial state
   * @param {string} key - The key to associate to
   * @param {any} value - The value to set
   * @returns {any} - The updated state
   */
  assoc: (state: any, key: string, value: any): any => {
    if (!CLJ.seq(key)) { return state; }
    state[key] = value;
    return state
  },

  /**
   * assocIn 
   * --------------------------------------------------------------------------
   * Given a nested collection as a vector of string properties and numbers as 
   * array indices, updates the value within the nested structure
   * @param {any} state - The initial state
   * @param {(number | string)[]} keys - The keys to traverse
   * @param {any} value - The value to set
   * @returns {any} - The updated state
   */
  assocIn: (state: any, keys: (number | string)[], value: any): any => {
    if (!CLJ.seq(keys)) { return state; }
    let updatedState: any = CLJ.deepCopy(state);
    let currentState: any = updatedState;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      currentState[key] = currentState[key] || (typeof keys[i + 1] === 'number' ? [] : {});
      currentState = currentState[key];
    }

    const lastKey = keys[keys.length - 1];
    currentState[lastKey] = value;
    return updatedState;
  },

  /**
   * dissocIn
   * --------------------------------------------------------------------------
   * Given a nested collection as a vector of string properties and numbers as 
   * array indices, removes the value within the nested structure
   * @param {any} state - The initial state
   * @param {(number | string)[]} keys - The keys to traverse
   * @returns {any} - The updated state
   */
  dissocIn: (state: any, keys: (number | string)[]): any => {
    let updatedState: any = CLJ.deepCopy(state);
    let currentState: any = updatedState;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!currentState.hasOwnProperty(key)) {
        return state;
      }
      currentState[key] = currentState[key] || (typeof keys[i + 1] === 'number' ? [] : {});
      currentState = currentState[key];
    }

    const lastKey: (number | string) = keys[keys.length - 1];
    if (Array.isArray(currentState) && typeof lastKey === 'number') {
      currentState.splice(lastKey, 1);
    } else {
      if (Array.isArray(currentState)) {
        currentState = currentState.filter((item, index) => index !== lastKey);
      } else {
        delete currentState[lastKey];
      }
    }
    return updatedState;
  },

  getIn: (state: any, keys: (number | string)[]): any => {
    if (!CLJ.seq(keys)) { return state; }
    let updatedState: any = state;
    let currentState: any = updatedState;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      currentState[key] = currentState[key]
        || (typeof keys[i + 1] === 'number' ? [] : {});
      currentState = currentState[key];
    }

    const lastKey = keys[keys.length - 1];
    return currentState[lastKey];
  },

  updateIn: (state: any, keys: (number | string)[], transformerFn: Function): any => {
    if (!CLJ.seq(keys)) { return state; }
    let updatedState: any = CLJ.deepCopy(state);
    let currentState: any = updatedState;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      currentState[key] = currentState[key]
        || (typeof keys[i + 1] === 'number' ? [] : {});
      currentState = currentState[key];
    }

    const lastKey = keys[keys.length - 1];
    currentState[lastKey] = transformerFn(currentState[lastKey]);
    return updatedState;
  },

  /**
   * groupBy 
   * --------------------------------------------------------------------------
   * Given a function that consumes an object and returns a map key, and an 
   * array of objects, returns a hashmap of returned keys where each value in 
   * the map is an array of objects that are grouped by the given keyword
   * @param {(item: any) => any} groupingFn - The function to group by
   * @param {any[]} coll - The collection to group
   * @returns {object} - The grouped hashmap
   */
  groupBy: (groupingFn: (item: any) => any, coll: any[]): object => {
    let result: any = {};
    coll.map((item) => {
      result[(groupingFn(item))] = CLJ.conj(result[groupingFn(item)], item);
      return item;
    });
    return result;
  },

  /**
   * keep
   * --------------------------------------------------------------------------
   * Combines map + filter identity to return an array of non-null elements
   * @param {(item: any) => any} reducerFn - The function to apply
   * @param {any[]} coll - The collection to process
   * @returns {any[] | null} - The array of non-null elements
   */
  keep: (reducerFn: (item: any) => any, coll: any[]): any[] | null => {
    let res: any[] = CLJ.map(reducerFn, coll)!
    res = res.filter((item) => item);
    return CLJ.seq(res);
  },

  /**
   * keepIndexed
   * --------------------------------------------------------------------------
   * Combines map + filter identity to return an array of non-null elements, 
   * with the function applied to each element with its index
   * @param {(item: any, idx: number) => any} reducerFn - The function to apply
   * @param {any[]} coll - The collection to process
   * @returns {any[] | null} - The array of non-null elements
   */
  keepIndexed: (reducerFn: (item: any, idx: number) => any, coll: any[]): any[] | null => {
    let res = coll.map(reducerFn);
    res = res.filter((item) => item);
    return CLJ.seq(res);
  },

  /**
   * filter
   * --------------------------------------------------------------------------
   * Filters the elements of a collection based on a reducer function
   * @param {(item: any) => any} reducerFn - The function to apply
   * @param {any[]} coll - The collection to filter
   * @returns {any[]} - The filtered collection
   */
  filter: (reducerFn: (item: any) => any, coll: any[]): any[] => {
    let res = coll.filter(reducerFn);
    return res;
  },

  /**
   * some
   * --------------------------------------------------------------------------
   * Applies a reducer function to the elements of a collection and returns the 
   * first non-null result
   * @param {(item: any) => any} reducerFn - The function to apply
   * @param {any[]} coll - The collection to process
   * @returns {any[] | null} - The first non-null result
   */
  some: (reducerFn: (item: any) => any, coll: any[]): any | null => {
    let res = CLJ.keep(reducerFn, coll);
    return res && res.length > 0 && res[0];
  },

  /**
   * map
   * --------------------------------------------------------------------------
   * Maps a function to each element of a collection
   * @param {(item: any) => any} reducerFn - The function to apply
   * @param {any[]} coll - The collection to map
   * @returns {any[]} - The mapped collection
   */
  map: <T, U>(reducerFn: (item: T) => U, coll: T[] | Set<T> | Map<T, U>): U[] | null => {
    if (!coll) {
      return null;
    }
    if (Array.isArray(coll)) {
      return coll.map(reducerFn);
    } else {
      let seq = CLJ.seq(coll)
      return seq && seq.map(reducerFn)
    }
  },

  reduce: (reducerFn: (item: any, next: any) => any, initialValue: any, coll: any[]): any[] | null => {
    if (coll === null || coll === undefined) { return coll }
    let res = coll.reduce(reducerFn, initialValue);
    return res;
  },

  /**
 * Applies a function to each element of an array in parallel.
 * @param {Function} fn - The function to apply to each element.
 * @param {Array} arr - The array of elements.
 * @returns {Promise<Array>} - A promise that resolves to an array of results.
 */
  pmap: async (fn: Function, arr: any[]): Promise<any> => {
    const asyncFn = async (item: any) => {
      let res = fn(item)
      return res;
    };
    const promises = arr.map(async (item) => await asyncFn(item));
    return Promise.all(promises);
  },

  /**
   * mapIndexed 
   * --------------------------------------------------------------------------
   * Maps a function to each element of a collection, with the function applied 
   * to each element with its index
   * @param {(item: T, idx: number) => any} reducerFn - The function to apply
   * @param {any[]} coll - The collection to map
   * @returns {any[]} - The mapped collection
   */
  mapIndexed: <T, U>(reducerFn: (item: T, index: number) => U, coll: T[] | Set<T> | Map<T, U>): U[] | null => {
    if (!coll) {
      return null;
    }
    if (Array.isArray(coll)) {
      return coll.map(reducerFn);
    } else {
      let seq = CLJ.seq(coll)
      return seq && seq.map(reducerFn)
    }
  },

  /**
   * insertInto
   * --------------------------------------------------------------------------
   * Inserts a value into an array at the given index
   * @param {any[]} coll - The array to insert into
   * @param {number} index - The index to insert at
   * @param {any} newValue - The value to insert
   * @returns {any[]} - The updated array
   */
  insertInto: (coll: any[], index: number, newValue: any) => {
    if (index < 0) { return coll }
    const newColl: any[] = [...coll]
    newColl.splice(index, 0, newValue);
    return newColl;
  },

  /**
   * debouncer
   * --------------------------------------------------------------------------
   * Given a function and a time delay in milliseconds, returns an object with 
   * a handler and a clear function
   * @param {Function} iFn - The function to debounce
   * @param {number} delay - The debounce delay
   * @returns {Object} - The debounced function object
   */
  debouncer: (iFn: Function, delay: number): { handler: Number, clear: Function } => {
    let hdlr: number = setTimeout(iFn, delay);
    return { handler: hdlr, clear: () => { clearTimeout(hdlr) } }
  },

  /**
   * pprint 
   * --------------------------------------------------------------------------
   * Variadic: Given one or more arguments, prints an html-friendly string 
   * representation of the objects
   * @param {object} firstObj - The first object to print
   * @param {...any} objects - Additional objects to print
   * @returns {JSX.Element} - The HTML representation of the objects
   */
  pprint: (firstObj: any, ...objects: any[]) => {
    return (
      <pre>
        {CLJ.strInner(firstObj)}
        {CLJ.seq(objects) && <p></p>}
        {CLJ.seq(objects) ? CLJ.strInner(objects) : null}
      </pre>
    );
  },

  /**
   * keys 
   * --------------------------------------------------------------------------
   * Accepts an object and returns an array of its property keys
   * @param {object} obj - The object to get keys from
   * @returns {string[]} - An array of property keys
   */
  keys: (obj: object): string[] => {
    let result: string[] = [];
    for (let key in obj) {
      CLJ.conj(result, key);
    }
    return result;
  },

  /**
   * vals
   * --------------------------------------------------------------------------
   * @param obj 
   * @returns returns a collection of values from a k/v object
   */
  vals: (obj: any): any[] => {
    let result: string[] = [];
    for (let key in obj) {
      CLJ.conj(result, obj[key]);
    }
    return result;
  },

  /**
   * equals
   * ------
   * @param a1 - some thing 
   * @param a2 -com other thing
   * @returns - a very questionable comparison of the sequentialized, sorted 
   * string of the objects. Use with caution if at all... :/
   */
  equals: (a1: any | object | null, a2: any | object | null): boolean => {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    // VERY, VERY sketcky ...
    return a1 == a2; // || (CLJ.seq(a1)?.sort() ) == (CLJ.seq(a2)?.sort());
  },

  /**
   * Contains
   * --------
   * @param coll 
   * @param value 
   * @returns 
   */
  contains: (coll: any, value: any): any | null => {
    let arr = CLJ.seq(coll)
    if (arr) {
      return CLJ.some((item) => CLJ.equals(item, value), arr)
    }
  },

  intersection: (coll1: any, coll2: any):any[]|null => {
    let setA = CLJ.seq(coll1)
    let setB = CLJ.seq(coll2)
    const [smallerSet, largerSet] = setA!.length < setB!.length ? [setA, setB] : [setB, setA];
    return smallerSet!.filter(element => CLJ.contains(largerSet, element))  
  },

  union: (coll1: any, coll2: any):any[]|null => {
    let setA = CLJ.seq(coll1)
    let setB = CLJ.seq(coll2)
    const [smallerSet, largerSet] = setA!.length < setB!.length ? [setA, setB] : [setB, setA]; 
    smallerSet?.map((elem)=>largerSet?.push(elem))
    return CLJ.seq(new Set(largerSet))
  },

  distinct: (coll1: any[] | object):any[]|null => {
    return CLJ.seq(new Set(CLJ.seq(coll1)))
  },

  interpose: (separator: any, arr: any[]): any[] => {
    if (arr === null || arr.length === 0) return [];
    const result: any[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (i > 0) {
        result.push(separator);
      }
      result.push(arr[i]);
    }
    return result;
  },

  classNames: (...names: string[]): string => {
    return CLJ.threadLast(
      names,
      [CLJ.keep, (item: string) => item],
      [CLJ.interpose, ' '],
      [CLJ.reduce, (acc: string, val: string) => { return acc + val }, '']
    )
  },

  partitionBy: <T, K>(fn: (item: T) => K, arr: T[]): T[][] => {
    if (arr.length === 0) return [];

    const result: T[][] = [];
    let currentPartition: T[] = [];
    let lastKey: K = fn(arr[0]);

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const currentKey = fn(item);

      if (currentPartition.length === 0 || currentKey === lastKey) {
        currentPartition.push(item);
      } else {
        result.push(currentPartition);
        currentPartition = [item];
      }

      lastKey = currentKey;
    }

    if (currentPartition.length > 0) {
      result.push(currentPartition);
    }

    return result;
  },

  partial: (fn: Function, ...args: any) => {
    return (...innerArgs: any) => fn(...args, ...innerArgs)
  },

  /**
   * threadFirst
   * --------------------------------------------------------------------------
   * Threads the initial value through the functions, applying each function to 
   * the result of the previous one (left-to-right)
   * @param {any} initialValue - The initial value
   * @param {...Function[]} fns - The functions to apply
   * @returns {any} - The final result
   */
  threadFirst(initialValue: any, ...fns: Array<Array<any> | Function>) {
    return fns.reduce((result, fn) => {
      if (Array.isArray(fn)) {
        const [func, ...args] = fn;
        return func(result, ...args);
      } else {
        return fn(result);
      }
    }, initialValue);
  },

  /**
   * threadLast
   * --------------------------------------------------------------------------
   * Threads the initial value through the functions, applying each function 
   * to the result of the previous one (right-to-left)
   * @param {any} initialValue - The initial value
   * @param {...Array<any> | Function[]} fns - The functions to apply
   * @returns {any} - The final result
   */
  threadLast(initialValue: any, ...fns: Array<Array<any> | Function>) {
    return fns.reduce((result, fn) => {
      if (Array.isArray(fn)) {
        const [func, ...args] = fn;
        return func(...args, result);
      } else {
        return fn(result);
      }
    }, initialValue);
  }
};

export default CLJ;