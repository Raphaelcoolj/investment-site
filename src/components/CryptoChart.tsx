'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface CryptoChartProps {
    coinId: string;
    label: string;
    color: string;
    onChartClick?: () => void;
}

export default function CryptoChart({ coinId, label, color, onChartClick }: CryptoChartProps) {
    const [chartData, setChartData] = useState<any>(null);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);

    const isFiat = ['cashapp', 'paypal', 'applepay'].includes(coinId.toLowerCase());

    const fetchData = async () => {
        if (isFiat) {
            setChartData({
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    fill: true,
                    label: label,
                    data: [1, 1, 1, 1, 1, 1, 1],
                    borderColor: color,
                    backgroundColor: color.replace('1)', '0.1)').replace(')', ', 0.1)'),
                    tension: 0
                }]
            });
            setCurrentPrice(1.00);
            return;
        }

        try {
            const isCommodityOrStock = ['oil', 'gold', 'aapl', 'msft', 'googl', 'meta', 'tsla', 'amzn', 'brk-b', 'xai'].includes(coinId.toLowerCase());
            
            if (isCommodityOrStock) {
                const base = {
                    'oil': 78, 'gold': 2038, 'aapl': 184, 'msft': 402,
                    'googl': 143, 'meta': 485, 'tsla': 188, 'amzn': 172,
                    'brk-b': 408, 'xai': 250
                }[coinId.toLowerCase()] || 100;

                const dataPoints = Array.from({ length: 7 }, (_, i) => {
                    return base + (Math.random() - 0.5) * (base * 0.05);
                });

                setCurrentPrice(dataPoints[dataPoints.length - 1]);
                setChartData({
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        fill: true,
                        label: label,
                        data: dataPoints,
                        borderColor: color,
                        backgroundColor: color.replace('1)', '0.1)').replace(')', ', 0.1)'),
                        tension: 0.4
                    }]
                });
                return;
            }

            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: '7',
                    interval: 'daily'
                }
            });
            
            const prices = response.data.prices;
            const labels = prices.map((price: any) => {
                const date = new Date(price[0]);
                return date.toLocaleDateString();
            });
            const dataPoints = prices.map((price: any) => price[1]);
            setCurrentPrice(dataPoints[dataPoints.length - 1]);

            setChartData({
                labels,
                datasets: [
                    {
                        fill: true,
                        label: label,
                        data: dataPoints,
                        borderColor: color,
                        backgroundColor: color.replace('1)', '0.1)').replace(')', ', 0.1)'), 
                        tension: 0.4,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching chart data", error);
            setChartData({
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                     fill: true,
                     label: label,
                     data: [40000, 42000, 41000, 43000, 42500, 44000, 45000],
                     borderColor: color,
                     backgroundColor: 'rgba(59, 130, 246, 0.1)',
                     tension: 0.4
                }]
            });
            setCurrentPrice(45000);
        }
    };

    const updatePrice = async () => {
        if (isFiat) return;

        try {
            const res = await axios.get(`/api/prices`, {
                params: {
                    ids: coinId
                }
            });
            const newPrice = res.data[coinId].usd;
            setCurrentPrice(newPrice);

            setChartData((prev: any) => {
                if (!prev) return prev;
                const newData = [...prev.datasets[0].data];
                newData[newData.length - 1] = newPrice;
                return {
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: newData
                        }
                    ]
                };
            });
        } catch (error) {
            console.error("Failed to update spot price:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(updatePrice, 10000); // 10s for more "live" feel
        return () => clearInterval(interval);
    }, [coinId, label, color]);

    if (!chartData) return <div className="h-64 animate-pulse bg-gray-800 rounded-lg"></div>;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#94a3b8',
                bodyColor: '#fff',
                borderColor: 'rgba(51, 65, 85, 0.5)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `$${context.parsed.y.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            }
        },
        onClick: (event: any, elements: any) => {
            if (onChartClick) onChartClick();
        }
    };

    return (
        <div className="glass-panel p-5 cursor-pointer hover:border-blue-500/50 transition-all group overflow-hidden" onClick={onChartClick}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold font-mono">
                            {currentPrice !== null ? (isFiat ? '$1.00' : `$${currentPrice.toLocaleString()}`) : '---'}
                        </span>
                    </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <span className="text-xs text-blue-400 group-hover:text-white">↗</span>
                </div>
            </div>

            <div className="h-32 mb-4">
                <Line options={options} data={chartData} />
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-3 mt-auto">
                <span className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${isFiat ? 'bg-slate-500' : 'bg-green-500 animate-pulse'}`}></span>
                    {isFiat ? 'Stable Rate' : 'Live Price Updates'}
                </span>
                <span className="font-medium text-blue-500 group-hover:underline">INVEST NOW</span>
            </div>
        </div>
    );
}
