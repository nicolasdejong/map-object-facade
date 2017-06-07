'use strict'
require('../src/map-object-facade');

describe('map-object-facade', () => {
  const testMap = options => {
    const map = new Map().objectFacade(options);
    map.a = 1;
    map.b = 2;
    map['c'] = 3;
    return map;
  };

  it('transparent', () => {
    const map = new Map();
    map.set('a', 11);
    const fmap = map.objectFacade();
    expect(fmap.a).toEqual(11);
    fmap.a = 12;
    expect(fmap.a).toEqual(12);
    expect(map.get('a')).toEqual(12);
    map.set('a', 13);
    expect(fmap.a).toEqual(13);
  });
  it('allows normal map behaviour', () => {
    const map = new Map().objectFacade();
    expect(map.size).toEqual(0);
    map.set('a', 123);
    expect(map.size).toEqual(1);
    expect(map.has('a')).toEqual(true);
    expect(map.get('a')).toEqual(123);
  });
  it('iterate', () => {
    const map = testMap();
    const map2 = new Map(/*iterable*/map).objectFacade();
    expect(map.a).toEqual(map2.a);
    expect(map.size).toEqual(map2.size);
  });
  it('get/set as in object', () => {
    const map = new Map().objectFacade();
    map.a = 123;
    expect(map.size).toEqual(1);
    expect(map.has('a')).toEqual(true);
    expect(map.get('a')).toEqual(123);
    expect(map.a).toEqual(123);
  });
  it('delete key', () => {
    const map = testMap();
    expect('a' in map).toEqual(true);
    delete map.a;
    expect('a' in map).toEqual(false);
    expect(map.size).toEqual(2);
  });
  it('Object.entries', () => {
    if (typeof Object.entries === 'function') {
      const map = testMap();
      const entries = Object.entries(map);
      expect(entries.length).toEqual(3);
    }
  });
  it('Object.keys', () => {
    expect(Object.keys(testMap())).toEqual(['a', 'b', 'c']);
  });
  it('Object.values', () => {
    if (typeof Object.values === 'function') {
      const map = testMap();
      expect(Object.values(map)).toEqual([1, 2, 3]);
    }
  });
  it('Object.assign', () => {
    const map = testMap();
    const obj = Object.assign({}, map);
    expect(Object.keys(obj)).toEqual(['a', 'b', 'c']);
  });
  it('options.noAdditions', () => {
    const map = testMap();
    const map2 = map.objectFacade({noAdditions:true});
    map.d = 4;
    expect(map.size).toEqual(4);
    map2.d = 44;
    expect(map.d).toEqual(44);
    map2.e = 5;
    expect(map.size).toEqual(4);
    const map3 = map.objectFacade({noAdditions:true, throwOnIgnoredSet:true});
    expect(() => map3.e = 5).toThrow();
  });
  it('options.readonly', () => {
    const map = testMap();
    const map2 = map.objectFacade({readonly:true});
    map.d = 4;
    expect(map.size).toEqual(4);
    map2.d = 44;
    expect(map.d).toEqual(4);
    map2.e = 5;
    expect(map.size).toEqual(4);
    const map3 = map.objectFacade({readonly:true, throwOnIgnoredSet:true});
    expect(() => map3.d = 5).toThrow();
    expect(() => delete map3.d).toThrow();
    expect(() => map3.set('d', 5)).toThrow();
  });
});
