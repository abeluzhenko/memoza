# Memoza

## Memoizing TypeScript decorator

Replaces a method with its memoized version. Adds a memoization by:

- input arguments;
- dependencies (current class fields);

### Installation

```
$ yarn add memoza
```

or

```
$ npm install memoza
```

### Usage

```javascript
import { Memoized } from 'memoza';

class Something {
  public title = 'Title';
  public isFlagA = true;
  public isFlagB = false;

  /* Memoize by dependencies and arguments */
  @Memoized<Something>('isFlagA', 'isFlagB')
  public isBothAnB() {
    return this.valueA && this.valueB;
  }

  /* Memoize by arguments only */
  @Memoized()
  public getTitle(roundNum: number) {
    return `Title ${roundNum}`;
  }
}
```
