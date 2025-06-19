import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Table from '../../components/shared/Table';
import { Avatar, Skeleton } from '@mui/material';
import { dashboardData } from '../../constants/sampleData';
import { transformImage } from '../../lib/feature';
import { server } from '../../constants/config';
import axios from "axios";



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
  renderCell: (params)=> <Avatar alt={params.row.name} src={params.row.avatar} />
},
{
  field:"name",
  headerName:'Name',
  headerClassName:'table-header',
  width:200
},
{
  field:"username",
  headerName:'UserName',
  headerClassName:'table-header',
  width:200
},
{
  field:"friends",
  headerName:'Friends',
  headerClassName:'table-header',
  width:150
},
{
  field:"groups",
  headerName:'Groups',
  headerClassName:'table-header',
  width:200
},


]

const UserManagement = () => {

  const [rows,setRows] = useState([]);
  
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get(`${server}/api/v1/admin/users`, { withCredentials: true });
        setRows(data?.users.map((i)=>({
          ...i,
          id:i._id ,
          avatar:transformImage(i.avatar,50) })))
         setLoading(false);
 
        
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);



  return loading ? <Skeleton height={"100vh"} /> :(
    <AdminLayout>
       <Table heading={'All Users'} columns={columns} rows={rows} />
    </AdminLayout>
  )
}

export default UserManagement