import React, { useEffect, useState } from 'react';
import './UpcomingDrEvent.scss';
import { getUpcomingDrEvent } from '../../clients/BackendConnector.js';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatWindow = (windowJson) => {
    try {
        const parsed = JSON.parse(windowJson);
        if (parsed.start && parsed.end) {
            return `${parsed.start} – ${parsed.end}`;
        }
        return windowJson;
    } catch {
        return windowJson;
    }
};

const UpcomingDrEvent = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');

        const fetchEvent = async () => {
            if (!customerId) return;
            try {
                const data = await getUpcomingDrEvent(customerId);
                setEvent(data);
            } catch {
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, []);

    if (loading || !event) return null;

    return (
        <div className="upcoming-dr-event">
            <h2 className="upcoming-dr-event__title">Upcoming DR Event</h2>
            <div className="upcoming-dr-event__body">
                <div className="upcoming-dr-event__row">
                    <span className="upcoming-dr-event__label">Date</span>
                    <span className="upcoming-dr-event__value">{formatDate(event.drEventDate)}</span>
                </div>
                <div className="upcoming-dr-event__row">
                    <span className="upcoming-dr-event__label">Window</span>
                    <span className="upcoming-dr-event__value">{formatWindow(event.drEventWindow)}</span>
                </div>
            </div>
        </div>
    );
};

export default UpcomingDrEvent;

