export default {
  upload: (req, res, next) => {
    res.status(200);
    res.json({ url: `/images/uploads/${req.file.filename}`, uploaded: true });
  },

  update: (req, res, next) => {
  },

  delete: (req, res, next) => {
  },
};
