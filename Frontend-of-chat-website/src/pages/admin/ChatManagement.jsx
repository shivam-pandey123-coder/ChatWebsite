import { Avatar, Skeleton, Stack } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import AvatarCard from '../../components/shared/AvatarCard';
import Table from '../../components/shared/Table';
import { server } from '../../constants/config';
import { transformImage } from '../../lib/feature';

const columns=[{
  field:"id",
  headerName:'ID',
  headerClassName:'table-header',
  width:200
},
{
  field:"avatar",
  headerName:'Avatar',
  headerClassName:'table-header',
  width:150,
  renderCell: (params)=> <AvatarCard  avatar={params.row.avatar} />
},
{
  field:"name",
  headerName:'Name',
  headerClassName:'table-header',
  width:300
},
{
  field:"totalMembers",
  headerName:'Total Members',
  headerClassName:'table-header',
  width:200
},
{
  field:"members",
  headerName:'Members',
  headerClassName:'table-header',
  width:400,
  renderCell:(params)=>(<AvatarCard max={100} avatar={params.row.members} />)
},
{
  field:"totalMessages",
  headerName:'Total Messages',
  headerClassName:'table-header',
  width:200
},
{
  field:"creator",        
  headerName:'Created By',
  headerClassName:'table-header',
  width:250,
  renderCell:(params)=>(
    <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
      <Avatar alt={params.row.creator.name}  src={params.row.creator.avatar} />
      <span>{params.row.creator.name}</span>
    </Stack>
  )
},


]

const ChatManagement = () => {

  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`${server}/api/v1/admin/chats`, { withCredentials: true });
        setRows(data?.chats.map((i)=>(
          {
            ...i,
            id:i._id,
            avatar:i.avatar.map((i)=> transformImage(i,50)),
            members:i.members.map((i)=> transformImage(i.avatar,50)),
            creator:{
              name:i.creator.name,
              avatar:transformImage(i.creator.avatar,50),
            }
          }
        )))

        setLoading(false);
     
        
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);



  return loading ? <Skeleton height={"100vh"}/> :(
    <AdminLayout>
       <Table heading={'All Chats'} columns={columns} rows={rows} />
    </AdminLayout>
  )
}


export default ChatManagement