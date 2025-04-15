import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { Box } from '@mui/system';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PersonIcon from '@mui/icons-material/Person';
import styled from '@emotion/styled';

const OfferCard = ({ offre, setSelectedOffer }) => {
    const dateUpdatedAt = offre?.updatedAt ? new Date(offre.updatedAt) : null;

    return (
        <Card sx={{ backgroundColor: '#f6f6f6' }}>
            <Box p={1}>
                <CardMedia sx={{ borderRadius: '10px' }} component="img" image={offre?.imageUrl} alt="Offer Image" />
            </Box>
            <CardContent>
                <MultiLineText variant="h5" lines={1} component="div">
                    L’Arabie saoudite veut arracher 6 stars au FC Barcelone
                </MultiLineText>
                <MultiLineText lines={2} variant="body2" color="text.secondary" dangerouslySetInnerHTML={true}>
                    {offre?.description}
                </MultiLineText>
                <Box display="flex" alignItems="center" sx={{ marginTop: 2 }}>
                    <WatchLaterIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 0.5 }}>
                        {formatDate(dateUpdatedAt)}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" sx={{ marginTop: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 0.5 }}>
                        34 viewers
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button fullWidth size="small" variant="outlined" onClick={() => setSelectedOffer(offre)}>
                    Plus
                </Button>
            </CardActions>
        </Card>
    );
};

const MultiLineText = ({ lines = 3, dangerouslySetInnerHTML = false, children, ...props }) => {
    return (
        <MultiLineTextWrapper lines={lines} {...props}>
            {dangerouslySetInnerHTML ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
        </MultiLineTextWrapper>
    );
};

const MultiLineTextWrapper = styled(Typography)(({ lines }) => ({
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines
}));

const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default OfferCard;
