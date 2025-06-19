
import { compare } from 'bcrypt';
import {User} from '../models/user.js';
import { sendToken,cokkieOption, emitEvent, uploadFilesToCloudinary } from '../utils/features.js';
import { TryCatch } from '../middlewares/error.js';
import {ErrorHandler} from '../utils/utility.js';
import { Chat } from '../models/chat.js';
import {Request} from '../models/request.js'
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import {getOtherMember} from '../lib/helper.js'


//CREATE A NEW USER AND SAVE IT TO THE DATABASE AND SAVE Token IN COOKIE
const newUser = TryCatch(async (req,res,next)=>{
  const {name,username,password,bio} = req.body;
  const file = req.file;
  // console.log(file);

  if(!file) return next(new ErrorHandler('Please Upload Avatar',200));

  const result = await uploadFilesToCloudinary([file]);
 
  
  const avatar = {
      public_id:result[0].public_id,
      url: result[0].url
  }

const user =  await User.create({
      name,
      bio,
      username,
      password,
      avatar,
  });
 
  sendToken(res,user,201,"user Created")
});

//Login user and save token

let login = TryCatch(
    async(req,res,next)=>{
   
        let {username,password} = req.body;
    let user = await User.findOne({username}).select("+password");

    if(!user){
        return next(new ErrorHandler('Invalid username',404))
    }

    const isMatch = await compare(password,user.password);
    if(!isMatch){
        return next(new Error("Invalid Password",404));
    };
    
    sendToken(res,user,200,`Welcome Back ${user.name}`)
    
}
)

const getMyProfile = TryCatch(
    async(req,res,next)=>{
        const user =  await User.findById(req.user).select('-password');
         res.status(200).json({
             success:true,
             user
         })
     }
);

const logout = TryCatch(
    async(req,res,next)=>{
        
        return res.status(200).cookie('chattu-token','',{...cokkieOption,maxAge:0}).json({
             success:true,
             msg:'logged out succesfully'
         })
     }
);

const searchUser = TryCatch(async (req, res,next) => {
    const { name = "" } = req.query;
  
    // Finding All my chats
    const myChats = await Chat.find({ groupChat: false, members: req.user });
  
    //  extracting All Users from my chats means friends or people I have chatted with
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);
  
    // Finding all users except me and my friends
    const allUsersExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersFromMyChats },
      name: { $regex: name, $options: "i" },
    });
  
    // Modifying the response
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));
  
    return res.status(200).json({
      success: true,
      users,
    });
  });

  const sendFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;
  
    const request = await Request.findOne({
      $or: [
        { sender: req.user, receiver: userId },
        { sender: userId, receiver: req.user },
      ],
    });
  
    if (request) return next(new ErrorHandler("Request already sent", 400));
  
    await Request.create({
      sender: req.user,
      receiver: userId,
    });
  
    emitEvent(req, NEW_REQUEST, [userId]);
  
    return res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  });

 const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  // Normalize and check for existing chat
  const members = [request.sender._id, request.receiver._id].sort();

  const existingChat = await Chat.findOne({ members });
  if (existingChat) {
    // Delete the friend request but return the existing chat
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Accepted",
      chatId: existingChat._id,
    });
  }

  // Create new chat
  const chat = await Chat.create({
    members,
    name: `${request.sender.name}-${request.receiver.name}`,
  });

  await request.deleteOne();

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    chatId: chat._id,
    senderId: request.sender._id,
  });
});

  const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

  const getMyFriends = TryCatch(async (req, res) => {
    const chatId = req.query.chatId;
  
    const chats = await Chat.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");

  // console.log("Populated chats:", JSON.stringify(chats, null, 2));
  
    const friends = chats.map(({ members }) => {
      const otherUser = getOtherMember(members, req.user);
      // console.log(otherUser)
  
      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });
  
    if (chatId) {
      const chat = await Chat.findById(chatId);
  
      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );
  
      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }
  });

export {login,
     newUser,
      getMyProfile,
       logout, 
       searchUser,
       sendFriendRequest,
       acceptFriendRequest,
       getMyNotifications,
       getMyFriends
    }