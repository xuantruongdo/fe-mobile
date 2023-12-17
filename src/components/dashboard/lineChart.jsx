import { Col } from "antd";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const LineChartComp = ({ data }) => {
    return ( 
        <div style={{marginTop: "100px"}}>
        <Col xs={0} sm={12} md={18}>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sl" stroke="#8884d8" />
        </LineChart>
        </Col>
      </div>
     );
}
 
export default LineChartComp;