import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const FooterSectionTitle = ({ title }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                mb: 2
            }}
        >
            <Typography component="h3" variant="h3" sx={{ color: 'white', fontWeight: '700' }}>
                {title}
            </Typography>
        </Box>
    );
};

export default FooterSectionTitle;
