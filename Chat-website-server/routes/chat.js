import express from 'express';
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from '../controllers/chat.js';
import { addMemberValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, validateHandler } from '../lib/validators.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { attachmentsMulter } from '../middlewares/multer.js';
const app = express.Router();


app.use(isAuthenticated);

app.post('/new',newGroupValidator(),validateHandler,newGroupChat);

app.get('/my',getMyChats);

app.get('/my/groups',getMyGroups);

app.put('/addmembers',addMemberValidator(),validateHandler,addMembers);

app.put("/removemember",removeMemberValidator(),validateHandler,removeMembers);

app.delete("/leave/:id",chatIdValidator(),validateHandler,leaveGroup)


//send Attachmets
app.post('/message',attachmentsMulter,sendAttachmentsValidator(),validateHandler,sendAttachments);

//Get MESSAGE
app.get('/message/:id',chatIdValidator(),validateHandler,getMessages);

//Get chat details,rename,delete
app
.route("/:id")
.get(chatIdValidator(),validateHandler,getChatDetails)
.put(renameValidator(),validateHandler,renameGroup)
.delete(chatIdValidator(),validateHandler,deleteChat)



export default app;