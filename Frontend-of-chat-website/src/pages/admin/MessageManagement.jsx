import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Table from '../../components/shared/Table';
import { Avatar,Box,Skeleton,Stack } from '@mui/material';
import { dashboardData } from '../../constants/sampleData';
import { fileFormat, transformImage } from '../../lib/feature';
import AvatarCard from '../../components/shared/AvatarCard';
import moment from 'moment';
import RenderAttachment from '../../components/shared/RenderAttachment';
import { server } from '../../constants/config';
import axios from "axios";

const columns=[{
  field:"id",
  headerName:'ID',
  headerClassName:'table-header',
  width:200
},
{
  field:"attachments",
  headerName:'Attachments',
  headerClassName:'table-header',
  width:200,
  renderCell: (params)=> {

    const {attachments} = params.row;
    return attachments.length>0 ? attachments.map((i,index)=>{
      const url = i.URL;
      const file = fileFormat(url);

      return <Box key={index}>
        <a href={url} download target='blank' style={{
          color:"black"
        }} >
            {RenderAttachment(file,url)}
           </a>
      </Box>
    }) : "No Attachments"


   
  }
},
{
  field:"content",
  headerName:'Content',
  headerClassName:'table-header',
  width:400
},
{
  field:"sender",
  headerName:'Send By',
  headerClassName:'table-header',
  width:200,
  renderCell: (params)=> (
    <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
      <Avatar alt={params.row.name} src={params.row.sender.avatar} />
      <span>{params.row.sender.name}</span>
    </Stack>
  )
},
{
  field:"chat",
  headerName:'Chat',
  headerClassName:'table-header',
  width:220
},
{
  field:"groupchat",
  headerName:'Group Chat',
  headerClassName:'table-header',
  width:100
},
{
  field:"createdAt",
  headerName:'Time',
  headerClassName:'table-header',
  width:250
},
]


const MessageManagement = () => {
  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`${server}/api/v1/admin/messages`, { withCredentials: true });
        setRows(data?.messages.map((i)=>(
          {
            ...i,
            id:i._id,
            sender:{
              name:i.sender.name,
              avatar:transformImage(i.sender.avatar,50)
            },
            createdAt:moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
          }
        )))
        setLoading(false)
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);




  return loading ?<Skeleton height={"100vh"}/> : (
    <AdminLayout>
      <Table heading={'All Messages'} columns={columns} rows={rows} />
    </AdminLayout>
  )
}

export default MessageManagement