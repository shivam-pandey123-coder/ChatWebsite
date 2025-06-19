import React from 'react';
import {Line, Doughnut} from 'react-chartjs-2';
import {CategoryScale, Chart as Chartjs,
    Filler,LinearScale,PointElement,LineElement,ArcElement,Legend,
    scales,
} from 'chart.js';
import { Tooltip } from 'chart.js';
import { plugins } from 'chart.js';
import { orange, orangeLite, purple, purpleLight } from '../../constants/color';
import { getLast7Days } from '../../lib/feature';

Chartjs.register(
    Tooltip,
    CategoryScale,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend
);
const labels = getLast7Days();

const lineChartOptions = {
    responsive:true,
    
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        },
    },
    scales:{
        x:{
            grid:{
                display:false,
            }
            
        },
        y:{
            beginAtZero:true,
            grid:{
                display:false,
            }
            
        }
    }
}

const LineChart = ({value=[]}) => {
    const data = {
        labels:labels,
        datasets:[{
            data:value,
            label:'Messages',
            fill:true,
            backgroundColor:purpleLight,
            borderColor:purple,
        },
      
    
    ],
    }
  return (
    <Line data={data} options={lineChartOptions} />
  )
};

const doughnutChartOpions = {
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false
        }
    },
    cutout:120
}

const DoughnutChart = ({value=[],labels=[]}) => {
    const data = {
        labels,
        datasets:[{
            data:value,
            label:'Total Chats Vs Group Chats',
            fill:true,
            backgroundColor:[purpleLight,orangeLite],
            hoverBackgroundColor:[purple,orange],
            borderColor:[purple,orange],
            offset:60,
        },
      
    
    ],
    }
    return (
      <Doughnut style={{
        zIndex:10
      }} data={data} options={doughnutChartOpions}/>
    )
  }

export  {LineChart, DoughnutChart}