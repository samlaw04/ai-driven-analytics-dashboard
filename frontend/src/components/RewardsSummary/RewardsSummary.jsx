import React, { useEffect, useState } from 'react';
import './RewardsSummary.scss';
import { getDynamicPricingRewards, getDemandResponseRewards } from '../../clients/BackendConnector.js';

const getDateRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
    };
};

const DPRewardsContent = ({ data }) => {
    const { totalRewards, rewardsBreakdown } = data;
    const { signUpIncentive, ongoingIncentive } = rewardsBreakdown;

    return (
        <div className="rewards-summary__content">
            <div className="rewards-summary__total">
                <span className="rewards-summary__total-label">Total Rewards Earned</span>
                <span className="rewards-summary__total-value">${totalRewards.toFixed(2)}</span>
            </div>

            <div className="rewards-summary__breakdown">
                <div className="rewards-summary__sign-up">
                    <span className="rewards-summary__sign-up-label">Sign-Up Incentive</span>
                    <span className="rewards-summary__sign-up-value">${signUpIncentive.toFixed(2)}</span>
                </div>

                <div className="rewards-summary__ongoing">
                    <h3 className="rewards-summary__ongoing-title">Ongoing Incentive Sessions</h3>
                    {ongoingIncentive.length === 0 ? (
                        <p className="rewards-summary__no-data">No sessions recorded this period.</p>
                    ) : (
                        <table className="rewards-summary__table">
                            <thead>
                                <tr>
                                    <th className="rewards-summary__table-header">Date</th>
                                    <th className="rewards-summary__table-header">kWh Shifted</th>
                                    <th className="rewards-summary__table-header">Rate ($/kWh)</th>
                                    <th className="rewards-summary__table-header">Session Reward</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ongoingIncentive.map((entry, index) => (
                                    <tr key={index} className="rewards-summary__table-row">
                                        <td className="rewards-summary__table-cell">{entry.dateOfSession}</td>
                                        <td className="rewards-summary__table-cell">{entry.kwhShifted.toFixed(2)}</td>
                                        <td className="rewards-summary__table-cell">${entry.incentivePerKwh.toFixed(2)}</td>
                                        <td className="rewards-summary__table-cell">${entry.sessionRewardsEarned.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

const DRRewardsContent = ({ data }) => {
    const { totalRewards, rewardsBreakdown } = data;
    const { signUpIncentive, ongoingIncentive } = rewardsBreakdown;

    return (
        <div className="rewards-summary__content">
            <div className="rewards-summary__total">
                <span className="rewards-summary__total-label">Total Rewards Earned</span>
                <span className="rewards-summary__total-value">${totalRewards.toFixed(2)}</span>
            </div>

            <div className="rewards-summary__breakdown">
                <div className="rewards-summary__sign-up">
                    <span className="rewards-summary__sign-up-label">Sign-Up Incentive</span>
                    <span className="rewards-summary__sign-up-value">${signUpIncentive.toFixed(2)}</span>
                </div>

                <div className="rewards-summary__ongoing">
                    <h3 className="rewards-summary__ongoing-title">Demand Response Events</h3>
                    {ongoingIncentive.length === 0 ? (
                        <p className="rewards-summary__no-data">No DR events recorded this period.</p>
                    ) : (
                        <table className="rewards-summary__table">
                            <thead>
                                <tr>
                                    <th className="rewards-summary__table-header">Date</th>
                                    <th className="rewards-summary__table-header">Incentive Per Event</th>
                                    <th className="rewards-summary__table-header">Session Reward</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ongoingIncentive.map((entry, index) => (
                                    <tr key={index} className="rewards-summary__table-row">
                                        <td className="rewards-summary__table-cell">{entry.dateOfDr}</td>
                                        <td className="rewards-summary__table-cell">${entry.incentivePerDrEvent.toFixed(2)}</td>
                                        <td className="rewards-summary__table-cell">${entry.sessionRewardsEarned.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

const RewardsSummary = () => {
    const [rewards, setRewards] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const programType = sessionStorage.getItem('programType');

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        const { startDate, endDate } = getDateRange();

        const fetchFn = programType === 'DR' ? getDemandResponseRewards : getDynamicPricingRewards;

        fetchFn(customerId, startDate, endDate)
            .then((data) => setRewards(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [programType]);

    if (loading) return <div className="rewards-summary rewards-summary--loading">Loading rewards...</div>;
    if (error) return <div className="rewards-summary rewards-summary--error">Failed to load rewards.</div>;

    return (
        <div className="rewards-summary">
            <h2 className="rewards-summary__title">Rewards Summary</h2>
            {programType === 'DP' && <DPRewardsContent data={rewards} />}
            {programType === 'DR' && <DRRewardsContent data={rewards} />}
        </div>
    );
};

export default RewardsSummary;

