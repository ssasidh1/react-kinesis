import React, { useEffect, useState } from "react"
import Chart from "chart.js/auto"

import {Line} from "react-chartjs-2"

const LineChart = ()=>{
    const [chartData, setChartData] = useState({
        labels: [],
        datasets:[{
                label: "DS1",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: [0],
                lineTension:0.5,
            },
        ],
    })

    useEffect(()=>{
        const interval = setInterval(()=>{
        var now = new Date();
        now = now.getHours()+ ":" +now.getMinutes()+":"+now.getSeconds();
        var value = Math.floor(Math.random()*1000);

        setChartData(prevData=>{
            const newLabels = [...prevData.labels, now];
            const newData = [...prevData.datasets[0].data, value];

            const windowSize = 400;
            if (newLabels.length > windowSize) {
            newLabels.shift();
            newData.shift();
            }

            return{
                labels: newLabels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                data: newData,
                    }
                ]
            }
            })
        },2000);
        return () => clearInterval(interval);
        
    },[])

    return(
        <div>
            <Line data = {chartData}/>
        </div>
    )

}

export default LineChart;