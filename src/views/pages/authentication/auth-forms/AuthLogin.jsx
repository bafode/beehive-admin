import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from 'context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

const AuthLogin = () => {
    const { auth, login } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (auth?.isAuthenticated) {
            if (auth?.user?.role === 'admin') navigate('/admin');
            else navigate('/profile');
        }
    }, []);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required("L'email ou ID est requis"),
        password: Yup.string().max(255).required('Le mots de pass est requis')
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const handleSubmitAuth = async (data) => {
        try {
            const user = await login(data);
            if (user) {
                toast.success('Connexion avec succès');
                if (user?.role === 'admin') navigate('/admin');
                else navigate('/profile');
            }
        } catch (error) {
            toast.error('Error credential');
            console.log({ error });
        }
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Se Connecter</Typography>
                    </Box>
                </Grid>
            </Grid>

            <form noValidate onSubmit={handleSubmit(handleSubmitAuth)}>
                <FormControl fullWidth error={Boolean(errors.email)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-email-login">Adresse e-mail / Identité ID</InputLabel>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <OutlinedInput {...field} id="outlined-adornment-email-login" type="email" label="Email Address / Username" />
                        )}
                    />
                    {errors.email && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                            {errors.email.message}
                        </FormHelperText>
                    )}
                </FormControl>

                <FormControl fullWidth error={Boolean(errors.password)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-password-login">Mot de passe</InputLabel>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <OutlinedInput
                                {...field}
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        )}
                    />
                    {errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                            {errors.password.message}
                        </FormHelperText>
                    )}
                </FormControl>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={(event) => setChecked(event.target.checked)}
                                name="checked"
                                color="primary"
                            />
                        }
                        label="Se souvenir de moi"
                    />
                    <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                        Mot de passe oublié?
                    </Typography>
                </Stack>
                {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                )}

                <Box sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={isSubmitting && <CircularProgress size={24} color="inherit" />}
                    >
                        {isSubmitting ? 'Loading...' : 'Se connecter'}
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default AuthLogin;
