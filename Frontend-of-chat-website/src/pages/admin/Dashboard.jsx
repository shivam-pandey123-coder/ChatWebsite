import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper,Skeleton,Stack, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon,
   Group as GroupIcon,
    Notifications as NotificationsIcon, 
    Person as PersonIcon, 
    Message as MessageIcon,
    ImageOutlined,
  } from '@mui/icons-material'
import moment from 'moment'
import { CurveButton, SearchField } from '../../components/styles/StyledComponents';
import {LineChart , DoughnutChart} from '../../components/specific/Charts';
import { server } from '../../constants/config';
import axios from "axios";

const Dashboard = () => {
 
  const [stats, setStats] = useState(null); // State to store backend data
  const [loading, setLoading] = useState(true); // State to manage loading


  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`${server}/api/v1/admin/stats`, { withCredentials: true });
        setStats(data?.stats); 
        setLoading(false);
     
        
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const Appbar = <Paper elevation={3}
    sx={{
      padding:'2rem',
      margin:'2rem 0',
      borderRadius:'1rem'
    }}
  >
<Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
    <AdminPanelSettingsIcon sx={{
      fontSize:'3rem'
    }}/> 
  <SearchField placeholder='search' />
  <CurveButton>Search</CurveButton>
    <Box flexGrow={1} />

    <Typography 
    display={{
      xs:'none',
      lg:'block',
    }}
    color={'rgba(0,0,0,0.7'}
    textAlign={'center'}
    >
      {moment().format('dddd D MMMM YYYY')}
    </Typography>
    <NotificationsIcon />

</Stack>

  </Paper>

  const Widgets =( <Stack 
  direction={{
    xs:'column',
    sm:'row'
  }}
 spacing='2rem'
  justifyContent='space-between'
  alignItems='center'
  margin={'2rem 0'}
  >
    <Widget title={'users'} value={stats?.usersCount || 0} Icon={<PersonIcon />} />
    <Widget title={'chats'} value={stats?.totalChatsCount || 0} Icon={<GroupIcon />} />
    <Widget title={'messages'} value={stats?.messagesCount || 0} Icon={<MessageIcon />} />
  </Stack>
  );
 

  return loading ?<Skeleton height={"100vh"}/>:(
    <AdminLayout>
     <Container component={'main'}>
      {Appbar}

      <Stack direction={{
        xs:'column',
        lg:'row',
      }} 
      flexWrap={'wrap'}
       justifyContent={'center'}
        alignItems={{
          xs:'center',
          lg:'stretch'
        }}
        sx={{
          gap:'2rem'
        }}
      >

        <Paper sx={{
          padding:'2rem 3.5rem',
          borderRadius:'1rem',
          width: { xs: '100%', md: '100%',lg:'55%' },
          // width:'100rem',
          maxWidth:'45rem',
          flexGrow:1,
          minWidth: '300px',
          
        }}
         elevation={3}
        >
          <Typography margin={'2rem 0'} variant={'h4'} >
            
            Last Messages
            </Typography>
          <LineChart value={stats.messagesChart || []} />
        </Paper >

        <Paper elevation={3}
        sx={{
          padding:'1rem',
          borderRadius:'1rem',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          width: { xs: '100%', md: '100%',lg:'45%' },
          position:'relative',
          
          maxWidth:'25rem',  
          flexGrow:1
        }}
        >
         <DoughnutChart labels={['single chat','Group chat']}  value={[stats.totalChatsCount - stats.groupsCount || 0,stats.groupsCount || 0]}/>
         <Stack 
          position={'absolute'}
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={'0.5rem'}
          width={'100%'}
          height={'100%'}
          
         >
            <GroupIcon /> <Typography>vs</Typography>
            <PersonIcon />
         </Stack>
        </Paper>

      </Stack>
   
        {Widgets}
   

     </Container>
    </AdminLayout>
  )
}

const Widget = ({title,value,Icon})=>{
  return(
    <Paper 
      elevation={3}
      sx={{
        padding:'2rem',
        margin:'2rem 0',
        borderRadius:'1.5rem',
        width:'20rem'
      }}
    >

        <Stack alignItems={'center'}  spacing={'1rem'}>
              <Typography 
                sx={{
                  color:'rgba(0,0,0,0.7)',
                  borderRadius:'50%',
                  border:'5px solid rgba(0,0,0,0.9)',
                  width:'5rem',
                  height:'5rem',
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center'
                }}
              >{value}</Typography>
              <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
                {Icon}
                <Typography>{title}</Typography>
              </Stack>
        </Stack>

    </Paper>
  )
 
 
}

export default Dashboard