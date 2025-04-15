import React, { useEffect, useState } from 'react';
import { Grid, Box, Container, Typography } from '@mui/material';
import PartnerCard from 'ui-component/cards/PartnerCard';
import axiosInstance from 'api/axiosInstance';

const PartnersList = () => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await axiosInstance.get('/partners');

                console.log(response.data);

                setPartners(response.data.data);
            } catch (error) {
                console.error('Error fetching partners:', error);
            }
        };

        fetchPartners();
    }, []);

    if (!Array.isArray(partners)) {
        console.error('Expected an array of partners but got:', partners);
        return null;
    }

    return (
        <Container sx={{ py: 10 }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Typography
                    variant="h3"
                    component="h3"
                    color="White"
                    sx={{
                        backgroundColor: 'Black',
                        display: 'inline-block',
                        padding: 1,
                        paddingX: 3,
                        paddingTop: 2,
                        paddingBottom: 2,
                        marginBottom: 8,
                        marginTop: -10
                    }}
                >
                    LES MEMBRES DU RÉSEAU ÉTOILE
                </Typography>
            </Box>

            <Grid container spacing={1} justifyContent="start">
                {partners.map((partner) => (
                    <Grid item key={partner._id} xs={6} sm={4} md={3}>
                        <PartnerCard partner={partner} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PartnersList;
