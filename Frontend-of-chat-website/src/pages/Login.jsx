import { useFileHandler, useInputValidation } from '6pp';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from "axios";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { bgGradient,bgGradient2 } from '../constants/color';
import { server } from '../constants/config';
import { userExists, userNotExists } from '../redux/reducers/auth';
import { userNameValidator } from '../utils/validator';
const Login = () => {
    const [isLogin,setIsLogin] = useState(true);
    const [isLoading,setIsLoading] = useState(false)

    const toggleLogin = ()=> setIsLogin((prev)=> !prev);

    const name = useInputValidation("");
    const bio = useInputValidation("");
    const userName = useInputValidation("",userNameValidator);
    const password = useInputValidation("");

    const avatar = useFileHandler("single");

    const dispatch = useDispatch();

    const handleLogin = async (e) =>{
        e.preventDefault();
        const toastId = toast.loading("Logging In...")
        setIsLoading(true)

        const config = {
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
            },
        };

       try {
            const {data} = await axios.post(`${server}/api/v1/user/login`,{
            username:userName.value,
            password:password.value
        },
        config
    );
        dispatch(userExists(data.user));
        toast.success(data.message,{id:toastId})
       } catch (error) {
       
        toast.error(error?.response?.data?.msg || 'something went wrong',{id:toastId})
       }finally{
        setIsLoading(false)
       }
    };

    const handleSignup = async (e)=>{
        e.preventDefault();
        const toastId = toast.loading("Signing up...")
        setIsLoading(true)

        const formData = new FormData();
        formData.append("avatar",avatar.file);
        formData.append("name",name.value);
        formData.append("bio",bio.value);
        formData.append("username",userName.value);
        formData.append("password",password.value);

        try {
            const config = {
                withCredentials:true,
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
            
            const {data} = await axios.post(`${server}/api/v1/user/new`,
                formData,config);

              
                
                    
                    dispatch(userExists(data.user));
                    
                    toast.success(data.message,{id:toastId});
                
              

        } catch (error) {
            
            // console.log(error)
            toast.error(error?.response?.data?.msg || 'something went wrong',{id:toastId})
            
        }finally{
            setIsLoading(true)
        }
        
    }

  return (
    <div style={{
        backgroundImage:bgGradient
    }}>
    <Container component={"main"} maxWidth={'xs'}
    sx={{
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        // backgroundImage:bgGradient
    }}>
        <Paper elevation={3} 
        sx={
            {
                padding:4,
                display:'flex',
                flexDirection:"column",
                alignItems:"center",
                backgroundImage:bgGradient2
            }}
            >
            {

                isLogin?(
                <>
                <Typography variant='h5'>Login</Typography>
                
                    <form style={
                        {
                            width:"100%",
                            marginTop:"1rem"
                        }}
                        onSubmit={handleLogin}
                        >
                        
                        <TextField 
                        required 
                        fullWidth 
                        label="Username"
                        margin='normal'
                        variant='outlined'
                        value={userName.value}
                        onChange={userName.changeHandler}
                        />
                           <TextField 
                        required 
                        fullWidth 
                        label="Password"
                        type='password'
                        margin='normal'
                        variant='outlined'
                        value={password.value}
                        onChange={password.changeHandler}
                        />

                        <Button
                        sx={{
                             marginTop:"1rem",
                        }}
                        variant='contained'
                        color='primary'
                        type='submit'
                        fullWidth
                        disabled={isLoading}
                        >
                            Login
                        </Button>
                        <Typography textAlign={'center'} m={"1rem"}>OR</Typography>
                        <Button
                        variant='text'
                        color='secondary'
                        fullWidth
                        onClick={toggleLogin}
                        disabled={isLoading}
                        >
                            Sign Up
                        </Button>

                    </form> 

                    </>)
                :(
                    <>
                <Typography variant='h5'>SignUp</Typography>
                
                    <form style={
                        {
                            width:"100%",
                            marginTop:"1rem"
                        }}
                        onSubmit={handleSignup}
                        >
                        <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                            <Avatar sx={{
                                width:"10rem",
                                height:"10rem",
                                objectFit:"contain",
                                
                            }}
                            src={avatar.preview} />
                         
 <IconButton sx={
    {
        position:"absolute",
        bottom:"0",
        right:"0",
        color:"white",
        bgcolor:"rgba(0,0,0,0.5)",
        ":hover":{
            bgcolor:"rgba(255,255,255,0.7)"
        }
    }}
    component = "label"
    >
    <>
    <CameraAltIcon />
    <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
    </>
    </IconButton>                           
                        </Stack>

                        {
                            avatar.error && (
                                <Typography m={'1rem'} color='error' variant='caption' display={'block'} width={'fit-content'}> 
                                {avatar.error} 
                                </Typography>
                            )
                        }


                         <TextField 
                        required 
                        fullWidth 
                        label="Name"
                        margin='normal'
                        variant='outlined'
                        value={name.value}
                        onChange={name.changeHandler}
                        />
                         <TextField 
                        required 
                        fullWidth 
                        label="Bio"
                        margin='normal'
                        variant='outlined'
                        value={bio.value}
                        onChange={bio.changeHandler}
                        />
                        
                        <TextField 
                        required 
                        fullWidth 
                        label="Username"
                        margin='normal'
                        variant='outlined'
                        value={userName.value}
                        onChange={userName.changeHandler}
                        />
                        {
                            userName.error && (
                                <Typography color='error' variant='caption'> 
                                {userName.error} 
                                </Typography>
                            )
                        }
                           <TextField 
                        required 
                        fullWidth 
                        label="Password"
                        type='password'
                        margin='normal'
                        variant='outlined'
                        value={password.value}
                        onChange={password.changeHandler}
                        />

                        <Button
                        sx={{
                             marginTop:"1rem",
                        }}
                        variant='contained'
                        color='primary'
                        type='submit'
                        fullWidth
                        disabled={isLoading}
                        >
                            SignUp
                        </Button>
                        <Typography textAlign={'center'} m={"1rem"}>OR</Typography>
                        <Button
                        variant='text'
                        color='secondary'
                        fullWidth
                        onClick={toggleLogin}
                        disabled={isLoading}
                        >
                            Login
                        </Button>

                    </form> 

                    </>
                )
            }



        </Paper>
    </Container>
    </div>
   

  )
}

export default Login