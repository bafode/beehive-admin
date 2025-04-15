import React from 'react';
import Box from '@mui/material/Box';

const Landing = () => {
    return (
        <Box
            sx={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: 'calc(70vh - 10rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: '2rem'
            }}
        ></Box>
    );
};

export default Landing;
