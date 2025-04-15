import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, ButtonBase, CardActionArea } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CatCard = ({ title, description, image, link }) => {
    return (
        <Card sx={{ backgroundColor: '#f6f6f6' }}>
            <CardActionArea component={Link} to={link} sx={{ height: '100%' }}>
                <Typography variant="h4" component="div" sx={{ marginBottom: 2, marginTop: 4, textAlign: 'center' }}>
                    {title}
                </Typography>
                <Box sx={{ padding: 1, marginTop: 4 }}>
                    <CardMedia sx={{ borderRadius: '10px', height: 200 }} component="img" image={image} alt="Image Loading..." />
                </Box>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

CatCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
};

export default CatCard;
