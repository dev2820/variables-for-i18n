export const assignStr = (obj: Object, key: string, value: string) => {
  const [propertyName, ...restPath] = key.split('/');
  if (restPath.length > 0) {
    if (obj[propertyName] === undefined) {
      obj[propertyName] = {};
    }
    assignStr(obj[propertyName], restPath.join('/'), value);
  } else {
    obj[propertyName] = value;
  }
};
