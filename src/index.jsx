import { createRoot } from 'react-dom/client';

// third party
import { Provider } from 'react-redux';

// project imports
import App from './App';
// import reducer from './store/reducer';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// style + assets
import 'assets/scss/style.scss';
import reportWebVitals from 'reportWebVitals';
// swiper slider
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
import { AuthProvider } from 'context/AuthContext';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
// editor
import 'react-quill/dist/quill.snow.css';

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark-reasonable.css';

// ----------------------------------------------------------------------

hljs.configure({
    languages: ['javascript', 'jsx', 'sh', 'bash', 'html', 'scss', 'css', 'json']
});

if (typeof window !== 'undefined') {
    window.hljs = hljs;
}

// ==============================|| App DOM RENDER  ||============================== //

root.render(
    <AuthProvider>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
                <ToastContainer theme="colored" />
            </PersistGate>
        </Provider>
    </AuthProvider>
);

reportWebVitals();
