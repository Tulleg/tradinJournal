import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto'; // Importiere Chart.js
import 'chartjs-adapter-luxon';

const DailyChart = ({ chartData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(data => data.date.toFormat('yyyy-MM-dd')),
                datasets: [{
                    label: 'Daily Net P&L',
                    data: chartData.map(data => data.netPnL),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'yyyy-MM-dd'
                            }
                        },
                        ticks: {
                            source: 'data'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            myChart.destroy();
        };
    }, [chartData]);

    return <canvas ref={chartRef} height="400" />; // Erhöhe die Höhe
};

const MonthlyChart = ({ chartData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;

        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(data => data.monthYear),
                datasets: [{
                    label: 'Monthly Net P&L',
                    data: chartData.map(data => data.netPnL),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            myChart.destroy();
        };
    }, [chartData]);

    return <canvas ref={chartRef} height="400" />; // Erhöhe die Höhe
};

export { DailyChart, MonthlyChart };
