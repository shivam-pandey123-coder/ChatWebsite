
import {body,validationResult,check, param, query} from 'express-validator'
import { ErrorHandler } from '../utils/utility.js';


const validateHandler = (req,res,next)=>{
    const errors = validationResult(req);
 
    const errorMessages = errors.array().map((error)=> error.msg).join(',')
 
    console.log(errorMessages);
 
    if(errors.isEmpty()){
     return next()
    }else{
     next(new ErrorHandler(errorMessages,400))
    }
 }

const registerValidator = ()=> [
    body('name','Please enter name').notEmpty(),
    body('username','Please enter username').notEmpty(),
    body('bio','Please enter bio').notEmpty(),
    body('password','Please enter password').notEmpty(),
   
];

const loginValidator = () => [
    body("username", "Please Enter Username").notEmpty(),
    body("password", "Please Enter Password").notEmpty()
  ];

  const newGroupValidator = () => [
    body("name", "Please Enter name").notEmpty(),
    body("members").notEmpty().withMessage("enter members").isArray({min:2,max:100}).withMessage('Members must be between 2-100')
  ];

  const addMemberValidator = () => [
    body("chatId", "Please Enter chatId").notEmpty(),
    body("members").notEmpty().withMessage("enter members").isArray({min:1,max:97}).withMessage('Members must be between 1-97')
  ];

  const removeMemberValidator = () => [
    body("chatId", "Please Enter chatId").notEmpty(),
    body("userId", "Please Enter userId").notEmpty()
  ];

 

  const sendAttachmentsValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty()
  ];

  

   const chatIdValidator = ()=>[
    param('id','please enter chat Id').notEmpty()
    
   ];

   const renameValidator = ()=>[
    param('id','please enter Id').notEmpty(),
    body('name','please enter new name').notEmpty()

   ]

   const sendRequestValidator = ()=>[
    body('userId','please enter user Id').notEmpty()

   ]
 
   const acceptRequestValidator = ()=>[
    body('requestId','please enter Request Id').notEmpty(),
    body('accept','please add Accept').notEmpty().isBoolean().withMessage('request must be boolean')
   ];

   const adminLoginValidator = () => [
    body("secretKey", "Please Enter Secret Key").notEmpty(),
  ];
  
 


export {registerValidator,
    sendAttachmentsValidator,
    validateHandler,
    loginValidator,
    newGroupValidator,
    addMemberValidator,
    removeMemberValidator,
    renameValidator,
    chatIdValidator,
    sendRequestValidator,
    acceptRequestValidator,
    adminLoginValidator

}