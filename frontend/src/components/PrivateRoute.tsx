import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


/**
 * Can ignore the warning by vs code: Binding element 'Component' implicitly has an 'any' type
 * because this part is designed to accpet any type.
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
    const {isAuthenticated} = useAuth();
    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/" />
                )
            }
        />
    );
};

export default PrivateRoute;