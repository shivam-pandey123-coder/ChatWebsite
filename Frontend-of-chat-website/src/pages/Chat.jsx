import { useInfiniteScrollTop } from "6pp";
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layout/AppLayout';
import { TypingLoader } from '../components/layout/Loaders';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents'; 
import { grayColor, orange } from '../constants/color';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events";
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { setIsFileMenu } from '../redux/reducers/misc';
import { getSocket } from '../socket';


const Chat = ({chatId,user}) => {

  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message,setMessage] = useState("");
  const [messages,setMessages] = useState([]);
  const [page,setPage] = useState(1);
  const [fileMenuAnchor,setFileMenuAnchor] = useState(null);
  const [IamTyping,setIamTyping] = useState(false);
  const [userTyping,setUserTyping] = useState(false);

  const typingTimeOut = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.msg
  );
  
  
  const errors = [
    {isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}
  ];

 

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e)=>{
    setMessage(e.target.value);
    if(!IamTyping){
      socket.emit(START_TYPING,{members,chatId});
      setIamTyping(true)
    };
    if(typingTimeOut.current)  clearTimeout(typingTimeOut.current)

  typingTimeOut.current =   setTimeout(()=>{
        socket.emit(STOP_TYPING,{members,chatId})
          setIamTyping(false)
    },[2000])
   
  } 

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget); 
  };
  

  
  const submitHandler = (e)=>{
    e.preventDefault();
    if(!message.trim()) return;
    

    //emiting message to the server

    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage("");
  };

  useEffect(()=>{
    socket.emit(CHAT_JOINED,{userId:user._id,members})

    dispatch(removeNewMessagesAlert(chatId))

    return()=>{
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED,{userId:user._id,members})
    };
  },[chatId]);

  useEffect(()=>{
    if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"})
  },[messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListner = useCallback((data)=>{

    if(data.chatId !== chatId) return;
    
    setMessages(prev =>[...prev,data.message])
  },[chatId]);

  const startTypingListner = useCallback((data)=>{

    if(data.chatId !== chatId) return;
    setUserTyping(true)
    
  },[chatId]);

  const stopTypingListner = useCallback((data)=>{

    if(data.chatId !== chatId) return;
    setUserTyping(false)
    
 
  },[chatId]);

  const alertListner = useCallback((data)=>{
   
    if(data.chatId !== chatId) return;
    const messageForAlert = {
      content:data.message,
    
      sender:{
          _id:"kljdfglkjdslf;",
          name:'Admin'
      },
      chat:chatId,
      createdAt : new Date().toISOString()
  };
  setMessages((prev)=>[...prev,messageForAlert])

  },[chatId]);


  const eventHandler = {
    [ALERT]:alertListner,
    [NEW_MESSAGE]:newMessagesListner,
    [START_TYPING]:startTypingListner,
    [STOP_TYPING]:stopTypingListner,
  }

  useSocketEvents(socket,eventHandler);
  useErrors(errors);
 



   const allMessages = [...oldMessages, ...messages];




  return chatDetails.isLoading ? <Skeleton />  :(
    <Fragment>
      <Stack
        
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',         // Take full height of the parent
          boxSizing: 'border-box',
          bgcolor: grayColor,
        }}
      >
       
        <Stack
      
        ref={containerRef}
          sx={{
            flexGrow: 1,         // This will fill the available space
            overflowY: 'auto',
            overflowx:'hidden',   // Enable scrolling
            padding: '1rem',
          }}
        >
          {allMessages.map((i,index)=> (
            <MessageComponent key={i._id || `${index}-${i.timestamp}`} message={i} user={user} />
          ))}

          {userTyping && <TypingLoader />}

          <div ref={bottomRef} />


        </Stack>

        {/* Form area */}
        <form
          style={{
            display: 'flex',
            padding: '1rem',
            borderTop: '1px solid #ccc',
            backgroundColor: '#fff',
            position:'relative'
          }}
          onSubmit={submitHandler}
        >
          <IconButton
          sx={{
            position:'absolute',
            left:'1.5rem'
          }}
          onClick={handleFileOpen}
         
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder='Type your message here' style={{ flexGrow: 1 }}
           value={message}
            onChange={messageOnChange} /> {/* Input box takes remaining space */}

          <IconButton type='submit' sx={{
            
            backgroundColor:orange,
            color:'white',
            marginLeft:'1rem',
            padding:'0.5rem',
            "&:hover":{
              bgcolor:'error.dark'
            }
          }}>
            <SendIcon />
          </IconButton>
          
     
        </form>
        <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
      </Stack>
    </Fragment>
  );
};

export default AppLayout()(Chat);