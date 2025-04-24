import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../css/layout.css';
import Header from '../atoms/Header';

export default function Layout() {
    return (
        <div className="app-container">
            <Header />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
}

