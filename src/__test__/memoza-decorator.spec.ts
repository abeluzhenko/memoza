import { Memoized } from '../';

describe('Memoize', () => {
  describe('return original method result', () => {
    it('on a first call', () => {
      const methodResult = 'R';
      const mock = { method: () => methodResult };
      const { method: descriptor } = Object.getOwnPropertyDescriptors(mock);

      Memoized()(null, null, descriptor);

      expect(descriptor.value!.apply(mock)).toBe(methodResult);
    });

    it('when some dependency has changed', () => {
      let methodResult = 'A';
      const mock = {
        field: 0,
        method: () => methodResult,
      };
      const { method: descriptor } = Object.getOwnPropertyDescriptors(mock);

      Memoized<typeof mock>('field')(null, null, descriptor);
      descriptor.value!.apply(mock);

      methodResult = 'B';
      mock.field++;

      expect(descriptor.value!.apply(mock)).toBe(methodResult);
    });

    it('when some argument has changed', () => {
      let methodResult = 'A';
      const mock = {
        method: (argA: number) => `${methodResult}-${argA}`,
      };
      const { method: descriptor } = Object.getOwnPropertyDescriptors(mock);

      Memoized<typeof mock>()(null, null, descriptor);
      descriptor.value!.call(mock, 1);

      methodResult = 'B';

      expect(descriptor.value!.call(mock, 2)).toBe('B-2');
    });
  });

  describe('return memoized result', () => {
    it('when no dependencies has changed', () => {
      let methodResult = 'A';
      const mock = {
        field: 0,
        method: () => methodResult,
      };
      const { method: descriptor } = Object.getOwnPropertyDescriptors(mock);

      Memoized<typeof mock>('field')(null, null, descriptor);
      descriptor.value!.apply(mock);

      methodResult = 'B';
      mock.field = 0;

      expect(descriptor.value!.apply(mock)).toBe('A');
    });

    it('when no arguments has changed', () => {
      let methodResult = 'A';
      const argumentValue = 1;
      const mock = {
        method: (argA: number) => `${methodResult}-${argA}`,
      };
      const { method: descriptor } = Object.getOwnPropertyDescriptors(mock);

      Memoized<typeof mock>()(null, null, descriptor);
      descriptor.value!.call(mock, argumentValue);

      methodResult = 'B';

      expect(descriptor.value!.call(mock, argumentValue)).toBe('A-1');
    });
  });
});
