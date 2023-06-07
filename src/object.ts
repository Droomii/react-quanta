export function deepEqual<T>(obj1: T, obj2: T): boolean {
  if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!deepEqual(obj1[key as keyof T], obj2[key as keyof T])) {
        return false;
      }
    }

    return true;
  }

  return obj1 === obj2;
}