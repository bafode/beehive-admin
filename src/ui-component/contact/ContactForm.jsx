import React, { useState } from 'react';
import { Grid, Button, TextField, Typography } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Subject: '',
        News: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/message', formData);
            console.log('Message sent successfully:', response.data);

            setFormData({
                FirstName: '',
                LastName: '',
                Email: '',
                Subject: '',
                News: ''
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <Typography textAlign={'start'} color={'grey'} variant="h4" align="center" component="h1" gutterBottom>
                Envoyer un message
            </Typography>
            <form id="contact-form" onSubmit={handleSubmit}>
                <Grid container direction="column" justify="center" alignItems="center">
                    <Grid container spacing={2} item>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                fullWidth
                                required
                                id="FirstName"
                                label="Prénom"
                                name="FirstName"
                                value={formData?.FirstName}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                fullWidth
                                required
                                id="LastName"
                                label="Nom"
                                name="LastName"
                                value={formData.LastName}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                fullWidth
                                required
                                id="Email"
                                label="Email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                fullWidth
                                required
                                id="Subject"
                                label="Sujet"
                                name="Subject"
                                value={formData.Subject}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                fullWidth
                                required
                                id="News"
                                label="Message"
                                name="News"
                                value={formData.News}
                                onChange={handleChange}
                                margin="normal"
                                multiline
                                rowsMax="10"
                                minRows={6}
                            />
                        </Grid>
                        <Grid item sx={12}>
                            <Button sx={{ width: '100%', margin: '1rem' }} fullWidth type="submit" variant="contained" color="primary">
                                Envoyer
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default ContactForm;
