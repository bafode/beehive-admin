import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Box, Container, Typography } from '@mui/material';
import useSWR from 'swr';
import axiosInstance from 'api/axiosInstance';
import FullContentCard from 'ui-component/cards/WebsiteCard';

const fetchPartner = async (url) => {
    try {
        const response = await axiosInstance.get(url);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

const Website = () => {
    const { partnerId: routePartnerId } = useParams();
    const [partnerId, setPartnerId] = useState(routePartnerId);

    // Fetch partner data using SWR
    const { data: partner, error, isValidating } = useSWR(partnerId ? `/partner/${partnerId}` : null, fetchPartner);

    useEffect(() => {
        if (routePartnerId) {
            setPartnerId(routePartnerId);
        }
    }, [routePartnerId]);

    if (isValidating) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error loading partner</Typography>;
    }

    if (!partner) {
        return <Typography>No partner data available</Typography>;
    }

    return (
        <Grid>
            <FullContentCard partner={partner} />
        </Grid>
    );
};

export default Website;
