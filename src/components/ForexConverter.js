// src/components/ForexConverter.js
import React, { useEffect, useState } from 'react';
import formatDate from '../utils/formatDate';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css';

function ForexConverter({
  forexData,
  originCurrency,
  destinationCurrency,
  selectedDate,
  onOriginCurrencyChange,
  onDestinationCurrencyChange,
  onDateChange,
  conversionAmount,
  handleAmountChange,
  onConversionResult,
  onSwapCurrencies,
}) {
  const [convertedAmount, setConvertedAmount] = useState(null);
  
  useEffect(() => {
    const calculateConversion = () => {
      if (
        forexData.length > 0 &&
        selectedDate &&
        originCurrency !== '' &&
        destinationCurrency !== ''
      ) {
        const selectedDay = forexData.find((day) => day.date === formatDate(selectedDate));
        if (selectedDay && selectedDay.rates) {
          const originCurrencyData = selectedDay.rates.find(
            (rate) => rate.currency.iso3 === originCurrency
          );
          const destinationCurrencyData = selectedDay.rates.find(
            (rate) => rate.currency.iso3 === destinationCurrency
          );
  
          if (originCurrencyData && destinationCurrencyData) {
            const originToNprRate = parseFloat(originCurrencyData.buy) / originCurrencyData.currency.unit;
            const destinationToNprRate = parseFloat(destinationCurrencyData.buy) / destinationCurrencyData.currency.unit;
  
            // Convert from origin currency to NPR
            const originToNprAmount = conversionAmount / originToNprRate;
  
            // Convert from NPR to destination currency
            const newConvertedAmount = originToNprAmount * destinationToNprRate;
  
            return {
              amount: newConvertedAmount.toFixed(2),
            };
          }
        }
      }
  
      return null;
    };
  
    const newConvertedAmount = calculateConversion();
  
    if (newConvertedAmount && newConvertedAmount.amount !== convertedAmount?.amount) {
      setConvertedAmount(newConvertedAmount);
  
      // Avoid setting state in the same render cycle
      if (onConversionResult) {
        onConversionResult(newConvertedAmount);
      }
    }
  }, [originCurrency, destinationCurrency, conversionAmount, forexData, selectedDate, convertedAmount, onConversionResult]);
  

    const renderCurrencyOptions = (currencyList) => {
      return currencyList.map((rate) => (
        <option key={rate.currency.iso3} value={rate.currency.iso3}>
          {rate.currency.name} ({rate.currency.unit})
        </option>
      ));
    };

  return (
    <div>
      <div>
        <label>
          Select Date:
          <DatePicker selected={selectedDate} onChange={onDateChange} />
        </label>
      </div>
      <div>
        <label>
          Enter Amount ({destinationCurrency}):
          <input type="number" value={conversionAmount} onChange={handleAmountChange} />
        </label>
      </div>

      <div>
        <label>
          Select Origin Currency:
          <select value={destinationCurrency} onChange={onDestinationCurrencyChange}>
            {renderCurrencyOptions(forexData[0]?.rates || [])}
          </select>
        </label>
      </div>
      <div  style={{ marginTop: '-10px', marginBottom:'10px', marginLeft: '15vh' }}>
        {/* Button to swap currencies with FontAwesome icon */}
        <button onClick={onSwapCurrencies}>
          <FontAwesomeIcon icon={faSort} />
        </button>
      </div>


      <div>
        <label>
          Select Destination Currency:
          <select value={originCurrency} onChange={onOriginCurrencyChange}>
            {renderCurrencyOptions(forexData[0]?.rates || [])}
          </select>
        </label>
      </div>
     
    </div>
  );
}

export default ForexConverter;