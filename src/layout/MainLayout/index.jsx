import { Outlet, useLocation, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Header from './Header';
import Footer from './Footer';

// ==============================|| Main layout ||============================== //

const MainLayout = () => {
    const { partnerDetail, partnerId } = useParams();
    const location = useLocation();
    const noHeaderFooterRoutes = [`/partner/partner-detail/${partnerId}`];
    const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);

    return (
        <Box>
            {!hideHeaderFooter && <Header />}
            <Outlet />
            {!hideHeaderFooter && <Footer />}
        </Box>
    );
};

export default MainLayout;
