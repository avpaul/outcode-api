import Slug from 'slug';

const slugGenerator = text => Slug(text, { lower: true, remove: /[.||!||?]/g }).concat(`-${Date.now()}`);

export default slugGenerator;
