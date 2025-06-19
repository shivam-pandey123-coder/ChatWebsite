import { Typography,Box } from '@mui/material';
import { lightBlue } from '../../constants/color';
import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../../lib/feature';
import RenderAttachment from './RenderAttachment';
import { use } from 'react';
import { motion } from "framer-motion";


const MessageComponent = ({message, user}) => {
    const {sender, content ,attachments =[],createdAt} = message;
    // console.log(attachments)
   
    const sameSender = sender?._id === user?._id;
  
    
    const timeAgo = moment(createdAt).fromNow();
    // const url = attchments.url;
    // const file = fileFormat(url);
  return (
    <motion.div
    initial={{opacity:0,x:"-100%"}}
    whileInView={{opacity:1,x:0}}
    style={{
        alignSelf:sameSender?'flex-end':'flex-start',
        backgroundColor:'white',
        color:'black',
        borderRadius:'5px',
        padding:"0.5rem",
        width:'fit-content'
    }}
    >
    
    {!sameSender && <Typography variant={'caption'} fontWeight={'600'} color={lightBlue}>{sender.name}</Typography>}

    { content && <Typography>{content}</Typography>}

    {attachments.map((attachment,index) =>{

        const url = attachment.url;
        const file = fileFormat(url);
        return <Box key={index} >
            <a href={url} target='_blank' download style={{
                color:'black'
            }}>
                 <RenderAttachment file={file} url={url} />
            </a>
        </Box>
})}
    <Typography variant={'caption'} color={'text.secondaty'}>{timeAgo}</Typography>
    
    
    </motion.div>
  )
}

export default memo(MessageComponent)