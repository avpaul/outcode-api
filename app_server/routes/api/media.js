import express from 'express';
import multer from 'multer';
import media from '../../controllers/api/media';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dist/images/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null,
      `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});

const upload = multer({
  storage,
});

// media
router.post('/media/upload', upload.single('upload'), media.upload);
router.post('/media/update', upload.single('upload'), media.upload);
router.delete('/media/delete', upload.single('upload'), media.delete);

export default router;
