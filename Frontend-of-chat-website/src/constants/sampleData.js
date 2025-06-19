

export const sampleChats = [

{
    avatar:['https://www.w3schools.com/howto/img_avatar.png'],
    name:'john doe',
    _id:'1',
    groupChat:false,
    members:['1','2']
},
{
    avatar:[
        'https://www.w3schools.com/howto/img_avatar.png',
    ],
    name:'john banega don',
    _id:'2',
    groupChat:true,
    members:['1','2']
},

]

export const sampleUsers = [
    {
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
        name:'john doe',
        _id:'1',
        
    },
    {
        avatar:
            'https://www.w3schools.com/howto/img_avatar.png',
        
        name:'john banega don',
        _id:'2',
     
    },
]

export const sampleNotifications = [
    {
       sender:{
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
        name:'john doe',
       },
        _id:'1',
        
    },
    {
      sender:{
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
        name:'john banega don',
      },
        _id:'2',
     
    },
]

export const sampleMessage = [
    {
        attachments:[
    ],
       
   
    content:"hi how are you",
    _id:'smddhhfd',
    sender:{
        _id:'user._id',
        name:'chaman',

    },
    chat:'chatid',
    
    createdAt:'2024-02-12T10:41:30.630z',
},

{
    attachments:[
        {
        public_id:'addf 2',
        URL:'https://www.w3schools.com/howto/img_avatar.png',
},],
   

content:"",
_id:'smddfd',
sender:{
    _id:'sdd',
    name:'chaman 2',

},
chat:'chatid',
createdAt:'2024-02-12T10:41:30.630z',
}
]

export const dashboardData = {
  users:[
    {
        name:'john doe',
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
       
        _id:'1',
        username:"John-doe",
        friends:20,
        groups:5
    },
    {
        name:'john doe',
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
       
        _id:'2',
        username:"John-d@oe",
        friends:26,
        groups:8
    }
  ] ,
  chats:[{
    name:'family group',
    avatar:['https://www.w3schools.com/howto/img_avatar.png'],
   
    _id:'1',
    groupChat:false,
    members:[{_id:'1',avatar:'https://www.w3schools.com/howto/img_avatar.png'},{_id:'',avatar:'https://www.w3schools.com/howto/img_avatar.png'},],
   
    totalMembers:26,
    totalMessages:8,
    creator:{
        name:'john jhony',
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
    }
  },
  {
    name:'friends gorups ',
    avatar:['https://www.w3schools.com/howto/img_avatar.png'],
   
    _id:'2',
    groupChat:false,
    members:[{_id:'1',avatar:'https://www.w3schools.com/howto/img_avatar.png'},{_id:'',avatar:'https://www.w3schools.com/howto/img_avatar.png'},],
   
    totalMembers:26,
    totalMessages:8,
    creator:{
        name:'john jhony',
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
    }
  }

],
messages:[
    {
        attachments:[],
    content:"Hi i am rishav",
    _id:'smddhhfd',
    sender:{
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
        name:'chaman',

    },
    chat:'chatid',
    groupchat:false,
    createdAt:'2024-02-12T10:41:30.630z',
},
{
    attachments:[
        {
        public_id:'addf 2',
        URL:'https://www.w3schools.com/howto/img_avatar.png',
},],
   

content:"hi i am ram",
_id:'smddfd',
sender:{
    avatar:'https://www.w3schools.com/howto/img_avatar.png',
    name:'chaman 2',

},
chat:'chatid',
groupchat:true,
createdAt:'2024-02-12T10:41:30.630z',
}
],
}