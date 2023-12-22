// src/components/ConversionResult.js
import React from 'react';

function ConversionResult({
  conversionAmount,
  originCurrency,
  convertedAmount,
  destinationCurrency,
}) {
  if (convertedAmount === null) return null;

  return (
    <div className="ConversionResult">
      <h2>Conversion Result:</h2>
      <p>
        {conversionAmount} {destinationCurrency} is approximately{' '}
        {convertedAmount.amount} {originCurrency}
      </p>
    </div>
  );
}

export default ConversionResult;
