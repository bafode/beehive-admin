import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AppButtonLink({ variant = 'outlined', fullWidth = true, to, actionButtonTitle }) {
    return (
        <Button fullWidth={fullWidth} size="small" variant={variant} component={Link} to={to}>
            {actionButtonTitle}
        </Button>
    );
}
