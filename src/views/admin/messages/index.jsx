// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import MessageList from 'ui-component/message/MessageList';

// ==============================|| SAMPLE PAGE ||============================== //

const MessagesAdmin = () => (
    <MainCard title="Messages">
        <Typography variant="body2">
            <MessageList />
        </Typography>
    </MainCard>
);

export default MessagesAdmin;
