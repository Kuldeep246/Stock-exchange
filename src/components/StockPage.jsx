import React, { useEffect, useState } from 'react';
import StockChart from './stockchart';
import { useParams } from 'react-router-dom';
import 'dotenv/config'


const StockPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { company } = useParams()

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`https://alpha-vantage.p.rapidapi.com/query?function=TIME_SERIES_DAILY&symbol=${company}&outputsize=compact&datatype=json`, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': process.env.Rapidapi_key,
            'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchStockData();
  }, [company]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }
  const timeSeries = data['Time Series (Daily)'];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = yesterday.toISOString().split('T')[0];

  const yesterdaysData = timeSeries[yesterdayFormatted]
  return (
    <div className='bg-[#111] min-h-screen'>
      <div className='text-xl font-semibold ml-4 pt-10 text-white px-4'>
                StockTracker<span className='text-blue-500 font-bold text-xl'>.</span>
            </div>
      <div className='text-white font-semibold text-2xl mt-4 ml-10'> {company} stock</div>
      {yesterdaysData ? (
        <div className='text-white gap-4 bg-[#1b1b1b] w-2/3 mx-auto p-2 rounded-t-md grid grid-flow-col'>
          <h2 className='font-semibold text-xl'> Data</h2>
          <p className='font-semibold'>Open: <span className='font-normal text-yellow-300'>{yesterdaysData['1. open']}</span></p>
          <p className='font-semibold'>High:<span className='text-green-500 font-normal'>{yesterdaysData['2. high']}</span></p>
          <p className='font-semibold'>Low:<span className='text-red-500 font-normal'>{yesterdaysData['3. low']}</span></p>
          <p className='font-semibold'>Close:<span className='text-blue-500 font-normal'>{yesterdaysData['4. close']}</span></p>
          <p className='font-semibold'>Volume:<span className='font-normal text-pink-400'>{yesterdaysData['5. volume']}</span></p>
        </div>
      ) : (
        <p>No data available for yesterday.</p>
      )}
      <StockChart data={timeSeries} />

    </div>
  );
};

export default StockPage;
