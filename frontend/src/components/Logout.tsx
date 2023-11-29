import { useEffect } from 'react';
import { Redirect } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Logout: React.FC = () => {
    const { logout } = useAuth();

    useEffect(() => {
        (async () => {
            await logout();
        })();
    }, [logout]);

    return <Redirect to="/login" />;
};

export default Logout;

