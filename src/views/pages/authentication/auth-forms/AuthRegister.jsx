import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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

// project imports
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import axiosInstance from 'api/axiosInstance';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';

const AuthRegister = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().max(255).required('First Name is required'),
        lastName: Yup.string().max(255).required('Last Name is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: ''
        }
    });

    useEffect(() => {
        const init = async () => {
            try {
                const response = await axiosInstance.post('/auth/verify-token', { token });
                const email = response?.data?.data?.email;
                reset({ email });
                console.log({ response });
            } catch (error) {
                console.log({ error });
            }
        };
        init();
    }, [token]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    const onSubmit = async (data) => {
        try {
            await axiosInstance.post('/auth/register-partner', { ...data, token });
            navigate('/auth/login');
            toast.success("l'inscription avec succès");
        } catch (error) {
            toast.error('Error credential');
            console.log({ error });
        }
    };

    return (
        <>
            <form noValidate onSubmit={handleSubmit(onSubmit)} {...others}>
                <Grid container spacing={matchDownSM ? 0 : 2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={Boolean(errors?.firstName)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-firstName-register">First Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-firstName-register"
                                type="text"
                                {...register('firstName')}
                                label="First Name"
                                inputProps={{}}
                            />
                            {errors?.firstName && (
                                <FormHelperText error id="standard-weight-helper-text-firstName-register">
                                    {errors?.firstName?.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={Boolean(errors?.lastName)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-lastName-register">Last Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-lastName-register"
                                type="text"
                                {...register('lastName')}
                                label="Last Name"
                                inputProps={{}}
                            />
                            {errors?.lastName && (
                                <FormHelperText error id="standard-weight-helper-text-lastName-register">
                                    {errors?.lastName?.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
                <FormControl fullWidth error={Boolean(errors.email)} sx={{ ...theme.typography.customInput }}>
                    <OutlinedInput disabled id="outlined-adornment-email-register" type="email" {...register('email')} inputProps={{}} />
                    {errors.email && (
                        <FormHelperText error id="standard-weight-helper-text--register">
                            {errors.email.message}
                        </FormHelperText>
                    )}
                </FormControl>

                <FormControl fullWidth error={Boolean(errors.password)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-register"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        label="Password"
                        onChange={(e) => {
                            changePassword(e.target.value);
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    size="large"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        inputProps={{}}
                    />
                    {errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-register">
                            {errors.password.message}
                        </FormHelperText>
                    )}
                </FormControl>

                {strength !== 0 && (
                    <FormControl fullWidth>
                        <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1" fontSize="0.75rem">
                                        {level?.label}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </FormControl>
                )}

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(event) => setChecked(event.target.checked)}
                                    name="checked"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="subtitle1">
                                    Acceptez &nbsp;
                                    <Typography variant="subtitle1" component={Link} to="#">
                                        les termes et conditions.
                                    </Typography>
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid>
                {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{errors.submit.message}</FormHelperText>
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
                        {isSubmitting ? 'Loading...' : "S'inscrire"}
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default AuthRegister;
