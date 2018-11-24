export default function filterObjectByKeys(object, keys, exclude) {
  return Object.keys(object).reduce((accum, key) => {
    if ((exclude && !keys.includes(key)) || (!exclude && keys.includes(key))) {
      return { ...accum, [key]: object[key] };
    }
    return accum;
  }, {});
}
