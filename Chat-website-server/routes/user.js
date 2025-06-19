import express from 'express';
import { getMyFriends,login , newUser,getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getMyNotifications } from '../controllers/user.js';
import {singleAvatar} from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { loginValidator, registerValidator,acceptRequestValidator, sendRequestValidator, validateHandler } from '../lib/validators.js';
const app = express.Router();

app.post('/new',singleAvatar,registerValidator(),validateHandler,newUser);
app.post('/login',loginValidator(),validateHandler,login);

//After here user must be logged in to access the routes

app.use(isAuthenticated);
 
app.get('/me',getMyProfile);

app.get('/logout',logout);

app.get('/search',searchUser);

app.put('/sendrequest',sendRequestValidator(),validateHandler,sendFriendRequest);

app.put('/acceptrequest',acceptRequestValidator(),validateHandler,acceptFriendRequest);

app.get('/notification',getMyNotifications);

app.get('/friends',getMyFriends)

export default app;