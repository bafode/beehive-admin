// IMPORTS
import React from 'react';
import Grid from '@mui/material/Grid';
import ProfileCard from './ProfileCard';
import Tabs from './Tabs';
import coverPave from 'assets/images/partner-cover-page.jpg';
import { Box, Container } from '@mui/system';
import { Card } from '@mui/material';
import PartnerOfferDataTable from './PartnerOfferDataTable';
import Typography from '@mui/material/Typography';

export default function Profile({ user }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: '0 0 auto' }}>
                <img
                    alt="avatar"
                    style={{
                        width: '100vw',
                        height: '35vh',
                        objectFit: 'cover',
                        objectPosition: '50% 50%'
                    }}
                    src={coverPave}
                />
            </Box>

            <Box sx={{ flex: '1 0 auto', px: { xs: 0, md: 10 }, mt: '-20vh' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={3}>
                        <ProfileCard user={user} />
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Tabs user={user} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h3" mb={2}>
                                    List des offres
                                </Typography>
                                <Card variant="outlined">
                                    <PartnerOfferDataTable user={user} />
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
