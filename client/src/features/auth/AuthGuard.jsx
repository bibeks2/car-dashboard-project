import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { logout, hydrateUser } from './authSlice';

const AuthGuard = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                dispatch(logout());
            } else {
                dispatch(hydrateUser({ user: { email: decodedToken.email } }));
            }
        }
    }, [dispatch]);
    
    return children;
};

export default AuthGuard;