// @flow

type Type = 'undefined'
          | 'number'
          | 'string'
          | 'null'
          | [ Type ]
          | { [key: string]: Type }

type Bucket = {
  arrayChildren: Bucket | void,
  objectChildren: { [key: string]: Bucket},
  counts: BucketCounts,
};

type BucketCounts = {
  'undefined': number,
  'number': number,
  'string': number,
  'null': number,
  'array': number,
  'object': number,
};

const makeNewBucket = (): Bucket => ({
  arrayChildren: undefined,
  objectChildren: {},
  counts: {
    'undefined': 0,
    'number': 0,
    'string': 0,
    'null': 0,
    'array': 0,
    'object': 0,
  },
});

const incrBucket = (key: $Keys<BucketCounts>, bucket: Bucket) => {
  const { arrayChildren, objectChildren, counts } = bucket;
  return {
    arrayChildren,
    objectChildren,
    counts: {
      ...counts,
      [key]: (counts[key] || 0) + 1,
    },
  }
};

const addArrayItemToBucket = (item, bucket) => {
  const { arrayChildren, objectChildren, counts } = bucket;
  return {
    arrayChildren: (() => {
      if (typeof arrayChildren === 'undefined') {
        return addToBucket(item, makeNewBucket());
      }
      return addToBucket(item, arrayChildren);
    })(),
    objectChildren,
    counts,
  };
};

const addToBucket = (item, bucket) => {
  if (typeof item === 'undefined') {
    return incrBucket('undefined', bucket);
  }
  if (typeof item === 'number') {
    return incrBucket('number', bucket);
  }
  if (typeof item === 'string') {
    return incrBucket('string', bucket);
  }
  if (item === null) {
    return incrBucket('null', bucket);
  }
  if (Array.isArray(item)) {
    const bucket1 = item.reduce((bucket, elem) => {
      return addArrayItemToBucket(elem, bucket);
    }, bucket);
    return incrBucket('array', bucket1);
  }
  return incrBucket('object', bucket);
};

export const collect = (items: Array<*>): Bucket => {
  return items.reduce((bucket, item) => addToBucket(item, bucket), makeNewBucket());
};
