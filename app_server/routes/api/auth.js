// admin/user
import user from '../../controllers/api/user';
import router from '../admin';

router.get('/login', user.get);
router.post('/login', user.auth);
router.post('/signup', user.create);

