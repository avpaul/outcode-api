import Slug from 'slug';

export const slugGenerator = text => Slug(text, { lower: true, remove: /[.||!||?]/g }).concat(`-${Date.now()}`);

export const slugCompare = (text, oldSlug) => {
  const newSlug = slugGenerator(text);
  if (
    newSlug.substring(0, newSlug.lastIndexOf('-'))
    === oldSlug.substring(0, oldSlug.lastIndexOf('-'))
  ) {
    return oldSlug;
  }
  return newSlug;
};
