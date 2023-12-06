import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);


/* Sometime, router doesn't work under StrictMode */
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
defineCustomElements(window);
root.render(
    <App />
);

