import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box } from '@mui/material';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PersonIcon from '@mui/icons-material/Person';
import slider2 from 'assets/images/slider2.webp';

const AppCard = () => {
    return (
        <Card sx={{ backgroundColor: '#f6f6f6' }}>
            <Box p={1}>
                <CardMedia sx={{ borderRadius: '10px' }} component="img" image={slider2} alt="London" />
            </Box>
            <CardContent>
                <Typography variant="h4" component="div" mb={2}>
                    L’Arabie saoudite veut arracher 6 stars au FC Barcelone
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Le FC Barcelone se prépare à un mercato estival très compliqué. Dans une situation financière fragile, et pas aidé par
                    le fair-play financier de la Liga qui ne lui donne aucune marge de manoeuvre pour recruter
                </Typography>
                <Box display="flex" alignItems="center" sx={{ marginTop: 2 }}>
                    <WatchLaterIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 0.5 }}>
                        3 hours, 12 minutes
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" sx={{ marginTop: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 0.5 }}>
                        34,129 viewers
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button fullWidth size="small" variant="outlined">
                    Plus
                </Button>
            </CardActions>
        </Card>
    );
};

export default AppCard;
