# map-object-facade

> Use map as object (e.g. map.a instead of map.get('a'))

## Features

- Get and set values using the object dot notation.
- Supports Object calls like Object.keys(map) and delete map[key].
- Supports readonly (sealed) mode and noAdditions (frozen) mode.
- Adds a single function on the Map prototype (objectFacade).
- Transparent: existing Map functionality is not changed.

## Usage examples

```javascript
import 'map-object-facade'

let map = new Map().objectFacade();
map.a = 1;
map['b'] = 2;
map.set('c', 3);

map.a === map.get('a');
map.size === 3
Object.keys(map) === map.keys() === ['a', 'b', 'c']

delete map.b
map.size === 2
map.b === map.get('b') === undefined
Object.keys(map) === map.keys() === ['a', 'c']

let readMap = map.objectFacade({readonly:true});
```

## Readonly or noAdditions

Object.seal and Object.freeze cannot be set independently on a proxy (which is used in the implementation of objectFacade).
Instead, options can be given in the objectFacade call.

Current supported options are:

- **noAdditions** (alias: **seal**) that allows changing values, but no new keys (default: false)
- **readonly** (alias: **freeze**) that allows no changes whatsoever (default: false)
- **throwOnIgnoredSet** will throw if set is ignored due to noAdditions / readonly
  (default: false -- meaning sets will be silently ignored if not allowed).

For example:

   ```map.objectFacade({noAdditions:true, throwOnIgnoredSet:true})```

'seal' and 'freeze' are used as alias because they are known names (which are not very descriptive).


## [Changelog](https://github.com/nicolasdejong/map-object-facade/blob/master/CHANGELOG.txt)

## Install

```
$ npm install map-object-facade
```

## License

MIT (C) Nicolas de Jong
