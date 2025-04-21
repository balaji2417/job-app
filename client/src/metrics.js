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

const profileStyles = {
    header: {
        fontSize: '1.8rem',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '1.5rem',
        textAlign: 'left',
    },
};

const Metrics = () => {
    const { records, user, getCountStatus, countStatus } = useAuthUser();
    const [chosenPlatform,setChosenPlatform] = useState(null);
    const [chartData, setChartData] = useState({
        labels: ['Applied', 'Rejected', 'Interview Scheduled'],
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
    const [selectedPlatform, setSelectedPlatform] = useState('LinkedIn'); // Initialize with a default value

    useEffect(() => {
        if (user?.email && selectedPlatform) { // Ensure user and platform are available
            getCountStatus(user.email, selectedPlatform);
        }
    }, []); // Re-run when user or platform changes

    const handlePlatformChange = (event) => {
        setChosenPlatform(event.target.value);
        getCountStatus(user.email,event.target.value);
        
    };

    useEffect(() => {
        if (countStatus) {
          setChartData({
            labels: ['Applied', 'Rejected', 'Interview Scheduled'],
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
        plugins: {
            title: {
                display: true,
                text: `Job Application Metrics for ${chosenPlatform}`,
            },
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Applications',
                },
            },
        },
    };

    return (
        <div>
            <h1 style={profileStyles.header} className="profile-header">
                Metrics
            </h1>
            <select
                className="profile-status-select"
                value={chosenPlatform}
                onChange={handlePlatformChange}
            >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Glassdoor">Glass Door</option>
                <option value="Indeed">Indeed</option>
            </select>

            <div style={{ marginTop: '20px' }}>
                {countStatus?.jobsApplied !== undefined && countStatus?.rejections !== undefined && countStatus?.interviews !== undefined ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : (
                    <p>Loading metrics...</p>
                )}
            </div>
        </div>
    );
};

export default Metrics;