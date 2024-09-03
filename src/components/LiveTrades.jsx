import React, { useState, useEffect } from 'react';
import companies from '../functions/companydata';

const LiveTrades = () => {
    const [socket, setSocket] = useState(null);
    const [tradeData, setTradeData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const ws = new WebSocket('wss://ws.finnhub.io?token=cqhd429r01qm46d7gns0cqhd429r01qm46d7gnsg');
        setSocket(ws);

        const handleOpen = () => {
            subscribeToCompanies(ws);
            setIsLoading(false);
        };

        const handleMessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('Message from server', message);
                if (message.data) {
                    setTradeData(prevData => {
                        let newData = [...prevData];
                        message.data.forEach(trade => {
                            newData = [trade, ...newData];
                            if (newData.length > 7) {
                                newData.pop();
                            }
                        });
                        return newData;
                    });
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        const handleError = (error) => {
            console.error('WebSocket error:', error);
        };

        const handleClose = () => {
            console.log('WebSocket connection closed');
        };

        ws.addEventListener('open', handleOpen);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('error', handleError);
        ws.addEventListener('close', handleClose);

        return () => {
            ws.removeEventListener('open', handleOpen);
            ws.removeEventListener('message', handleMessage);
            ws.removeEventListener('error', handleError);
            ws.removeEventListener('close', handleClose);
            ws.close();
        };
    }, []);

    useEffect(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const interval = setInterval(() => {
                subscribeToCompanies(socket);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [socket]);

    const subscribeToCompanies = (ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            companies.forEach(company => {
                ws.send(JSON.stringify({ type: 'subscribe', symbol: company.symbol }));
            });
        }
    };

    return (
        <div className='w-1/5 mx-auto rounded-md bg-[#1b1b1b] p-4'>
            <div className=' text-white mx-auto font-semibold text-3xl'>Live Trades</div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {tradeData.map((data, index) => (
                        <div key={index} className='trade-entry w-full m-2 border border-gray-700  rounded p-2 bg-[#111] text-white'>
                            <div className='font-bold'>{data.s}</div>
                            <div className='flex mx-auto '>
                                <div className='mx-auto font-medium text-sm'>Price: <span className='text-green-500 font-normal'>{data.p}</span><span className=' text-xs text-gray-300'> usd</span> </div>
                                <div className='mx-auto font-medium text-sm'>Volume: <span className='text-red-500 font-normal'>{data.v}</span> </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveTrades;
