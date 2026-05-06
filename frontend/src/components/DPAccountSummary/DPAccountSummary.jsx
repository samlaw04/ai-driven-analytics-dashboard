import { useState, useEffect, useCallback } from 'react';
import { Card, Table, Spinner, Button } from 'react-bootstrap';
import { getDPAccountSummary } from '../../clients/BackendConnector';
import './DPAccountSummary.scss';

const getWeekRange = () => {
    const now = new Date();
    let twoWeekRange = new Date()
    twoWeekRange.setDate(twoWeekRange.getDate() - 7)

    return {
        startDate: twoWeekRange.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        endDate: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    };
};

const getPreviousTwoWeekRange = () => {
    const now = new Date();
    let twoWeekRange = new Date()
    twoWeekRange.setDate(twoWeekRange.getDate() - 14)

    return {
        startDate: twoWeekRange.toISOString().replace(/\.\d{3}Z$/, 'Z'),
        endDate: now.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    };
};

const TrendIndicator = ({ value, format, isUpArrow }) => {
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

    if (isUpArrow) {
        return (
            <span className="trend trend--positive">
                ▲ {display}
            </span>
        );
    }
    if (isUpArrow === false) {
        return (
            <span className="trend trend--negative">
                ▼ {display}
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

function configureTrend(twoWeeksData, oneWeeksData) {
    const secondWeekValue = twoWeeksData - oneWeeksData;
    if (oneWeeksData > secondWeekValue) {
        return oneWeeksData - secondWeekValue;
    } else if (oneWeeksData < secondWeekValue) {
        return secondWeekValue - oneWeeksData;
    } else {
        return oneWeeksData - secondWeekValue;
    }
}

function isUp(twoWeeksData, oneWeeksData) {
    const secondWeekValue = twoWeeksData - oneWeeksData;
    if (oneWeeksData > secondWeekValue) {
        return true
    } else if (oneWeeksData < secondWeekValue) {
        return false
    } else {
        return null
    }
}


const DPAccountSummary = () => {
    const [weekData, setWeekData] = useState(null);
    const [twoWeekData, setTwoWeekData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchSummary = useCallback(async () => {
        const customerId = sessionStorage.getItem('customerId');
        if (!customerId) return;

        setLoading(true);
        setError(false);

        try {
            const weekRange = getWeekRange();
            const twoWeekRange = getPreviousTwoWeekRange();

            const [week, twoWeeks] = await Promise.all([
                getDPAccountSummary(customerId, weekRange.startDate, weekRange.endDate),
                getDPAccountSummary(customerId, twoWeekRange.startDate, twoWeekRange.endDate),
            ]);

            setWeekData(week);
            setTwoWeekData(twoWeeks);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const rows = weekData && twoWeekData
        ? [
            {
                metric: 'Vehicle Plug-ins',
                week: weekData.numberOfPlugSessions,
                twoWeeks: twoWeekData.numberOfPlugSessions,
                trend: configureTrend(twoWeekData.numberOfPlugSessions, weekData.numberOfPlugSessions),
                isUpArrow: isUp(twoWeekData.numberOfPlugSessions, weekData.numberOfPlugSessions),
                format: 'number',
            },
            {
                metric: 'Schedules Followed',
                week: weekData.schedulesFollowed,
                twoWeeks: twoWeekData.schedulesFollowed,
                trend: configureTrend(twoWeekData.schedulesFollowed, weekData.schedulesFollowed,),
                isUpArrow: isUp(twoWeekData.schedulesFollowed, weekData.schedulesFollowed,),
                format: 'number',
            },
            {
                metric: 'Dollars Saved',
                week: weekData.dollarsSaved,
                twoWeeks: twoWeekData.dollarsSaved,
                trend: configureTrend(twoWeekData.dollarsSaved, weekData.dollarsSaved),
                isUpArrow: isUp(twoWeekData.schedulesFollowed, weekData.schedulesFollowed,),
                format: 'currency',
            },
            {
                metric: 'Schedules Overridden',
                week: weekData.schedulesOverridden,
                twoWeeks: twoWeekData.schedulesOverridden,
                trend: configureTrend(twoWeekData.schedulesOverridden, weekData.schedulesOverridden),
                isUpArrow: isUp(twoWeekData.schedulesOverridden, weekData.schedulesOverridden),
                format: 'number',
            },
            {
                metric: 'Missed Savings',
                week: weekData.missedSavings,
                twoWeeks: twoWeekData.missedSavings,
                trend: configureTrend(twoWeekData.missedSavings, weekData.missedSavings),
                isUpArrow: isUp(twoWeekData.missedSavings, weekData.missedSavings),
                format: 'currency',
            },
            {
                metric: 'KWH Shifted',
                week: weekData.kwhShifted,
                twoWeeks: twoWeekData.kwhShifted,
                trend: configureTrend(twoWeekData.kwhShifted, weekData.kwhShifted),
                isUpArrow: isUp(twoWeekData.kwhShifted, weekData.kwhShifted),
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
                        <th className="col-value">LAST TWO WEEKS</th>
                        <th className="col-trend">TREND (DIRECTIONAL)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(({ metric, week, twoWeeks, trend, isUpArrow, format }) => (
                        <tr key={metric}>
                            <td className="cell-metric">{metric}</td>
                            <td className="cell-value">{formatValue(week, format)}</td>
                            <td className="cell-value">{formatValue(twoWeeks, format)}</td>
                            <td className="cell-trend">
                                <TrendIndicator value={trend} format={format} isUpArrow={isUpArrow} />
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
