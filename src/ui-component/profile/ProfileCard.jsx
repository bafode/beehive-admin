// IMPORTS
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

// STYLES
const styles = {
    details: {
        padding: '1rem',
        borderTop: '1px solid #e1e1e1'
    },
    value: {
        padding: '1rem 2rem',
        borderTop: '1px solid #e1e1e1',
        color: '#899499'
    }
};

// APP
export default function ProfileCard({ user }) {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const handlePhotoChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                setProfilePhoto(reader.result);
                const formData = new FormData();
                formData.append('picture', file);
                try {
                    await axiosInstance.put(`/partner-picture/${user?._id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    toast.success('La photo de profil a été modifiée avec succès');
                } catch (error) {
                    toast.error('Server error');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card variant="outlined">
            <Grid container direction="column" justifyContent="center" alignItems="center">
                <Grid item sx={{ p: '1.5rem 0rem', textAlign: 'center' }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <IconButton
                                sx={{
                                    border: (them) => `solid 2px ${them.palette.primary.main}`,
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    padding: '.2rem',
                                    width: 35,
                                    height: 35
                                }}
                                color="primary"
                                component="label"
                            >
                                <PhotoCameraIcon sx={{ width: 20, height: 20 }} />
                                <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                            </IconButton>
                        }
                    >
                        <Avatar sx={{ width: 100, height: 100, mb: 1.5 }} src={profilePhoto || user?.picture}>
                            logo
                        </Avatar>
                    </Badge>
                    <Typography variant="h6">Logo d'entreprise</Typography>
                    <Typography color="text.secondary">{user.title}</Typography>
                </Grid>

                <Grid container>
                    <Grid item xs={6}>
                        <Typography style={styles.details}>Nom</Typography>
                        <Typography style={styles.details}>Prénom</Typography>
                        <Typography style={styles.details}>Email</Typography>
                    </Grid>
                    {/* VALUES */}
                    <Grid item xs={6} sx={{ textAlign: 'end' }}>
                        <Typography style={styles.value}>{user.firstName}</Typography>
                        <Typography style={styles.value}>{user.lastName}</Typography>
                        <Typography style={styles.value}>{user.email}</Typography>
                    </Grid>
                </Grid>

                <Grid item style={styles.details} sx={{ width: '100%' }}>
                    <Button variant="contained" color="secondary" sx={{ width: '99%', p: 1, my: 2 }}>
                        Voir profile public
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
}
