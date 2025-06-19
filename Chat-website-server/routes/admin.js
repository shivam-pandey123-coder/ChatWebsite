import express from 'express';
import { allChats, allUsers, allMessages,getDashboardStats,adminLogin ,adminLogut,getAdminData} from '../controllers/admin.js';
import { adminLoginValidator, validateHandler } from '../lib/validators.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();




app.post('/verify',adminLoginValidator(),validateHandler,adminLogin);

app.get('/logout',adminLogut);

//ONLY ADMIN CAN ACCESS THESE ROUTES
app.use(adminOnly)

app.get('/',getAdminData);

app.get("/users",allUsers);
app.get("/chats",allChats);

app.get("/messages",allMessages);

app.get("/stats",getDashboardStats);




export default app