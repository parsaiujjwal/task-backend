import express from 'express';
import { signUp, signIn,getTotalUsersCount, userCount } from '../controller/user.controller.js';
const route = express.Router();

route.post('/signUp',signUp);
route.post('/signIn',signIn);
route.get("/totalUsersCount",getTotalUsersCount);
route.post("/count",userCount);

export default route;