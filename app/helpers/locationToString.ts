export const convertToString = (
  value: string | number | boolean | object | null
): string => {
  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  } else if (value instanceof Object) {
    return JSON.stringify(value);
  } else {
    return '';
  }
};
