import React from 'react';
import { Card, CardContent, Typography, Button, Box, CardActions } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useParams } from 'react-router-dom';
import AppButtonLink from './AppButtonLink';

const AppPriceCard = ({ title, price, features, availability, description, slug }) => {
    const { eventDetail } = useParams();
    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <CardContent>
                <Typography variant="h2" component="div" align="center" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" component="div" align="center" gutterBottom>
                    ${price}
                </Typography>
                <Typography variant="h4" py={1} component="div" align="center" gutterBottom>
                    {availability}: Place
                </Typography>
                <Typography py={2} variant="body1" component="div" align="center" gutterBottom>
                    {description}
                </Typography>
                <Box>
                    {features.map((feature, index) => (
                        <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography>{feature}</Typography>
                            <CheckIcon color="success" />
                        </Box>
                    ))}
                </Box>

                {/*<Button variant="contained" color="primary" fullWidth>*/}
                {/*  Purchase*/}
                {/*</Button>*/}
            </CardContent>
            <CardActions>
                <AppButtonLink to={`/event/${eventDetail}/${slug}`} actionButtonTitle={'Choisir'} />
            </CardActions>
        </Card>
    );
};

export default AppPriceCard;
