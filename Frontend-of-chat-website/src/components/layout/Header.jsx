import React, { lazy, Suspense, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '../../constants/color';
import {Menu as MenuIcon ,
     Search as SearchIcon,
      Add as AddIcon,
       Group as GroupIcon,
       Logout as LogoutIcon, 
       Notifications as NotificationsIcon,
    } from '@mui/icons-material';
import axios from 'axios';
import { server } from '../../constants/config';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/auth';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';
import {resetNotificationCount} from '../../redux/reducers/chat'
  

    const SearchDialog = lazy(()=>import("../specific/Serach"));
    const NotificationDialog = lazy(()=>import("../specific/Notifications"));
    const NewGroupDialog = lazy(()=>import("../specific/NewGroup"));
    

const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {isSearch,isNotification,isNewGroup} = useSelector(state=>state.misc)
    const {notificationCount} = useSelector(state=>state.chat)

    
   
    


    const handlieMobile =()=>{
       dispatch(setIsMobile(true))
    }

const openSearch = ()=>{
    dispatch(setIsSearch(true))  
} ;   

const openNewGroup = ()=>{
    dispatch(setIsNewGroup(true))
} ;

const openNotification = ()=>{
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount())
}  ;

const navigateToGroup = ()=>{
    navigate('/groups')
} ;

const logOutHandler = async ()=>{
   
    try {
        const {data} = await axios.get(`${server}/api/v1/user/logout`,
            {withCredentials:true})

            dispatch(userNotExists())
            toast.success(data.msg)

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.msg || "something went wrong")
    }
  
};

  return (
    <>
    <Box sx={{flexGrow:1}} height={"4rem"}>
        <AppBar position='static' sx={{
            bgcolor:orange
        }}>
            <Toolbar>
                <Typography variant='h6' sx={{
                    display:{xs:'none',sm:"block"}
                }}>
                  TALKBRIDGE
                </Typography>

                <Box  sx={{
                    display:{xs:'block',sm:"none"}
                }}>
                    <IconButton color='inherit' onClick={handlieMobile}>
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Box sx={{
                    flexGrow:1,
                }} />
                <Box>

                <IconBtn title={'Search'} onClick={openSearch} icon={<SearchIcon />} />
                <IconBtn title={'New Group'} onClick={openNewGroup} icon={ <AddIcon />} />
                <IconBtn title={'Manage Group'} onClick={navigateToGroup} icon={  <GroupIcon />} />
                <IconBtn title={'Notification'} value={notificationCount} onClick={openNotification} icon={  <NotificationsIcon />} />
                <IconBtn title={'Logout'} onClick={logOutHandler} icon={  <LogoutIcon/>} />
                </Box>
            </Toolbar>
        </AppBar>
    </Box>

{
    isSearch && (
        <Suspense fallback={<Backdrop open />}>
            <SearchDialog />
        </Suspense>
    )
}

{
    isNotification && (
        <Suspense fallback={<Backdrop open />}>
               <NotificationDialog />
        </Suspense>
    )
}
{
    isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
         
            <NewGroupDialog />
        </Suspense>
    )
}

    </>
  )
};

const IconBtn = ({title,icon,onClick,value})=>{
  return (
    <Tooltip title={title} >
        <IconButton color='inherit' size='large' onClick={onClick}>
          {value?<Badge badgeContent={value} color='error'>{icon}</Badge>:icon}
            
           
        </IconButton>

    </Tooltip>
  )
}

export default Header