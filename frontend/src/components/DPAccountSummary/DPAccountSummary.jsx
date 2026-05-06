import { useState, useEffect, useCallback } from 'react';
import { Card, Table, Spinner, Button } from 'react-bootstrap';
import { getDPAccountSummary } from '../../clients/BackendConnector';
import './DPAccountSummary.scss';

const getWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return {
        startDate: monday.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        endDate: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    };
};

const getMonthRange = () => {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
        startDate: firstOfMonth.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        endDate: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    };
};

const TrendIndicator = ({ value, format }) => {
    const rounded = format === 'currency'
        ? Math.round(value * 100) / 100
        : format === 'kwh'
            ? Math.round(value * 10) / 10
            : Math.round(value);

    const display = format === 'currency'
        ? `$${Math.abs(rounded).toFixed(2)}`
        : format === 'kwh'
            ? Math.abs(rounded).toFixed(1)
            : Math.abs(rounded);

    if (rounded > 0) {
        return (
            <span className="trend trend--positive">
                ▲ +{display}
            </span>
        );
    }
    if (rounded < 0) {
        return (
            <span className="trend trend--negative">
                ▼ -{display}
            </span>
        );
    }
    return <span className="trend trend--neutral">— 0</span>;
};

const formatValue = (value, format) => {
    if (format === 'currency') return `$${value.toFixed(2)}`;
    if (format === 'kwh') return `${value.toFixed(1)} Kw`;
    return value;
};

const DPAccountSummary = () => {
    const [weekData, setWeekData] = useState(null);
    const [monthData, setMonthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchSummary = useCallback(async () => {
        const customerId = sessionStorage.getItem('customerId');
        if (!customerId) return;

        setLoading(true);
        setError(false);

        try {
            const weekRange = getWeekRange();
            const monthRange = getMonthRange();

            const [week, month] = await Promise.all([
                getDPAccountSummary(customerId, weekRange.startDate, weekRange.endDate),
                getDPAccountSummary(customerId, monthRange.startDate, monthRange.endDate),
            ]);

            setWeekData(week);
            setMonthData(month);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const rows = weekData && monthData
        ? [
            {
                metric: 'Vehicle Plug-ins',
                week: weekData.numberOfPlugSessions,
                month: monthData.numberOfPlugSessions,
                trend: monthData.numberOfPlugSessions - weekData.numberOfPlugSessions,
                format: 'number',
            },
            {
                metric: 'Schedules Followed',
                week: weekData.schedulesFollowed,
                month: monthData.schedulesFollowed,
                trend: monthData.schedulesFollowed - weekData.schedulesFollowed,
                format: 'number',
            },
            {
                metric: 'Dollars Saved',
                week: weekData.dollarsSaved,
                month: monthData.dollarsSaved,
                trend: monthData.dollarsSaved - weekData.dollarsSaved,
                format: 'currency',
            },
            {
                metric: 'Schedules Overridden',
                week: weekData.schedulesOverridden,
                month: monthData.schedulesOverridden,
                trend: monthData.schedulesOverridden - weekData.schedulesOverridden,
                format: 'number',
            },
            {
                metric: 'Missed Savings',
                week: weekData.missedSavings,
                month: monthData.missedSavings,
                trend: monthData.missedSavings - weekData.missedSavings,
                format: 'currency',
            },
            {
                metric: 'KWH Shifted',
                week: weekData.kwhShifted,
                month: monthData.kwhShifted,
                trend: monthData.kwhShifted - weekData.kwhShifted,
                format: 'kwh',
            },
        ]
        : [];

    if (loading) {
        return (
            <Card className="activity-summary-card">
                <Card.Body className="d-flex justify-content-center align-items-center py-5">
                    <Spinner animation="border" size="sm" className="activity-spinner" />
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="activity-summary-card">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                    <div className="activity-error-icon">!</div>
                    <p className="activity-error-title mb-0">Unable to load activity data</p>
                    <p className="activity-error-subtitle mb-2">
                        We're having trouble connecting to the server. Please try again.
                    </p>
                    <Button className="activity-retry-btn" onClick={fetchSummary}>
                        Retry
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="activity-summary-card">
            <Card.Body className="p-3">
                <Card.Title className="activity-summary-title mb-3">
                    Activity Summary
                </Card.Title>
                <Table className="activity-summary-table" borderless responsive>
                    <thead>
                    <tr>
                        <th className="col-metric">METRIC</th>
                        <th className="col-value">THIS WEEK</th>
                        <th className="col-value">THIS MONTH</th>
                        <th className="col-trend">TREND (DIRECTIONAL)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(({ metric, week, month, trend, format }) => (
                        <tr key={metric}>
                            <td className="cell-metric">{metric}</td>
                            <td className="cell-value">{formatValue(week, format)}</td>
                            <td className="cell-value">{formatValue(month, format)}</td>
                            <td className="cell-trend">
                                <TrendIndicator value={trend} format={format} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default DPAccountSummary;
