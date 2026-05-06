import { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { getDRRewards, getDPRewards } from '../../clients/BackendConnector';
import './Rewards.scss';

const getCurrentMonthRange = () => {
    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .replace(/\.\d{3}Z$/, 'Z');

    const endDate = now
        .toISOString()
        .replace(/\.\d{3}Z$/, 'Z');

    return { startDate, endDate };
};

const getCurrentMonthLabel = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const Rewards = ({ programType }) => {
    const [rewards, setRewards] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const monthLabel = getCurrentMonthLabel();

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        if (!customerId || !programType) return;

        const fetchRewards = async () => {
            try {
                const { startDate, endDate } = getCurrentMonthRange();

                const data = programType === 'DR'
                    ? await getDRRewards(customerId, startDate, endDate)
                    : await getDPRewards(customerId, startDate, endDate);

                setRewards(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRewards();
    }, [programType]);

    const renderLabel = () => (
        <p className="rewards-label">
            {programType === 'DR' ? 'DR REWARDS' : 'TOTAL REWARDS'}
        </p>
    );

    if (loading) {
        return (
            <Card className="rewards-card h-100">
                <Card.Body className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" size="sm" className="rewards-spinner" />
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="rewards-card h-100">
                <Card.Body className="p-3">
                    {renderLabel()}
                    <p className="rewards-amount rewards-amount--empty">$--.--</p>
                    <p className="rewards-error mt-2 mb-0">
                        <span className="rewards-error-icon">⚠</span> Failed to retrieve rewards
                    </p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="rewards-card h-100">
            <Card.Body className="p-3">

                {renderLabel()}

                <p className="rewards-amount">${rewards.totalRewards.toFixed(2)}</p>

                <p className="rewards-earned-date">earned in {monthLabel}</p>

                <ul className="rewards-entries">
                    {rewards.rewardsBreakdown.ongoingIncentive.map((entry, index) => (
                        <li key={index} className="rewards-entry">
                            {programType === 'DR'
                                ? `${entry.dateOfDr} - 1hr DR event - $${entry.sessionRewardsEarned}`
                                : `(${entry.dateOfSession}) - KWH shifted ${entry.kwhShifted}KW = $${entry.sessionRewardsEarned} earned`
                            }
                        </li>
                    ))}
                </ul>

            </Card.Body>
        </Card>
    );
};

export default Rewards;
