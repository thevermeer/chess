import CLJ from '../Clojure';

describe('CLJ functions', () => {
  
  describe('CLJ.str', () => {
    test('should return string representation of an object', () => {
      const obj = { name: 'test', value: 123 };
      expect(CLJ.str(obj)).toBe(JSON.stringify(obj, null, 2));
    });

    test('should handle null and undefined', () => {
      expect(CLJ.str(null)).toBe("null");
      expect(CLJ.str(undefined)).toBe(undefined); // JSON.stringify(undefined) returns undefined
    });
  });

  describe('CLJ.deepCopy', () => {
    test('should create a deep copy of an object', () => {
      const obj = { name: 'test', value: [1, 2, 3] };
      const copy = CLJ.deepCopy(obj);
      expect(copy).toEqual(obj);
      expect(copy).not.toBe(obj); // Ensure it's a deep copy
      expect(copy.value).not.toBe(obj.value); // Ensure nested objects/arrays are copied
    });

    test('should handle circular references', () => {
      const obj: any = { name: 'test' };
      obj.self = obj; // circular reference
      expect(() => CLJ.deepCopy(obj)).toThrow(TypeError);
    });
  });

  describe('CLJ.range', () => {
    test('should return a range of numbers', () => {
      expect(CLJ.range(5)).toEqual([0, 1, 2, 3, 4]);
      expect(CLJ.range(2, 5)).toEqual([2, 3, 4, 5]);
    });

    test('should handle negative and zero ranges', () => {
      expect(CLJ.range(-5)).toEqual([]);
      expect(CLJ.range(0)).toEqual([]);
      expect(CLJ.range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    });
  });

  describe('CLJ.randomElement', () => {
    test('should return a random element from an array', () => {
      const arr = [1, 2, 3, 4, 5];
      const element = CLJ.randomElement(arr);
      expect(arr).toContain(element);
    });

    test('should handle empty arrays', () => {
      expect(CLJ.randomElement([])).toBeUndefined();
    });
  });

  describe('CLJ.conj', () => {
    test('should add an element to a collection', () => {
      const arr = [1, 2, 3];
      expect(CLJ.conj(arr, 4)).toEqual([1, 2, 3, 4]);
    });

    test('should handle non-array collections', () => {
      expect(CLJ.conj(null, 1)).toEqual([1]);
      expect(CLJ.conj(undefined, 1)).toEqual([1]);
      expect(CLJ.conj({}, { key: 'value' })).toEqual({ key: 'value' });
    });
  });

  describe('CLJ.repeat', () => {
    test('should return an array with repeated objects', () => {
      const obj = { name: 'test' };
      expect(CLJ.repeat(obj, 3)).toEqual([obj, obj, obj]);
    });

    test('should handle non-positive repeat counts', () => {
      const obj = { name: 'test' };
      expect(CLJ.repeat(obj, 0)).toEqual([]);
      expect(CLJ.repeat(obj, -1)).toEqual([]);
    });
  });

  describe('CLJ.flatten', () => {
    test('should flatten nested arrays', () => {
      const nestedArr = [1, [2, [3, 4]], 5];
      expect(CLJ.flatten(nestedArr)).toEqual([1, 2, 3, 4, 5]);
    });

    test('should handle deeply nested arrays', () => {
      const nestedArr = [1, [2, [3, [4, [5]]]]];
      expect(CLJ.flatten(nestedArr)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('CLJ.comp', () => {
    test('should compose functions', () => {
      const add1 = (x: number) => x + 1;
      const double = (x: number) => x * 2;
      const composed = CLJ.comp(double, add1);
      expect(composed(3)).toBe(8); // double(add1(3)) = double(4) = 8
    });

    test('should handle no functions', () => {
      const composed = CLJ.comp();
      expect(composed(3)).toBe(3);
    });
  });

  describe('CLJ.count', () => {
    test('should count elements in a collection', () => {
      const arr = [1, 2, 3];
      expect(CLJ.count(arr)).toBe(3);
      expect(CLJ.count(null)).toBe(0);
      expect(CLJ.count(undefined)).toBe(0);
    });

    test('should handle non-array inputs', () => {
      expect(CLJ.count('string')).toBe(6); // String length
      expect(CLJ.count({ key: 'value' })).toBe(1); // Object key count
    });
  });

  describe('CLJ.assocIn', () => {
    test('should update a nested structure', () => {
      const state = { a: { b: { c: 1 } } };
      const newState = CLJ.assocIn(state, ['a', 'b', 'c'], 2);
      expect(newState).toEqual({ a: { b: { c: 2 } } });
    });

    test('should handle empty keys array', () => {
      const state = { a: { b: { c: 1 } } };
      const newState = CLJ.assocIn(state, [], 2);
      expect(newState).toEqual(state); // No change
    });
  });

  describe('CLJ.dissocIn', () => {
    test('should remove a value in a nested structure', () => {
      const state = { a: { b: { c: 1 } } };
      const newState = CLJ.dissocIn(state, ['a', 'b', 'c']);
      expect(newState).toEqual({ a: { b: {} } });
    });

    test('should handle non-existent keys', () => {
      const state = { a: { b: { c: 1 } } };
      const newState = CLJ.dissocIn(state, ['a', 'x', 'c']);
      expect(newState).toEqual(state); // No change
    });
  });

  describe('CLJ.groupBy', () => {
    test('should group objects by a key', () => {
      const arr = [{ type: 'fruit', name: 'apple' }, { type: 'fruit', name: 'banana' }, { type: 'vegetable', name: 'carrot' }];
      const grouped = CLJ.groupBy((item) => item.type, arr);
      expect(grouped).toEqual({
        fruit: [{ type: 'fruit', name: 'apple' }, { type: 'fruit', name: 'banana' }],
        vegetable: [{ type: 'vegetable', name: 'carrot' }]
      });
    });

    test('should handle empty arrays', () => {
      const result = CLJ.groupBy((item) => item.type, []);
      expect(result).toEqual({});
    });
  });

  describe('CLJ.keep', () => {
    test('should return non-null elements after applying a function', () => {
      const arr = [1, 2, null, 4];
      const result = CLJ.keep((x) => x, arr);
      expect(result).toEqual([1, 2, 4]);
    });

    test('should handle functions returning falsy values', () => {
      const arr = [1, 2, 3];
      const result = CLJ.keep((x) => null, arr);
      expect(result).toBeNull();
    });
  });

  describe('CLJ.filter', () => {
    test('should filter elements based on a function', () => {
      const arr = [1, 2, 3, 4];
      const result = CLJ.filter((x) => x % 2 === 0, arr);
      expect(result).toEqual([2, 4]);
    });

    test('should handle functions that never match', () => {
      const arr = [1, 2, 3];
      const result = CLJ.filter((x) => x > 3, arr);
      expect(result).toEqual([]);
    });
  });

  describe('CLJ.some', () => {
    test('should return the first non-null result', () => {
      const arr = [null, undefined, 3, 4];
      const result = CLJ.some((x) => x, arr);
      expect(result).toBe(3);
    });

    test('should handle functions that never match', () => {
      const arr = [1, 2, 3];
      const result = CLJ.some((x) => x > 3, arr);
      expect(result).toEqual(null);
    });
  });

  describe('CLJ.map', () => {
    test('should map a function to each element of a collection', () => {
      const arr = [1, 2, 3];
      const result = CLJ.map((x) => x * 2, arr);
      expect(result).toEqual([2, 4, 6]);
    });

    test('should handle empty collections', () => {
      const result = CLJ.map((x) => x * 2, []);
      expect(result).toEqual([]);
    });
  });

  describe('CLJ.insertInto', () => {
    test('should insert a value into an array at a given index', () => {
      const arr = [1, 2, 3];
      const result = CLJ.insertInto(arr, 1, 4);
      expect(result).toEqual([1, 4, 2, 3]);
    });

    test('should handle out-of-bounds indices', () => {
      const arr = [1, 2, 3];
      expect(CLJ.insertInto(arr, -1, 4)).toEqual([1, 2, 3]); // No insertion
      expect(CLJ.insertInto(arr, 10, 4)).toEqual([1, 2, 3, 4]); // Insert at the end
    });
  });

  describe('CLJ.debouncer', () => {
    test('should create a debounced function', (done) => {
      const fn = jest.fn();
      const debounced = CLJ.debouncer(fn, 100);
      debounced.handler;
      expect(fn).not.toHaveBeenCalled();
      setTimeout(() => {
        expect(fn).toHaveBeenCalled();
        done();
      }, 150);
    });

    test('should handle invalid delay values', (done) => {
      const fn = jest.fn();
      const debounced = CLJ.debouncer(fn, -100);
      expect(fn).not.toHaveBeenCalled();
      setTimeout(() => {
        expect(fn).toHaveBeenCalled();
        done();
      }, 50);
    });
  });

  describe('CLJ.threadFirst', () => {
    test('should thread value through functions', () => {
      const add1 = (x: number) => x + 1;
      const double = (x: number) => x * 2;
      const div = (a: number, b: number) => a / b;
      const result = CLJ.threadFirst(2, add1, double, [div, 3]);
      expect(result).toBe(2);
    });

    test('should handle no functions', () => {
      const result = CLJ.threadFirst(2);
      expect(result).toBe(2);
    });
  });

  describe('CLJ.threadLast', () => {
    test('should thread value through functions', () => {
      const add1 = (x: number) => x + 1;
      const double = (x: number) => x * 2;
      const div = (a: number, b: number) => a / b;
      const result = CLJ.threadLast(2, add1, double, [div, 3], [div, 0.5], add1);
      expect(result).toBe(2);
    });

    test('should handle no functions', () => {
      const result = CLJ.threadLast(2);
      expect(result).toBe(2);
    });
  });
});
