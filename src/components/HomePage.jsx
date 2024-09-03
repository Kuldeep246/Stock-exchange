import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveTrades from './LiveTrades';
import 'dotenv/config'

const HomePage = ({ companies }) => {
    const navigate = useNavigate();
    const [stockData, setStockData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const companiesPerPage = 5;

    useEffect(() => {
        const api_key = process.env.API_KEY;

        const fetchStockData = async (symbol) => {
            try {
                const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${api_key}`);
                const data = await response.json();
                setStockData(prevData => ({
                    ...prevData,
                    [symbol]: data
                }));
            } catch (error) {
                console.error(`Error fetching data for ${symbol}:`, error);
            }
        };

        companies.forEach(company => {
            fetchStockData(company.symbol);
        });
    }, [companies]);

    const handleSelectCompany = (symbol) => {
        navigate(`/stock/${symbol}`);
    };

    const indexOfLastCompany = currentPage * companiesPerPage;
    const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
    const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

   
    const totalPages = Math.ceil(companies.length / companiesPerPage);

    return (
        <div className='bg-[#111] min-h-screen'>
            <div className='text-xl font-semibold ml-4 pt-10 text-white px-4'>
                StockTracker<span className='text-blue-500 font-bold text-xl'>.</span>
            </div>
            <div className="px-4 mt-5 flex   ">
                <div className='flex flex-col w-4/6 mx-auto'>
                    <div className="mt-2  flex flex-col gap-3   ">
                        {currentCompanies.map((company) => {
                            const data = stockData[company.symbol] || {};
                            const priceClass = data.pc > data.c ? 'text-red-500' : 'text-green-500';
                             const priceDifference =  (data.c - data.pc).toFixed(3);

                            return (
                                <div
                                    key={company.id}
                                    onClick={() => handleSelectCompany(company.symbol)}
                                    className="items-center border-gray-800 border cursor-pointer grid grid-cols-3 p-2 rounded-3xl bg-[#1b1b1b] w-full hover:bg-[#333]"
                                >
                                    <img src={company.pic}  alt={company.name} className="ml-2 h-16 w-20 mb-2" />
                                    <div className="text-xl  font-medium text-gray-300">{company.name}</div>
                                    <div className={`p-2  rounded ${priceClass}`}>{data.c}<span className='text-sm text-slate-300'>usd</span> <span className='text-sm' >({priceDifference})</span></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <LiveTrades className='mx-auto border-gray-200 border w-2/5 ' />
            </div>
        </div>
    );
};

export default HomePage;
