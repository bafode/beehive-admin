import React from 'react';
import { Card, CardMedia, Box, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const PartnerCard = ({ partner }) => {
    const { picture } = partner;

    return (
        <Card sx={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
            <CardActionArea component={Link} to={`/partner/partner-detail/${partner._id}`} sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CardMedia
                        sx={{
                            borderRadius: '10px',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        component="img"
                        image={picture}
                        alt="Partner Image"
                        title="Partner Image"
                    />
                </Box>
            </CardActionArea>
        </Card>
    );
};

export default PartnerCard;
