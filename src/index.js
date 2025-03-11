import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/scss/style.scss';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './provisers/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <AuthProvider>
            <App />  
        </AuthProvider>
    </BrowserRouter>
);