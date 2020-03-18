import React from 'react';
import './attendance.css';

export default function Attendance(props) {
  return (
    <div className = {"attendance"} > Attendance: {props.attendance} </div>
  );
}