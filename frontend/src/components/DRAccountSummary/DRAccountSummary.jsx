import React, { useEffect, useState } from 'react';
import './DRAccountSummary.scss';
import { getDemandResponseAccountSummary } from '../../clients/BackendConnector.js';

const getDateRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
    };
};

const formatDuration = (totalSeconds) => {
    if (totalSeconds < 3600) {
        const minutes = Math.floor(totalSeconds / 60);
        return `${minutes} min`;
    }
    const hours = (totalSeconds / 3600).toFixed(1);
    return `${hours} hr`;
};

const DRAccountSummary = () => {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        const { startDate, endDate } = getDateRange();

        getDemandResponseAccountSummary(customerId, startDate, endDate)
            .then((data) => setSummary(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="dr-account-summary dr-account-summary--loading">Loading account summary...</div>;
    if (error) return <div className="dr-account-summary dr-account-summary--error">Failed to load account summary.</div>;

    return (
        <div className="dr-account-summary">
            <h2 className="dr-account-summary__title">Account Summary</h2>
            <div className="dr-account-summary__grid">
                <div className="dr-account-summary__card">
                    <span className="dr-account-summary__card-label">Plug Sessions</span>
                    <span className="dr-account-summary__card-value">{summary.numberOfPlugSessions}</span>
                </div>
                <div className="dr-account-summary__card">
                    <span className="dr-account-summary__card-label">DR Events Scheduled</span>
                    <span className="dr-account-summary__card-value">{summary.drEventsScheduled}</span>
                </div>
                <div className="dr-account-summary__card">
                    <span className="dr-account-summary__card-label">DR Events Participated In</span>
                    <span className="dr-account-summary__card-value">{summary.drEventsParticipatedIn}</span>
                </div>
                <div className="dr-account-summary__card">
                    <span className="dr-account-summary__card-label">DR Events Overridden</span>
                    <span className="dr-account-summary__card-value">{summary.drEventsOverridden}</span>
                </div>
                <div className="dr-account-summary__card">
                    <span className="dr-account-summary__card-label">kWh Shifted</span>
                    <span className="dr-account-summary__card-value">{summary.kwhShifted.toFixed(2)} kWh</span>
                </div>
                <div className="dr-account-summary__card">
                    <span className="dr-account-summary__card-label">Total Time Plugged In</span>
                    <span className="dr-account-summary__card-value">{formatDuration(summary.totalTimePluggedIn)}</span>
                </div>
            </div>
        </div>
    );
};

export default DRAccountSummary;

