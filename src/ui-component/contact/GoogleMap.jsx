import { Fragment, useState } from 'react';
import { GoogleMap, InfoWindowF, MarkerF, useLoadScript, StreetViewPanorama } from '@react-google-maps/api';
import { Box, Container, Card, CardContent, Typography, IconButton } from '@mui/material';
import LocationCity from '@mui/icons-material/LocationCity';

const markers = [
    {
        id: 1,
        name: 'Saint Ouens',
        position: { lat: 48.90654, lng: 2.33339 },
        address: '92, rue du docteur Bauer 93400 Saint-Ouen',
        phone: '01 40 11 04 26',
        email: 'redstarfc@contact.fr',
        additionalDetails: 'Stade Bauer',
        street: 'rue du docteur Bauer',
        number: '92',
        city: 'Saint-Ouen',
        zipCode: '93400',
        mailBox: 'Boîte Postale 1234',
        delegate: {
            firstName: 'Jean',
            lastName: 'Dupont'
        }
    }
];

const GoogleMapView = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY
    });

    const [activeMarker, setActiveMarker] = useState(null);
    const [showStreetView, setShowStreetView] = useState(false);

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
        setShowStreetView(false); // Close street view when switching markers
    };

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Container sx={{ py: 2 }}>
                <Box>
                    {isLoaded ? (
                        <GoogleMap
                            center={{ lat: 48.856614, lng: 2.3522219 }}
                            zoom={10}
                            onClick={() => setActiveMarker(null)}
                            mapContainerStyle={{ width: '100%', height: '70vh' }}
                        >
                            {markers.map((marker) => (
                                <MarkerF key={marker.id} position={marker.position} onClick={() => handleActiveMarker(marker.id)}>
                                    {activeMarker === marker.id ? (
                                        <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                                            <Card sx={{ display: 'flex', flexDirection: 'column', m: '0px' }}>
                                                <Box sx={{ alignSelf: 'center' }}>
                                                    <Typography component="h4" variant="h5">
                                                        {marker.name}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                                        <Typography color="body2">{marker.additionalDetails}</Typography>
                                                        <Typography color="body2">
                                                            {marker.number} {marker.street}
                                                        </Typography>
                                                        <Typography variant="body2">{marker.mailBox}</Typography>
                                                        <Typography variant="body2">{`${marker.zipCode} ${marker.city}`}</Typography>
                                                        <Typography variant="body2">
                                                            <a href={`mailto:${marker.email}`}>{marker.email}</a>
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {marker.delegate.firstName} {marker.delegate.lastName}
                                                        </Typography>
                                                        <Typography variant="body2">Tel: {marker.phone}</Typography>
                                                    </CardContent>
                                                    <IconButton
                                                        aria-label="location"
                                                        size="large"
                                                        color="success"
                                                        onClick={() => setShowStreetView(!showStreetView)}
                                                    >
                                                        <LocationCity />
                                                    </IconButton>
                                                    {showStreetView && (
                                                        <StreetViewPanorama
                                                            position={marker.position}
                                                            visible={showStreetView}
                                                            onCloseclick={() => setShowStreetView(false)}
                                                            onUnmount={() => setShowStreetView(false)}
                                                        />
                                                    )}
                                                </Box>
                                            </Card>
                                        </InfoWindowF>
                                    ) : null}
                                </MarkerF>
                            ))}
                        </GoogleMap>
                    ) : null}
                </Box>
            </Container>
        </Box>
    );
};

export default GoogleMapView;
