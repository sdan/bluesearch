import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      data: [22, 59, 80, 81, 56, 55, 40],
    },
    {
      data: [44, 59, 80, 81, 56, 55, 40],
    },
    {
      data: [65, 59, 80, 81, 23, 55, 40],
    },
  ],
};

export default () => (
  <div>
    <h2>Line Example</h2>
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    v
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
    <Line data={data} width={400} height={100} />
  </div>
);
