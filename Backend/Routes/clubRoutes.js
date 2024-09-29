import express from 'express';
import { getallClubs, getclubProfileID, updateclubInfo, deleteclub, addClub, getallclubEvents } from '../Controllers/clubControllers.js';
import { authenticateAddOption, authenticateEditOption } from '../Middlewares/clubAuthMiddleWare.js';

const clubRouter = express.Router();

clubRouter.get('/allclubs',getallClubs);
clubRouter.get('/:id',getclubProfileID);
clubRouter.post('/:id',authenticateEditOption,updateclubInfo);
clubRouter.delete('/:id',authenticateEditOption,deleteclub);
clubRouter.post('/add',authenticateAddOption,addClub);
clubRouter.get('/allevents/:id',getallclubEvents);

export default clubRouter;