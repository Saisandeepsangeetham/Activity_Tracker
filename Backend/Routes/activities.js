import express from 'express';
import { addParticipantActivity, deleteActivity, deleteParticipantActivity, getActivities, getActivityInfomation, newActivity, updateActivity } from '../Controllers/activitiesController.js';

const activityRouter = express.Router();


activityRouter.get('/',getActivities);

activityRouter.post('/',newActivity);

activityRouter.get('/:id',getActivityInfomation);

activityRouter.put('/:id',updateActivity);

activityRouter.delete('/:id',deleteActivity);

activityRouter.post('/:activityId/participants/:userId', addParticipantActivity);

activityRouter.delete('/:activityId/participants/:userId', deleteParticipantActivity);

export default activityRouter;