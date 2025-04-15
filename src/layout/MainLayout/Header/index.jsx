import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import logoSrc from 'assets/images/logo.svg';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const menuItems = [
    { name: 'ACCUEIL', link: '/', icon: <HomeIcon color="primary" /> },
    { name: 'PARTENAIRE', link: '/partner', icon: <PeopleIcon color="primary" /> },
    { name: 'EVENEMENTS', link: '/event', icon: <EventIcon color="primary" /> },
    { name: 'BILLETERIE', link: '/ticket', icon: <TicketIcon color="primary" /> },
    { name: 'CONTACT', link: '/contact', icon: <ContactMailIcon color="primary" /> },
    { name: 'PROFILE', link: '/profile', icon: <PersonIcon color="primary" /> }
];

const Index = () => {
    const { logout, auth } = useAuth();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const navigation = useNavigate();
    console.log(auth);
    const handleLogout = async () => {
        await logout();
        navigation('/auth/login');
        toast.info('Déconnexion avec succès');
    };

    const menuItems = [
        { name: 'Accueil', link: '/', icon: <HomeIcon color="primary" /> },
        { name: 'Partenaire', link: '/partner', icon: <PeopleIcon color="primary" /> },
        { name: 'Evenement', link: '/event', icon: <EventIcon color="primary" /> },
        { name: 'Billeterie', link: '/ticket', icon: <TicketIcon color="primary" /> },
        { name: 'Contact', link: '/contact', icon: <ContactMailIcon color="primary" /> },
        ...(auth.isAuthenticated && auth.user.role === 'partner'
            ? [{ name: 'Profile', link: '/profile', icon: <PersonIcon color="primary" /> }]
            : auth.isAuthenticated && auth.user.role === 'admin'
              ? [{ name: 'Admin', link: '/admin', icon: <AdminIcon color="primary" /> }]
              : [])
    ];

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerContent = (
        <Box
            sx={{
                width: 150
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List color="white">
                {menuItems.map((item, index) => (
                    <ListItem button key={item.name + index}>
                        <ListItemText>
                            <Link
                                to={item.link}
                                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                            >
                                {item.icon}
                                <Typography variant="h6" sx={{ marginLeft: '10px' }}>
                                    {item.name}
                                </Typography>
                            </Link>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    return (
        <>
            {isLargeScreen ? (
                <AppBar position="static" color="primary">
                    <Container maxWidth="lg">
                        <Toolbar disableGutters sx={{ justifyContent: 'center' }}>
                            <Button component={Link} to="/" sx={{ p: 0 }}>
                                <Typography variant="h6" noWrap component="div" sx={{ textAlign: 'start', marginRight: '3.5rem' }}>
                                    <img src={logoSrc} alt="Logo" style={{ height: '70px' }} />
                                </Typography>
                            </Button>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {menuItems.map((item, index) => (
                                    <Link to={item.link} key={item.name + index} style={{ textDecoration: 'none' }}>
                                        <Typography variant="h4" sx={{ marginRight: '2rem', color: 'white' }}>
                                            {item.name}
                                        </Typography>
                                    </Link>
                                ))}
                            </Box>
                            {auth.isAuthenticated ? (
                                <Button variant="contained" color="error" size="large" onClick={handleLogout}>
                                    Se déconnecter
                                </Button>
                            ) : (
                                <Button variant="outlined" color="inherit" size="large" component="a" href="/auth/login">
                                    Se connecter
                                </Button>
                            )}
                        </Toolbar>
                    </Container>
                </AppBar>
            ) : (
                <>
                    <AppBar position="static" color="primary">
                        <Container maxWidth="lg" sx={{ backgroundColor: 'primary.main' }}>
                            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                                <Typography variant="h6" noWrap component="div">
                                    <img src={logoSrc} alt="Logo" style={{ height: '40px' }} />
                                </Typography>
                                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                                    <MenuIcon />
                                </IconButton>
                            </Toolbar>
                        </Container>
                    </AppBar>
                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                        {drawerContent}
                    </Drawer>
                </>
            )}
        </>
    );
};

export default Index;
