import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { getUserProfile } from '../../clients/BackendConnector.js';
import './Header.scss';

const Header = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');
        if (customerId) {
            getUserProfile(customerId)
                .then(setProfile)
                .catch(() => setProfile(null));
        }
    }, []);

    const fullName = profile ? `${profile.firstName} ${profile.lastName}` : '';

    return (
        <header className="app-header">
            <div className="app-header__brand">
                <span className="app-header__brand-text">Ford Energy Rewards</span>
            </div>

            <div className="app-header__user">
                {fullName && (
                    <span className="app-header__user-name">{fullName}</span>
                )}
                <div className="app-header__avatar">
                    <FaUser />
                </div>
            </div>
        </header>
    );
};

export default Header;

