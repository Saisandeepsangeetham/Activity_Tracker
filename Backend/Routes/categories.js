import express from 'express';
import { addCategory, deleteCategory, getCategories, getCategoryInformation, updateCategory } from '../Controllers/categoriesController.js';

const categoryRouter = express.Router();

categoryRouter.get('/',getCategories)

categoryRouter.post('/',addCategory);

categoryRouter.get('/:id',getCategoryInformation);

categoryRouter.put('/:id',updateCategory);

categoryRouter.delete('/:id',deleteCategory);

export default categoryRouter;