import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: '100%',
    margin: '0 auto'
}));

const StyledIframe = styled('iframe')(({ theme }) => ({
    width: '100%',
    height: '100vh',
    border: 'none'
}));

const FullContentCard = ({ partner }) => {
    const { url } = partner;

    return (
        <StyledCard>
            <CardContent>
                <StyledIframe src={url} title="Content Frame" />
            </CardContent>
        </StyledCard>
    );
};

export default FullContentCard;
