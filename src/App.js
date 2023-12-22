import React, { useState, useEffect } from 'react';
import Header from './header/Header';
import ForexConverter from './components/ForexConverter';
import ForexTable from './components/ForexTable';
import forexApi from './api/forexApi';
import DateSelector from './components/DateSelector';
import ConversionResult from './components/ConversionResult';
import './App.css';

function App() {
  const [forexData, setForexData] = useState([]);
  const [originCurrency, setOriginCurrency] = useState('USD');
  const [destinationCurrency, setDestinationCurrency] = useState('EUR'); // Set default destination currency
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [conversionAmount, setConversionAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const handleSwapCurrencies = () => {
    // Swap the origin and destination currencies
    const newOriginCurrency = destinationCurrency;
    const newDestinationCurrency = originCurrency;

    // Update the state
    setOriginCurrency(newOriginCurrency);
    setDestinationCurrency(newDestinationCurrency);
  };


  useEffect(() => {
    // Fetch Forex Data
    const fetchData = async () => {
      try {
        const data = await forexApi.getForexData(selectedDate, toDate);
        setForexData(data);
      } catch (error) {
        console.error('Error fetching Forex data:', error);
      }
    };

    fetchData();
  }, [selectedDate, toDate]);

  const handleOriginCurrencyChange = (event) => {
    setOriginCurrency(event.target.value);
  };

  const handleDestinationCurrencyChange = (event) => {
    setDestinationCurrency(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAmountChange = (event) => {
    setConversionAmount(event.target.value);
  };

  const handleConversionResult = (result) => {
    setConvertedAmount(result);
  };

  return (
    <div className="App">
      <Header title="Currency Converter" />
      <div className="LeftContainer">
        <ForexConverter
          forexData={forexData}
          originCurrency={originCurrency}
          destinationCurrency={destinationCurrency}
          selectedDate={selectedDate}
          onOriginCurrencyChange={handleOriginCurrencyChange}
          onDestinationCurrencyChange={handleDestinationCurrencyChange}
          onDateChange={handleDateChange}
          conversionAmount={conversionAmount}
          handleAmountChange={handleAmountChange}
          onConversionResult={handleConversionResult}
          toDate={toDate}
          onSwapCurrencies={handleSwapCurrencies}
        />

        {convertedAmount && (
          <ConversionResult
            conversionAmount={conversionAmount}
            originCurrency={originCurrency}
            convertedAmount={convertedAmount}
            destinationCurrency={destinationCurrency}
          />
        )}
      </div>

      <Header title="Forex Table" />
      <div className="RightContainer">
        <div className="DateSelectors">
          <div className="DateSelector1">
            <DateSelector label="From" selectedDate={fromDate} onDateChange={setFromDate} />
          </div>
          <div className="DateSelector2">
            <DateSelector label="To" selectedDate={toDate} onDateChange={setToDate} />
          </div>
        </div>
        <ForexTable fromDate={fromDate} toDate={toDate} />
      </div>
    </div>
  );
}

export default App;
