import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, FormControl, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AppInputField from '../AppInputField';
import axiosInstance from 'api/axiosInstance';
import { toast } from 'react-toastify';
import AppImageUpload from './AppUploadImage';
import Typography from '@mui/material/Typography';
import TextEditor from '../editor/TextEditor';
import { partnerOfferValidationSchema } from '../form-yup-validation';
import { useDispatch, useSelector } from 'react-redux';
import { addPartnerOffer, clearSelectedPartnerOffer } from 'store/partnerOfferSlice';
import { mutate } from 'swr';

const PartnerOfferForm = ({ user }) => {
    const { selectedOffer } = useSelector((state) => state.partnerOffer);

    const dispatche = useDispatch();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(partnerOfferValidationSchema),
        defaultValues: {
            title: '',
            description: '',
            image: null,
            terms: '',
            category: '',
            status: ''
        }
    });

    useEffect(() => {
        if (selectedOffer) {
            reset({ ...selectedOffer, image: selectedOffer?.imageUrl });
        }
    }, [selectedOffer, reset]);

    const submitForm = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('terms', data.terms);
        formData.append('category', data.category);
        formData.append('status', data.status);
        formData.append('image', data.image);
        formData.append('partner', user?._id);

        try {
            if (selectedOffer?._id) {
                await axiosInstance.put(`/partner-offers/${selectedOffer?._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success("L'offre a été mise à jour");
            } else {
                await axiosInstance.post(`/partner-offers`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success("L'offre a été créé avec succès");
            }
            mutate(`/partner-offers/${user?._id}`);
            dispatche(clearSelectedPartnerOffer());
            reset();
        } catch (error) {
            const msg = error?.response?.data?.error;
            toast.error(msg);
            console.log({ error });
        }
    };

    const categoryOptions = [
        { value: 'Mode', label: 'Mode' },
        { value: 'Technologie', label: 'Technologie' },
        { value: 'Alimentation', label: 'Alimentation' },
        { value: 'Sport', label: 'Sport' },
        { value: 'Beauté', label: 'Beauté' },
        { value: 'Santé', label: 'Santé' },
        { value: 'Voyages', label: 'Voyages' },
        { value: 'Automobile', label: 'Automobile' },
        { value: 'Maison', label: 'Maison' },
        { value: 'Services', label: 'Services' },
        { value: 'Événements', label: 'Événements' }
    ];

    const statusOptions = [
        { value: 'Active', label: 'Active' },
        { value: 'Expired', label: 'Expiré' },
        { value: 'Upcoming', label: 'À venir' }
    ];

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <FormControl fullWidth>
                <Grid container direction="row" spacing={2}>
                    <Grid item lg={7}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <AppInputField
                                    name="category"
                                    control={control}
                                    label="Catégorie"
                                    select
                                    options={categoryOptions}
                                    error={errors.category}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <AppInputField name="title" control={control} label="Titre" error={errors.title} />
                            </Grid>
                            <Grid item xs={12}>
                                <AppInputField name="terms" control={control} label="Conditions" error={errors.terms} />
                            </Grid>

                            <Grid item xs={12}>
                                <TextEditor name="description" control={control} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={5}>
                        <Grid container spacing={2} flex>
                            <Grid item xs={12}>
                                <AppInputField
                                    name="status"
                                    control={control}
                                    label="Statut"
                                    select
                                    options={statusOptions}
                                    error={errors.status}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <AppImageUpload name="image" height="25rem" control={control} />
                                {errors.image && <Typography color="error">{errors.image.message}</Typography>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={() => {
                                dispatche(clearSelectedPartnerOffer());
                                reset();
                            }}
                        >
                            Reset
                        </Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={isSubmitting}>
                            Sauvegarder
                        </LoadingButton>
                    </Grid>
                </Grid>
            </FormControl>
        </form>
    );
};

export default PartnerOfferForm;
