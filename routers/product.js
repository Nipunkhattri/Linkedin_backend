import express from 'express';
import { AdminLogin , Register ,form1,fetchdatPost ,ProUp,addexpdata,EditPro,EdataUp,EditExp,fetchProdata,addprodata ,form2, fetchexpdata,getprofiledata} from '../controllers/Authcontollers.js';
const router = express.Router();

router.post('/loginnow',AdminLogin);
router.post('/register',Register);
router.post('/profile/form1',form1);
router.post('/profile/about',form2);
router.get('/profile/:id',getprofiledata);
router.post('/profile/exp',addexpdata);
router.post('/profile/project',addprodata);
router.get('/exp/:id',fetchexpdata);
router.get('/Pro/:id',fetchProdata);
router.get('/EditById/:id',EditExp)
router.get('/EProById/:id',EditPro)
router.post('/Exp/Up',EdataUp)
router.post('/Pro/Up',ProUp)
router.get('/fetchpost',fetchdatPost)
export default router;