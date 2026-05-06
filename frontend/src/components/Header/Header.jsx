import { useState, useEffect } from 'react';
import { Navbar, Container, Image, Spinner } from 'react-bootstrap';
import { getUserProfile } from '../../clients/BackendConnector';
import './Header.scss';

const Header = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const customerId = sessionStorage.getItem('customerId');

        if (!customerId) return;

        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(customerId);
                setProfile(data);
            } catch {
                // Header renders without profile data if fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <Navbar className="app-header" expand={false}>
            <Container className="header-container px-3">

                {/* Ford Oval Logo */}
                <Navbar.Brand className="header-brand p-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 300 120"
                        className="ford-logo"
                        aria-label="Ford"
                    >
                        <ellipse cx="150" cy="60" rx="148" ry="58" fill="#002C5F" stroke="white" strokeWidth="5" />
                        <text
                            x="150"
                            y="78"
                            textAnchor="middle"
                            fill="white"
                            fontSize="72"
                            fontFamily="Arial, sans-serif"
                            fontStyle="italic"
                            fontWeight="bold"
                            letterSpacing="2"
                        >
                            Ford
                        </text>
                    </svg>
                </Navbar.Brand>

                {/* User Info */}
                {loading ? (
                    <Spinner
                        animation="border"
                        size="sm"
                        className="header-spinner"
                    />
                ) : profile && (
                    <div className="header-user d-flex align-items-center gap-2">
                        <span className="header-name">
                            {profile.firstName}
                        </span>
                        {profile.customerVehicle?.encodedPhoto && (
                            <Image
                                src={`data:image/jpeg;base64,${profile.customerVehicle.encodedPhoto}`}
                                roundedCircle
                                className="header-avatar"
                                alt={`${profile.firstName}'s vehicle`}
                            />
                        )}
                    </div>
                )}

            </Container>
        </Navbar>
    );
};

export default Header;
