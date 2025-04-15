import { Card, CardContent, CardMedia, Typography, CardActions, Box } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import slider2 from 'assets/images/slider2.webp';
import AppButtonLink from './AppButtonLink';

const EventMatchCard = ({ title, imgUrl, description, date, actionButtonTitle, slug }) => {
    const dateObj = new Date(date);
    return (
        <Card variant="outlined">
            <Box p={1}>
                <CardMedia sx={{ borderRadius: '10px' }} component="img" image={imgUrl || slider2} alt="London" />
            </Box>
            <CardContent>
                <Typography variant="h4" component="div" mb={2}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ marginTop: 2 }}>
                    <CalendarMonthOutlinedIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 0.5 }}>
                        {dateObj?.toLocaleString()}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <AppButtonLink to={`/event/${slug}`} actionButtonTitle={actionButtonTitle} />
            </CardActions>
        </Card>
    );
};

export default EventMatchCard;
