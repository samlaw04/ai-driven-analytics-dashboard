import React, { useEffect, useState } from 'react';
import './ProgramDetails.scss';
import { getProgramDetails, getUserProfile } from '../../clients/BackendConnector.js';

const ProgramDetails = () => {
    const [programDetails, setProgramDetails] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        if (!customerId) return;

        getUserProfile(customerId)
            .then((profile) => {
                const utilityId = profile?.utility?.utilityId;
                if (!utilityId) throw new Error('No utility ID found');
                return getProgramDetails(utilityId);
            })
            .then(setProgramDetails)
            .catch(() => setError(true));
    }, []);

    if (error) return null;
    if (!programDetails) return null;

    return (
        <div className="program-details">
            <h2 className="program-details__title">{programDetails.title}</h2>

            <div className="program-details__body">
                <p className="program-details__description">{programDetails.description1}</p>

                {programDetails.description2 && (
                    <p className="program-details__description">{programDetails.description2}</p>
                )}

                {programDetails.enrollmentDesc && (
                    <div className="program-details__section">
                        <h3 className="program-details__section-title">Enrollment</h3>
                        <p className="program-details__section-text">{programDetails.enrollmentDesc}</p>
                    </div>
                )}

                <div className="program-details__section">
                    <h3 className="program-details__section-title">Charging Incentives</h3>
                    <p className="program-details__section-text">{programDetails.chargingIncentivesDesc}</p>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetails;

