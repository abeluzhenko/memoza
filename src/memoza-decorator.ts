interface Memo {
  result: any;
  depsValues: any[];
  argsValues: any[];
}

function getKeysValues<T>(keys: (keyof T)[], context: T) {
  return keys.map((key) => context[key]);
}

function hasChanges<T extends Array<any>>(prevValues: T, currValues: T) {
  return currValues.some((value, i) => prevValues[i] !== value);
}

export function Memoized<T extends {} = {}>(...deps: (keyof T)[]) {
  return (_target: any, _propertyKey: any, descriptor: PropertyDescriptor) => {
    const { value: originalMethod } = descriptor;

    let memo: Memo = {
      result: undefined,
      depsValues: [],
      argsValues: [],
    };

    descriptor.value = function (...newArgs: any[]) {
      const depsValues = getKeysValues(deps, this as T);

      if (
        memo.result === undefined ||
        hasChanges(memo.depsValues, depsValues) ||
        hasChanges(memo.argsValues, newArgs)
      ) {
        memo = {
          result: originalMethod.apply(this, newArgs),
          argsValues: newArgs,
          depsValues,
        };
      }

      return memo.result;
    };
  };
}
