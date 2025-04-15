import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    CardMedia,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'api/axiosInstance';
import { EPostCategory, EPostDomain } from 'types/enums';

// ============================|| POST DETAILS PAGE ||============================ //

const PostDetails = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({});
    const [author, setAuthor] = useState(null);
    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [alertMessage, setAlertMessage] = useState(null);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [domainTags, setDomainTags] = useState([]);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/posts/${postId}`);
                setPost(response.data);
                setEditedPost(response.data);
                setSelectedDomains(response.data.domain || []);

                // Fetch author details if available
                if (response.data.author) {
                    const authorResponse = await axiosInstance.get(`/users/${response.data.author.id}`);
                    setAuthor(authorResponse.data);
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
                setAlertMessage({
                    type: 'error',
                    message: 'Erreur lors du chargement du post. Veuillez réessayer.'
                });
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPostData();
        }

        // Préparer les domaines disponibles
        setDomainTags(Object.values(EPostDomain));
    }, [postId]);

    const handleEditToggle = () => {
        setEditing(!editing);
        if (!editing) {
            setEditedPost(post);
            setSelectedDomains(post.domain || []);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPost({
            ...editedPost,
            [name]: value
        });
    };

    const handleDomainToggle = (domain) => {
        setSelectedDomains((prev) => {
            if (prev.includes(domain)) {
                return prev.filter((d) => d !== domain);
            } else {
                return [...prev, domain];
            }
        });
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // Préparer les données à envoyer
            const postData = {
                ...editedPost,
                domain: selectedDomains
            };

            await axiosInstance.patch(`/posts/${postId}`, postData);
            const updatedPost = await axiosInstance.get(`/posts/${postId}`);
            setPost(updatedPost.data);
            setEditing(false);

            setAlertMessage({
                type: 'success',
                message: 'Post mis à jour avec succès!'
            });

            // Effacer le message après 3 secondes
            setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
        } catch (error) {
            console.error('Error updating post:', error);
            setAlertMessage({
                type: 'error',
                message: 'Erreur lors de la mise à jour du post. Veuillez réessayer.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.')) {
            try {
                setLoading(true);
                await axiosInstance.delete(`/posts/${postId}`);
                navigate('/posts/lists');
            } catch (error) {
                console.error('Error deleting post:', error);
                setAlertMessage({
                    type: 'error',
                    message: 'Erreur lors de la suppression du post. Veuillez réessayer.'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleOpenMediaDialog = (index) => {
        setCurrentMediaIndex(index);
        setMediaDialogOpen(true);
    };

    const handleCloseMediaDialog = () => {
        setMediaDialogOpen(false);
    };

    const handleNextMedia = () => {
        if (post.media && post.media.length > 0) {
            setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % post.media.length);
        }
    };

    const handlePreviousMedia = () => {
        if (post.media && post.media.length > 0) {
            setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + post.media.length) % post.media.length);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && !post) {
        return (
            <MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    return (
        <MainCard title="Détails du Post">
            {alertMessage && (
                <Alert severity={alertMessage.type} sx={{ mb: 2 }} onClose={() => setAlertMessage(null)}>
                    {alertMessage.message}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <Button variant="outlined" onClick={() => navigate('/posts/lists')}>
                            Retour
                        </Button>
                        <Button
                            variant={editing ? 'outlined' : 'contained'}
                            color={editing ? 'error' : 'primary'}
                            onClick={handleEditToggle}
                        >
                            {editing ? 'Annuler' : 'Modifier'}
                        </Button>
                        {editing && (
                            <Button variant="contained" color="success" onClick={handleSave}>
                                Enregistrer
                            </Button>
                        )}
                        <Button variant="outlined" color="error" onClick={handleDelete} sx={{ ml: 'auto' }}>
                            Supprimer
                        </Button>
                    </Box>
                </Grid>

                {editing ? (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Titre"
                                            name="title"
                                            value={editedPost.title || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Contenu"
                                            name="content"
                                            multiline
                                            rows={6}
                                            value={editedPost.content || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Catégorie</InputLabel>
                                            <Select
                                                name="category"
                                                value={editedPost.category || EPostCategory.ALL}
                                                label="Catégorie"
                                                onChange={handleInputChange}
                                            >
                                                <MenuItem value={EPostCategory.ALL}>Toutes</MenuItem>
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
                                                    color={selectedDomains.includes(domain) ? 'primary' : 'default'}
                                                    onClick={() => handleDomainToggle(domain)}
                                                    clickable
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (
                    <>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h3" gutterBottom>
                                        {post.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        <Chip
                                            label={post.category}
                                            color={post.category === EPostCategory.INSPIRATION ? 'primary' : 'secondary'}
                                        />
                                        <Chip label={`${post.likesCount || 0} likes`} variant="outlined" />
                                        <Chip label={`${post.comments?.length || 0} commentaires`} variant="outlined" />
                                        <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
                                            Publié le {formatDate(post.createdAt)}
                                        </Typography>
                                    </Box>

                                    {post.domain && post.domain.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Domaines:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {post.domain.map((domain, index) => (
                                                    <Chip key={index} label={domain} size="small" variant="outlined" />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                                        {post.content}
                                    </Typography>

                                    {post.media && post.media.length > 0 && (
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Médias attachés
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {post.media.map((mediaUrl, index) => (
                                                    <Grid item xs={6} sm={3} key={index}>
                                                        <Card
                                                            sx={{
                                                                cursor: 'pointer',
                                                                transition: 'transform 0.2s',
                                                                '&:hover': { transform: 'scale(1.05)' }
                                                            }}
                                                            onClick={() => handleOpenMediaDialog(index)}
                                                        >
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={mediaUrl}
                                                                alt={`Media ${index + 1}`}
                                                            />
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Auteur
                                    </Typography>
                                    {author ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar
                                                src={author.avatar}
                                                alt={`${author.firstname} ${author.lastname}`}
                                                sx={{ width: 60, height: 60, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography variant="h6">
                                                    {author.firstname} {author.lastname}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {author.email}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => navigate(`/users/profile/${author.id}`)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Voir le profil
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2">Informations sur l'auteur non disponibles</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                )}

                {!editing && post.comments && post.comments.length > 0 && (
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Commentaires ({post.comments.length})
                        </Typography>

                        <List>
                            {post.comments.map((comment, index) => (
                                <ListItem
                                    key={index}
                                    alignItems="flex-start"
                                    sx={{
                                        mb: 1,
                                        border: '1px solid #eee',
                                        borderRadius: 1
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={comment.userAvatar} alt={comment.userFirstName} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${comment.userFirstName} ${comment.userLastName}`}
                                        secondary={
                                            <Typography component="span" variant="body2" color="textPrimary">
                                                {comment.content}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                )}
            </Grid>

            {/* Media Viewer Dialog */}
            <Dialog open={mediaDialogOpen} onClose={handleCloseMediaDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    Média {currentMediaIndex + 1} / {post?.media?.length || 0}
                </DialogTitle>
                <DialogContent>
                    {post?.media && post.media.length > 0 && (
                        <Box sx={{ position: 'relative', textAlign: 'center' }}>
                            <img
                                src={post.media[currentMediaIndex]}
                                alt={`Media ${currentMediaIndex + 1}`}
                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                            />
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button variant="outlined" onClick={handlePreviousMedia} disabled={post.media.length <= 1}>
                                    Précédent
                                </Button>
                                <Button variant="outlined" onClick={handleNextMedia} disabled={post.media.length <= 1}>
                                    Suivant
                                </Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMediaDialog}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default PostDetails;
