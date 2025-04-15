import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { partnerValidationSchema } from '../../yup/validation-schema';
import { partnerInitialValues } from '../../yup/initial-values';
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { FormControl, Grid } from '@mui/material';
import AppInputField from '../AppInputField';
import { LoadingButton } from '@mui/lab';

const ProfileForm = ({ user }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isLoading }
    } = useForm({
        resolver: yupResolver(partnerValidationSchema),
        defaultValues: { ...partnerInitialValues, ...user }
    });

    const [edit, setEdit] = useState({
        disabled: false,
        isEdit: true,
        showPassword: false
    });

    const changeButton = async (data) => {
        try {
            await axiosInstance.put(`/partner/${user._id}`, data);
            toast.success('Les informations sont mises à jour');
        } catch (error) {
            const msg = error?.response?.data?.error;
            toast.error(msg);
            console.log({ error });
        }
    };

    const genderSelect = [
        { value: 1, label: 'Male' },
        { value: 0, label: 'Female' }
    ];

    return (
        <form onSubmit={handleSubmit(changeButton)}>
            <FormControl fullWidth>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <AppInputField
                            name="gender"
                            control={control}
                            label="Gender"
                            select
                            options={genderSelect}
                            disabled={edit.disabled}
                            error={errors.gender}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <AppInputField
                            name="phoneNumber"
                            control={control}
                            label="Numéro de téléphone"
                            disabled={edit.disabled}
                            error={errors.phoneNumber}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <AppInputField
                            name="companyName"
                            control={control}
                            label="Nom de l'entreprise"
                            disabled={edit.disabled}
                            error={errors.companyName}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <AppInputField name="address" control={control} label="Adresse" disabled={edit.disabled} error={errors.address} />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <AppInputField
                            name="industry"
                            control={control}
                            label="Industrie"
                            disabled={edit.disabled}
                            error={errors.industry}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <AppInputField
                            name="companySize"
                            control={control}
                            label="Taille de l'entreprise"
                            disabled={edit.disabled}
                            error={errors.companySize}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <AppInputField
                            name="objectives"
                            control={control}
                            label="Objectifs"
                            disabled={edit.disabled}
                            error={errors.objectives}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <AppInputField
                            name="partnershipType"
                            control={control}
                            label="Type de partenariat"
                            disabled={edit.disabled}
                            error={errors.partnershipType}
                        />
                    </Grid>

                    <Grid item xs={12} lg={12}>
                        <AppInputField
                            name="url"
                            control={control}
                            label="Lien du Website"
                            disabled={edit.disabled}
                            error={errors.partnershipType}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton type="submit" variant="contained" loading={isLoading} disabled={isLoading}>
                            Sauvegarder
                        </LoadingButton>
                    </Grid>
                </Grid>
            </FormControl>
        </form>
    );
};

export default ProfileForm;
