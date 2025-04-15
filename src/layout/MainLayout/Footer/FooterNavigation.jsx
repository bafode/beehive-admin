import React, { FC } from 'react';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import FooterSectionTitle from './FooterSectionTitle';

const companyMenu = [
    { label: 'Contact Us', path: '#' },
    { label: 'Privacy & Policy', path: '#' },
    { label: 'Term & Condition', path: '#' },
    { label: 'FAQ', path: '#' },
    { label: 'About Us', path: '#' },
    { label: 'Career', path: '#' }
];

const ServicesMenu = [
    { label: 'MyAccount', path: '#' },
    { label: 'Tickets', path: '#' },
    { label: 'Shop', path: '#' },
    { label: 'Membership', path: '#' },
    { label: 'Hospitality', path: '#' },
    { label: 'Stadium Tours', path: '#' }
];

const languagesMenu = [
    { label: 'English', path: '#' },
    { label: 'French', path: '#' }
];

const NavigationItem = ({ label, path }) => {
    return (
        <Link to={path} passHref>
            <MuiLink
                underline="hover"
                sx={{
                    display: 'block',
                    mb: 1,
                    color: 'white'
                }}
            >
                {label}
            </MuiLink>
        </Link>
    );
};

const FooterNavigation = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <FooterSectionTitle title="Besoin d'aide?" />
                {companyMenu.map(({ label, path }, index) => (
                    <NavigationItem key={index + path} label={label} path={path} />
                ))}
            </Grid>
            <Grid item xs={12} md={4}>
                <FooterSectionTitle title="Services" />
                {ServicesMenu.map(({ label, path }, index) => (
                    <NavigationItem key={index + path} label={label} path={path} />
                ))}
            </Grid>
            <Grid item xs={12} md={4}>
                <FooterSectionTitle title="Langues" />
                {languagesMenu.map(({ label, path }, index) => (
                    <NavigationItem key={index + path} label={label} path={path} />
                ))}
            </Grid>
        </Grid>
    );
};

export default FooterNavigation;
