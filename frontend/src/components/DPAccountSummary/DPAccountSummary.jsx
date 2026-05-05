import React, { useEffect, useState } from 'react';
import './DPAccountSummary.scss';
import { getDynamicPricingAccountSummary } from '../../clients/BackendConnector.js';

const getDateRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
    };
};

const DPAccountSummary = () => {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        const { startDate, endDate } = getDateRange();

        getDynamicPricingAccountSummary(customerId, startDate, endDate)
            .then((data) => setSummary(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="dp-account-summary dp-account-summary--loading">Loading account summary...</div>;
    if (error) return <div className="dp-account-summary dp-account-summary--error">Failed to load account summary.</div>;

    return (
        <div className="dp-account-summary">
            <h2 className="dp-account-summary__title">Account Summary</h2>

            <div className="dp-account-summary__grid">
                <div className="dp-account-summary__card">
                    <span className="dp-account-summary__card-label">Plug Sessions</span>
                    <span className="dp-account-summary__card-value">{summary.numberOfPlugSessions}</span>
                </div>

                <div className="dp-account-summary__card">
                    <span className="dp-account-summary__card-label">Schedules Followed</span>
                    <span className="dp-account-summary__card-value">{summary.schedulesFollowed}</span>
                </div>

                <div className="dp-account-summary__card">
                    <span className="dp-account-summary__card-label">Dollars Saved</span>
                    <span className="dp-account-summary__card-value">${summary.dollarsSaved.toFixed(2)}</span>
                </div>

                <div className="dp-account-summary__card">
                    <span className="dp-account-summary__card-label">Schedules Overridden</span>
                    <span className="dp-account-summary__card-value">{summary.schedulesOverridden}</span>
                </div>

                <div className="dp-account-summary__card">
                    <span className="dp-account-summary__card-label">Missed Savings</span>
                    <span className="dp-account-summary__card-value">${summary.missedSavings.toFixed(2)}</span>
                </div>

                <div className="dp-account-summary__card">
                    <span className="dp-account-summary__card-label">kWh Shifted</span>
                    <span className="dp-account-summary__card-value">{summary.kwhShifted.toFixed(2)} kWh</span>
                </div>
            </div>
        </div>
    );
};

export default DPAccountSummary;

