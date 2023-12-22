// src/components/DateSelector.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DateSelector({ label, selectedDate, onDateChange }) {
  return (
    <div>
      <label>
        {label}:
        <DatePicker selected={selectedDate} onChange={onDateChange} />
      </label>
    </div>
  );
}

export default DateSelector;
