import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Table from './pages/Table';
import AuthLayout from './components/Layout/AuthLayout';
import GuestLayout from './components/Layout/GuestLayout';
import Login from './pages/auth/Login';
import Blank from './pages/Blank';
import NotFound from './pages/NotFound';
import Form from './pages/Form';
import RegisterIndex from './pages/auth/Register';
import CreateProject from './pages/CreateProject';
import { useAuthContext } from './context/AuthContext';
import Construction from './pages/Construction';
import CreateHandbook from './pages/CreateHandBook';

function MainRouter(props) {
    const [checkAccessToken, setCheckAccessToken] = useState('');
    const { refeshLogin } = useAuthContext();

    useEffect(() => {
        const accessToken = localStorage.getItem('token');
        setCheckAccessToken(accessToken);
    }, [refeshLogin]);
    return (
        <Routes>
            {checkAccessToken !== null ? (
                <>
                    <Route path="/" element={<AuthLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/table" element={<Table />} />
                        <Route path="/create-project" element={<CreateProject />} />
                        <Route path="/create-handbook" element={<CreateHandbook />} />
                        <Route path="/blank" element={<Blank />} />
                        <Route path="/construction" element={<Construction />} />
                        <Route path="/404" element={<NotFound />} />
                        <Route path="/form" element={<Form />} />
                        <Route path="/profile" element={<Blank />} />
                        <Route path="/auth" element={<GuestLayout />}>
                            <Route path="/auth/login" element={<Login />} />
                            <Route path="/auth/register" element={<RegisterIndex />} />
                        </Route>
                    </Route>
                    {/* <Route path="*" element={<Navigate to="/" />} /> */}
                </>
            ) : (
                <>
                    <Route path="*" element={<Navigate to="/auth/login" />} />
                    <Route path="/auth" element={<GuestLayout />}>
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/register" element={<RegisterIndex />} />
                    </Route>
                </>
            )}
        </Routes>
    );
}

export default MainRouter;
