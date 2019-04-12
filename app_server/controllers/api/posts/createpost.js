import Boom from 'boom';
import moment from 'moment/moment';
import mongoose from 'mongoose';

const Post = mongoose.model('Post');


const newPost = (req, res, next) => {
  const b = req.body;
  const s = req.query.status || 'editing';
  let bs;
  const u = req.payload.email;

  bs = JSON.parse(b.postSettings) || {};

  if (u === '') {
    next(Boom.badRequest('author not found'));
  }

  const p = {
    title: bs.title,
    author: u,
    category: bs.category,
    stickOnFront: bs.stickOnFront || false,
    pendingReview: bs.pendingReview || false,
    tags: bs.tags || [],
    shareOn: bs.shareOn || [],
    excerpt: bs.excerpt || '',
    publicationDate: _getDate(bs.publicationDate) || new Date(),
    featuredImage: bs.featuredImage || '',
    content: b.editorData,
    wordCount: bs.wordCount || 0,
  };
  post.new(p, (s) => {
    if (s.saved === true) {
      res.cookie('editingPostID', s.id, {
        expires: new Date(Date.now() + 604800),
        sameSite: true,
      });
      res.status(200);
      res.json(s);
    }
  });


  // Post id ==>
  // year:2018 |month:09 |day:06 |hour:15
  // index number:01 => 2018 09 06 15 01 =>201809061501
  // Create a post id

  // Find the latest id from the DB
  Post.find()
    .sort({ id: -1 })
    .limit(1)
    .then((lp) => {
      if (Array.isArray(lp) && lp.length !== 0) {
        p.id = Number(this.createID(lp[0].id));
      } else if (Array.isArray(lp) && lp.length === 0) {
        p.id = Number(this.createID(0));
      }
      // Create post in the DB
      Post.create(p)
        .then((np) => {
          done({
            saved: true,
            id: np.id,
          });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// Post id code generator
const createID = (latestID) => {
  let id = latestID;
  const currentDate = moment.utc();
  const currentYear = currentDate.format('YYYY');
  const currentMonth = currentDate.format('MM');
  const currentDay = currentDate.format('DD');
  const currentHour = currentDate.format('HH');

  function getIndex() {
    const lis = id.toString();
    const latestIDYear = lis.substring(0, 4);
    const latestIDMonth = lis.substring(4, 6);
    const latestIDDate = lis.substring(6, 8);
    let latestIDIndex = lis.substring(10, 12);
    const latestIDFullDate = moment.utc(`${latestIDYear}-${latestIDMonth}-${latestIDDate}`);
    const sameDay = moment.utc().isSame(latestIDFullDate, 'day');

    if (sameDay) {
      const newIndex = (++latestIDIndex).toString();
      return (newIndex.length === 1) ? `0${newIndex}` : newIndex;
    }
    return '01';
  }
  const index = (latestID === 0) ? `0${++id}` : getIndex();


  id = `${currentYear}${currentMonth}${currentDay}${currentHour}${index}`;
  return id;
};

export default newPost;
