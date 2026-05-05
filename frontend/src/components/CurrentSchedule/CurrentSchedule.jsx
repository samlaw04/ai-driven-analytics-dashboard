import React, { useEffect, useState } from 'react';
import './CurrentSchedule.scss';
import { getCurrentSchedule } from '../../clients/BackendConnector.js';

const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${minute} ${suffix}`;
};

const CurrentSchedule = () => {
    const [schedule, setSchedule] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        getCurrentSchedule(customerId)
            .then((data) => setSchedule(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="current-schedule current-schedule--loading">Loading current schedule...</div>;
    if (error) return <div className="current-schedule current-schedule--error">Failed to load schedule.</div>;

    let chargeWindows = [];
    try {
        chargeWindows = JSON.parse(schedule.chargeWindows);
    } catch {
        chargeWindows = [];
    }

    return (
        <div className="current-schedule">
            <h2 className="current-schedule__title">Current Schedule</h2>

            <div className="current-schedule__vehicle">
                {schedule.vehicleImage && (
                    <img
                        className="current-schedule__vehicle-image"
                        src={`data:image/png;base64,${schedule.vehicleImage}`}
                        alt={schedule.vehicleName}
                    />
                )}
                <div className="current-schedule__vehicle-info">
                    <span className="current-schedule__vehicle-name">{schedule.vehicleName}</span>
                    <span className="current-schedule__battery-label">Battery at plug-in</span>
                    <span className="current-schedule__battery-value">{schedule.currentBatteryPercentage}%</span>
                </div>
            </div>

            <div className="current-schedule__windows">
                <h3 className="current-schedule__windows-title">Charge Windows</h3>
                {chargeWindows.length === 0 ? (
                    <p className="current-schedule__no-windows">No charge windows scheduled.</p>
                ) : (
                    <ul className="current-schedule__windows-list">
                        {chargeWindows.map((window, index) => (
                            <li key={index} className="current-schedule__window-item">
                                <span className="current-schedule__window-time">
                                    {formatTime(window.start)} – {formatTime(window.end)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CurrentSchedule;

