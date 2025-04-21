import React, { useState, useEffect } from 'react';
import { useAuthUser } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Metrics = () => {
    const { records, user, getCountStatus, countStatus } = useAuthUser();
    const [chosenPlatform, setChosenPlatform] = useState('LinkedIn'); // Initialize with default
    const [chartData, setChartData] = useState({
        labels: ['Applied', 'Rejected', 'Accepted'],
        datasets: [
            {
                label: 'Application Status',
                backgroundColor: ['#3498db', '#c0392b', '#27ae60'],
                borderColor: ['#2980b9', '#ad2831', '#219653'],
                borderWidth: 1,
                data: [0, 0, 0], // Initial data (default to 0)
            },
        ],
    });

    useEffect(() => {
        if (user?.email && chosenPlatform) { // Ensure user and platform are available
            getCountStatus(user.email, chosenPlatform);
        }
    }, [chosenPlatform, user]); // Re-run when user or platform changes

    const handlePlatformChange = (event) => {
        setChosenPlatform(event.target.value);
        getCountStatus(user.email, event.target.value);
    };

    useEffect(() => {
        if (countStatus) {
            setChartData({
                labels: ['Applied', 'Rejected', 'Accepted'],
                datasets: [
                    {
                        label: 'Application Status',
                        backgroundColor: ['#3498db', '#c0392b', '#27ae60'],
                        borderColor: ['#2980b9', '#ad2831', '#219653'],
                        borderWidth: 1,
                        data: [
                            countStatus?.jobsApplied || 0, // Fallback to 0 if no value
                            countStatus?.rejections || 0,   // Fallback to 0 if no value
                            countStatus?.interviews || 0,   // Fallback to 0 if no value
                        ],
                    },
                ],
            });
        }
    }, [countStatus]); // Run this effect when countStatus changes

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Job Application Metrics for ${chosenPlatform}`,
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20
                },
                color: '#2c3e50'
            },
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                },
                displayColors: true,
                cornerRadius: 6
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#5d6975'
                },
                title: {
                    display: true,
                    text: 'Number of Applications',
                    color: '#2c3e50',
                    font: {
                        size: 14,
                        weight: '500'
                    },
                    padding: {
                        top: 10,
                        bottom: 0
                    }
                },
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#5d6975'
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    };

    return (
        <div className="metrics-container">
            <div className="container px-3 py-4">
                <div className="row">
                    <div className="col-12">
                        <h1 className="metrics-header">
                            Application Metrics
                        </h1>
                        <p className="metrics-subheader">
                            Track your job application performance across different platforms
                        </p>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-6 col-lg-4 mb-4">
                        <div className="platform-selector-card">
                            <h2 className="platform-selector-title">Select Platform</h2>
                            <div className="platform-selector-wrapper">
                                <select
                                    className="platform-selector"
                                    value={chosenPlatform}
                                    onChange={handlePlatformChange}
                                    aria-label="Select job platform"
                                >
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Glassdoor">Glassdoor</option>
                                    <option value="Indeed">Indeed</option>
                                </select>
                            </div>
                            
                            <div className="metrics-summary">
                                <div className="metric-item">
                                    <div className="metric-label">Applied</div>
                                    <div className="metric-value applied">{countStatus?.jobsApplied || 0}</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-label">Rejected</div>
                                    <div className="metric-value rejected">{countStatus?.rejections || 0}</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-label">Accepted</div>
                                    <div className="metric-value interviews">{countStatus?.interviews || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-8 mb-4">
                        <div className="chart-card">
                            <div className="chart-container">
                                {countStatus?.jobsApplied !== undefined && 
                                 countStatus?.rejections !== undefined && 
                                 countStatus?.interviews !== undefined ? (
                                    <Bar data={chartData} options={chartOptions} />
                                ) : (
                                    <div className="no-data-message">
                                        <p>No data available for {chosenPlatform}</p>
                                        <small>Start tracking your applications to see metrics</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .metrics-container {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #333;
                    background-color: #f5f7fa;
                    min-height: 100vh;
                    padding: 20px 0;
                }

                .metrics-header {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 0.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #3498db;
                    display: inline-block;
                }

                .metrics-subheader {
                    color: #7f8c8d;
                    font-size: 1rem;
                    margin-bottom: 1.5rem;
                }

                .platform-selector-card, .chart-card {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    padding: 1.5rem;
                    height: 100%;
                    transition: all 0.3s ease;
                }

                .platform-selector-card:hover, .chart-card:hover {
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
                    transform: translateY(-3px);
                }

                .platform-selector-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 1rem;
                }

                .platform-selector-wrapper {
                    position: relative;
                    margin-bottom: 1.5rem;
                }

                .platform-selector {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e0e6ed;
                    border-radius: 8px;
                    background-color: white;
                    font-size: 1rem;
                    color: #2c3e50;
                    appearance: none;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .platform-selector:focus {
                    outline: none;
                    border-color: #3498db;
                    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
                }

                .platform-selector-wrapper::after {
                    content: '▼';
                    font-size: 0.8rem;
                    color: #7f8c8d;
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                }

                .chart-container {
                    height: 300px;
                    position: relative;
                }

                .no-data-message {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    color: #95a5a6;
                }

                .no-data-message p {
                    font-size: 1.2rem;
                    margin-bottom: 0.5rem;
                }

                .no-data-message small {
                    font-size: 0.9rem;
                }

                .metrics-summary {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    margin-top: 1.5rem;
                }

                .metric-item {
                    flex: 1;
                    min-width: 80px;
                    text-align: center;
                    padding: 12px 8px;
                    border-radius: 8px;
                    background-color: #f8f9fa;
                    margin: 0 4px 8px;
                }

                .metric-label {
                    font-size: 0.8rem;
                    color: #7f8c8d;
                    margin-bottom: 4px;
                }

                .metric-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .metric-value.applied {
                    color: #3498db;
                }

                .metric-value.rejected {
                    color: #c0392b;
                }

                .metric-value.interviews {
                    color: #27ae60;
                }

                @media (max-width: 767px) {
                    .metrics-header {
                        font-size: 1.5rem;
                    }

                    .platform-selector-card, .chart-card {
                        padding: 1rem;
                    }

                    .chart-container {
                        height: 250px;
                    }
                }

                @media (max-width: 480px) {
                    .metrics-header {
                        font-size: 1.3rem;
                    }

                    .metrics-subheader {
                        font-size: 0.9rem;
                    }

                    .metric-item {
                        flex: 1 0 45%;
                        margin-bottom: 10px;
                    }
                }

                @media (min-width: 1200px) {
                    .chart-container {
                        height: 350px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Metrics;