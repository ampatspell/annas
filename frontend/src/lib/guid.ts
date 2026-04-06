let _guid = 0;
const _cache = new WeakMap<object, number>();

export const guidFor = (object: object) => {
  let guid = _cache.get(object);
  if (!guid) {
    guid = ++_guid;
    _cache.set(object, guid);
  }
  return `${guid}`;
};
