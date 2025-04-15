import React, { useState } from 'react';
import { Card, Box, Tab, Button, Divider } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonPinIcon from '@mui/icons-material/PersonPin';

import Typography from '@mui/material/Typography';
import PartnerOfferForm from './PartnerOfferForm';
import ProfileForm from './ProfileForm';
import useSWR from 'swr';
import axiosInstance from '../../api/axiosInstance';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Cart from './Cart';

export default function Tabs({ user }) {
    const [tabValue, setTabValue] = useState('1');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Card variant="outlined" sx={{ width: '100%', zIndex: 10 }}>
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="partner-profile">
                        <Tab icon={<PersonPinIcon />} label="COMPTE" value="1" />
                        <Tab icon={<ShoppingBagIcon />} label="CRÉER UNE NOUVELLE OFFRE" value="2" />
                        <Tab icon={<ShoppingBagIcon />} label="COMMANDE" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Typography variant="h4" mb={3}>
                        Les information partenaire
                    </Typography>
                    {/*Profile form*/}
                    <ProfileForm user={user} />
                </TabPanel>
                <TabPanel value="2">
                    <Typography variant="h4" mb={3}>
                        Création d'une offre
                    </Typography>
                    {/*  Création de form offers*/}
                    <PartnerOfferForm user={user} />
                </TabPanel>
                <TabPanel value="3">
                    <Cart user={user} />
                </TabPanel>
            </TabContext>
        </Card>
    );
}

const CartItem = ({ item, isSmallScreen }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', padding: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4">{item.event?.title}</Typography>
                <Typography variant="body2">
                    <strong>Équipe extérieure : </strong>
                    {item.event.awayTeam}
                </Typography>
                <Typography variant="body2">
                    <strong>Équipe à domicile : </strong> {item.event.homeTeam}
                </Typography>

                <Box>
                    <strong>Sièges :</strong>
                    {item?.tickets?.map((seat, index) => (
                        <Chip
                            sx={{ ml: 1 }}
                            label={seat?.seatNumber}
                            key={index}
                            variant="outlined"
                            size="small"
                            avatar={<Avatar>S</Avatar>}
                        />
                    ))}
                </Box>
            </Box>
            <Box sx={{ minWidth: '10rem', textAlign: 'left', mt: isSmallScreen ? 2 : 0 }}>
                <Chip sx={{ minWidth: '5rem' }} label={item?.ticketCategory?.title} color="primary" />
                <Box my={2}>
                    <Typography variant="body2">
                        <strong>Prix unitaire : </strong>
                        {item.unitPrice.toFixed(2)} €
                    </Typography>
                    <Typography variant="body2">
                        <strong>Quantité : </strong>
                        {item.seatQuantity}
                    </Typography>
                </Box>
                <Divider mt={2} />
                <Typography variant="h6">Total : {item.unitPrice} €</Typography>
            </Box>
        </Box>
    );
};
