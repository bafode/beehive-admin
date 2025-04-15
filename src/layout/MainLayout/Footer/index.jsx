import React from 'react';
import { Container, Grid, Box, Typography, Link, IconButton, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SocialLinks from './SocialLink';
import FooterNavigation from './FooterNavigation';
import logoSrc from 'assets/images/logo.png';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: { xs: 6, md: 10 }
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ color: 'black', width: { xs: '100%', md: 360 }, mb: { xs: 3, md: 0 } }}>
                            <Button component={Link} to="/" sx={{ p: 0 }}>
                                <Typography variant="h6" noWrap component="div" sx={{ textAlign: 'start', marginRight: '3.5rem' }}>
                                    <img src={logoSrc} alt="Logo" style={{ height: '70px' }} />
                                </Typography>
                            </Button>
                            <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} pb={2}>
                                <EmailIcon sx={{ color: 'white' }} />
                                <Typography color={'white'} variant="subtitle1" sx={{ letterSpacing: 1, mx: 2 }}>
                                    red-start@contact.com
                                </Typography>
                            </Box>
                            <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                                <CallIcon sx={{ color: 'white' }} />
                                <Typography color={'white'} variant="subtitle1" sx={{ letterSpacing: 1, mx: 2 }}>
                                    +33 6 06 06 06 06
                                </Typography>
                            </Box>
                            <SocialLinks />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <FooterNavigation />
                    </Grid>
                    <Grid item md={12} sx={{ textAlign: 'center', color: 'black', padding: '2rem' }}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} pt={3}>
                            <Typography color={'white'}>Copyright &copy; 2024 Red Star Football Club , tout droit réservé</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
