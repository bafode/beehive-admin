import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Typography,
    Button,
    TextField,
    Box,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Card,
    CardContent,
    Chip,
    Alert,
    IconButton,
    Input
} from '@mui/material';
import { IconArrowLeft, IconUpload, IconX } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'api/axiosInstance';
import { EPostCategory, EPostDomain } from 'types/enums';

// ============================|| CREATE POST PAGE ||============================ //

const CreatePost = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [post, setPost] = useState({
        title: '',
        content: '',
        category: EPostCategory.INSPIRATION,
        domain: []
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [domainTags, setDomainTags] = useState([]);

    useEffect(() => {
        // Préparer les domaines disponibles
        setDomainTags(Object.values(EPostDomain));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost({
            ...post,
            [name]: value
        });
    };

    const handleDomainToggle = (domain) => {
        setPost((prev) => {
            const currentDomains = [...prev.domain];
            if (currentDomains.includes(domain)) {
                return {
                    ...prev,
                    domain: currentDomains.filter((d) => d !== domain)
                };
            } else {
                return {
                    ...prev,
                    domain: [...currentDomains, domain]
                };
            }
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray]);

            // Créer des URLs de prévisualisation pour les images
            const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        }
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

        // Libérer l'URL de prévisualisation
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!post.title || !post.content) {
            setAlertMessage({
                type: 'error',
                message: 'Veuillez remplir tous les champs obligatoires (titre et contenu).'
            });
            return;
        }

        try {
            setLoading(true);

            // Créer le post
            const formData = new FormData();
            formData.append('title', post.title);
            formData.append('content', post.content);
            formData.append('category', post.category);

            // Ajouter les domaines
            post.domain.forEach((domain) => {
                formData.append('domain', domain);
            });

            // Ajouter les fichiers
            selectedFiles.forEach((file) => {
                formData.append('media', file);
            });

            const response = await axiosInstance.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAlertMessage({
                type: 'success',
                message: 'Post créé avec succès!'
            });

            // Rediriger vers la page de détails du post après 2 secondes
            setTimeout(() => {
                navigate(`/posts/${response.data.id}`);
            }, 2000);
        } catch (error) {
            console.error('Error creating post:', error);
            setAlertMessage({
                type: 'error',
                message: 'Erreur lors de la création du post. Veuillez réessayer.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainCard title="Créer un nouveau post">
            {alertMessage && (
                <Alert severity={alertMessage.type} sx={{ mb: 2 }} onClose={() => setAlertMessage(null)}>
                    {alertMessage.message}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={() => navigate('/posts/lists')}>
                            Retour
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Titre"
                                        name="title"
                                        value={post.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contenu"
                                        name="content"
                                        multiline
                                        rows={6}
                                        value={post.content}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Catégorie</InputLabel>
                                        <Select name="category" value={post.category} label="Catégorie" onChange={handleInputChange}>
                                            <MenuItem value={EPostCategory.INSPIRATION}>Inspiration</MenuItem>
                                            <MenuItem value={EPostCategory.COMMUNAUTE}>Communauté</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Domaines
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {domainTags.map((domain) => (
                                            <Chip
                                                key={domain}
                                                label={domain}
                                                color={post.domain.includes(domain) ? 'primary' : 'default'}
                                                onClick={() => handleDomainToggle(domain)}
                                                clickable
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" gutterBottom>
                                        Médias
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Button variant="outlined" component="label" startIcon={<IconUpload />}>
                                            Ajouter des médias
                                            <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
                                        </Button>
                                    </Box>

                                    {previewUrls.length > 0 && (
                                        <Grid container spacing={2}>
                                            {previewUrls.map((url, index) => (
                                                <Grid item xs={6} sm={3} key={index}>
                                                    <Box sx={{ position: 'relative' }}>
                                                        <img
                                                            src={url}
                                                            alt={`Preview ${index}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '140px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px'
                                                            }}
                                                        />
                                                        <IconButton
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 5,
                                                                right: 5,
                                                                bgcolor: 'rgba(255, 255, 255, 0.7)',
                                                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                                                            }}
                                                            size="small"
                                                            onClick={() => handleRemoveFile(index)}
                                                        >
                                                            <IconX size={16} />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Publier le post'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default CreatePost;
