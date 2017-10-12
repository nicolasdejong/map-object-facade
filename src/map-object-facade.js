'use strict'

/**
 * Use a map like an object.
 *
 * options can hold any of:
 * - noAdditions (alias: seal) that allows changing values, but no new keys (default: false)
 * - readonly (alias: freeze) that allows no changes whatsoever (default: false)
 * - throwIgnoredSet will throw if set is not allowed due to noAdditions / readonly
 *   (default: false -- meaning sets will be silently ignored if not allowed).
 */
module.exports = function mapAsObject(map, options) {
  const target = map;
  const prototype = Object.getPrototypeOf(map);
  options || (options = {});
  const noAdditions = options.noAdditions || options.seal;
  const readonly    = options.readonly || options.freeze;
  const throwOnSet  = options.throwOnIgnoredSet;
  const performSet = (prop, value) => {
    if (readonly || (noAdditions && !target.has(prop))) {
      if (throwOnSet) throw new TypeError('Cannot set "' + prop + '" ' +  (readonly ? 'while readonly' : ', no new keys allowed'));
    } else {
      target.set(prop, value);
    }
    return true;
  };
  const performDelete = prop => {
    if (readonly) {
      if (throwOnSet) throw new TypeError('Cannot delete "' + prop + '" while readonly');
    } else {
      target.delete(prop);
    }
    return true;
  };

  return new Proxy(target, {
    get: (obj, prop) => {
      let result;
      if (prop in prototype) {
        result = target[prop];
        if (typeof result === 'function') {
          switch(prop) {
            case 'set':    result = (prop, value) => performSet(prop, value); break;
            case 'delete': result = prop => performDelete(prop); break;
            default:       result = result.bind(target);
          }
        }
      } else {
        result = target.get(prop);
      }
      return result;
    },
    set: (obj, prop, value) => {
      return performSet(prop, value);
    },
    has: (obj, prop) => {
      return target.has(prop);
    },
    deleteProperty: (obj, prop) => {
      return performDelete(prop);
    },
    ownKeys: (obj) => {
      return Object.isExtensible(target) ? Array.from(target.keys()) : [];
    },
    getOwnPropertyDescriptor: (obj, prop) => {
      return target.has(prop) ? {
        value:        target.get(prop),
        writable:     !readonly,
        configurable: Object.isExtensible(target),
        enumerable:   true
      } : undefined;
    }
  });
};
