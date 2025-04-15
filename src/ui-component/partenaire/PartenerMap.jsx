import { useState, useEffect } from 'react';
import { GoogleMap, InfoWindowF, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Box, Container } from '@mui/system';

const PartenaireGoogleMapView = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY
    });

    const [activeMarker, setActiveMarker] = useState(null);
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const data = [
            {
                _id: '1',
                address: '1600 Amphitheatre Parkway, Mountain View, CA',
                companyName: 'Google',
                phoneNumber: '123-456-7890',
                picture: 'https://example.com/google_logo.png'
            },
            {
                _id: '2',
                address: '1 Apple Park Way, Cupertino, CA',
                companyName: 'Apple',
                phoneNumber: '098-765-4321',
                picture: 'https://example.com/apple_logo.png'
            },
            {
                _id: '3',
                address: '350 Fifth Avenue, New York, NY',
                companyName: 'Empire State Building',
                phoneNumber: '555-555-5555',
                picture: 'https://example.com/empire_state_logo.png'
            },
            {
                _id: '4',
                address: '221B Baker Street, London',
                companyName: 'Sherlock Holmes Museum',
                phoneNumber: '444-444-4444',
                picture: 'https://example.com/sherlock_holmes_logo.png'
            },
            {
                _id: '5',
                address: '4 Privet Drive, Little Whinging, Surrey',
                companyName: "Harry Potter's House",
                phoneNumber: '777-777-7777',
                picture: 'https://example.com/harry_potter_logo.png'
            }
        ];

        const geocodeAddresses = async () => {
            const geocodedPartners = await Promise.all(
                data.map(async (partner) => {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(partner.address)}&key=${import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY}`
                    );
                    const result = await response.json();
                    console.log('Geocode result for', partner.address, result); // Log the result
                    if (result.results.length > 0) {
                        const { lat, lng } = result.results[0].geometry.location;
                        return {
                            ...partner,
                            position: { lat, lng }
                        };
                    }
                    return partner;
                })
            );

            setPartners(geocodedPartners);
        };

        geocodeAddresses();
    }, []);

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Container sx={{ py: 2 }}>
                <Box>
                    {isLoaded ? (
                        <GoogleMap
                            center={{ lat: 37.7749, lng: -122.4194 }} // Centré sur San Francisco par exemple
                            zoom={10}
                            onClick={() => setActiveMarker(null)}
                            mapContainerStyle={{ width: '100%', height: '70vh' }}
                        >
                            {partners.map(({ _id, companyName, position, picture, phoneNumber }) => (
                                <MarkerF key={_id} position={position} onClick={() => handleActiveMarker(_id)}>
                                    {activeMarker === _id ? (
                                        <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                                            <div>
                                                <img src={picture} alt={companyName} style={{ width: '50px', height: '50px' }} />
                                                <p>{companyName}</p>
                                                <p>{phoneNumber}</p>
                                            </div>
                                        </InfoWindowF>
                                    ) : null}
                                </MarkerF>
                            ))}
                        </GoogleMap>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default PartenaireGoogleMapView;
