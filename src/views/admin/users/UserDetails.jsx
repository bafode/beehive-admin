import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Grid,
    Typography,
    Button,
    TextField,
    Box,
    Avatar,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Alert,
    Snackbar,
    Tab,
    Tabs,
    Paper,
    IconButton,
    Tooltip
} from '@mui/material';
import { IconArrowLeft } from '@tabler/icons-react';
import { IconEdit } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { IconEye } from '@tabler/icons-react';
import { IconUpload } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'api/axiosInstance';
import { EUserRole } from 'types/enums';

// ============================|| USER DETAILS PAGE ||============================ //

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/users/${userId}`);
                setUser(response.data);
                setEditedUser(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserPosts = async () => {
            try {
                setLoadingPosts(true);
                const response = await axiosInstance.get(`/users/${userId}/posts`);
                setUserPosts(response.data.results || []);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            } finally {
                setLoadingPosts(false);
            }
        };

        if (userId) {
            fetchUserData();
            fetchUserPosts();
        }
    }, [userId]);

    const handleEditToggle = () => {
        setEditing(!editing);
        if (!editing) {
            setEditedUser(user);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({
            ...editedUser,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await axiosInstance.patch(`/users/${userId}`, editedUser);
            const updatedUser = await axiosInstance.get(`/users/${userId}`);
            setUser(updatedUser.data);
            setEditing(false);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
            try {
                await axiosInstance.delete(`/users/${userId}`);
                navigate('/users/lists');
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    if (loading && !user) {
        return (
            <MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    return (
        <MainCard title="Détails de l'utilisateur">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={() => navigate('/users/lists')}>
                            Retour
                        </Button>
                        <Button
                            variant="outlined"
                            color="info"
                            startIcon={<IconEye />}
                            onClick={() => navigate(`/users/profile/${userId}`)}
                        >
                            Voir le profil
                        </Button>
                        <Button
                            variant={editing ? 'outlined' : 'contained'}
                            color={editing ? 'error' : 'primary'}
                            startIcon={editing ? <IconX /> : <IconEdit />}
                            onClick={handleEditToggle}
                        >
                            {editing ? 'Annuler' : 'Modifier'}
                        </Button>
                        {editing && (
                            <Button variant="contained" color="success" onClick={handleSave}>
                                Enregistrer
                            </Button>
                        )}
                        <Button variant="outlined" color="error" startIcon={<IconTrash />} onClick={handleDelete} sx={{ ml: 'auto' }}>
                            Supprimer
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            {editing ? (
                                <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mb: 2 }}>
                                    <Avatar
                                        src={editedUser.avatar}
                                        alt={`${editedUser.firstname} ${editedUser.lastname}`}
                                        sx={{ width: '100%', height: '100%' }}
                                    />
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: 'background.paper',
                                            '&:hover': { bgcolor: 'primary.light' }
                                        }}
                                        color="primary"
                                        aria-label="upload avatar"
                                        component="label"
                                    >
                                        <input
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            onChange={(e) => {
                                                // Ici, vous pourriez implémenter le téléchargement de l'avatar
                                                // Pour l'instant, nous simulons juste un changement
                                                if (e.target.files && e.target.files[0]) {
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        setEditedUser({
                                                            ...editedUser,
                                                            avatar: event.target.result
                                                        });
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                }
                                            }}
                                        />
                                        <IconUpload size={18} />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Avatar
                                    src={user.avatar}
                                    alt={`${user.firstname} ${user.lastname}`}
                                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                                />
                            )}
                            <Typography variant="h4" gutterBottom>
                                {user.firstname} {user.lastname}
                            </Typography>
                            <Chip label={user.role} color={user.role === 'admin' ? 'error' : 'primary'} sx={{ mb: 2 }} />
                            <Typography variant="body2" color="textSecondary">
                                Email: {user.email}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Email vérifié: {user.isEmailVerified ? 'Oui' : 'Non'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Compte actif: {user.accountClosed ? 'Non' : 'Oui'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    {editing ? (
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Prénom"
                                            name="firstname"
                                            value={editedUser.firstname || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nom"
                                            name="lastname"
                                            value={editedUser.lastname || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={editedUser.email || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Ville"
                                            name="city"
                                            value={editedUser.city || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="École"
                                            name="school"
                                            value={editedUser.school || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Domaine d'étude"
                                            name="fieldOfStudy"
                                            value={editedUser.fieldOfStudy || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Niveau d'étude"
                                            name="levelOfStudy"
                                            value={editedUser.levelOfStudy || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Rôle</InputLabel>
                                            <Select name="role" value={editedUser.role || 'user'} label="Rôle" onChange={handleInputChange}>
                                                <MenuItem value="user">Utilisateur</MenuItem>
                                                <MenuItem value="admin">Administrateur</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Email vérifié</InputLabel>
                                            <Select
                                                name="isEmailVerified"
                                                value={editedUser.isEmailVerified || false}
                                                label="Email vérifié"
                                                onChange={handleInputChange}
                                            >
                                                <MenuItem value={true}>Oui</MenuItem>
                                                <MenuItem value={false}>Non</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Compte actif</InputLabel>
                                            <Select
                                                name="accountClosed"
                                                value={editedUser.accountClosed || false}
                                                label="Compte actif"
                                                onChange={handleInputChange}
                                            >
                                                <MenuItem value={false}>Actif</MenuItem>
                                                <MenuItem value={true}>Fermé</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            multiline
                                            rows={3}
                                            value={editedUser.description || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Informations personnelles
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1">Prénom</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.firstname || 'Non renseigné'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1">Nom</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.lastname || 'Non renseigné'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1">Ville</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.city || 'Non renseigné'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1">École</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.school || 'Non renseigné'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1">Domaine d'étude</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.fieldOfStudy || 'Non renseigné'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1">Niveau d'étude</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.levelOfStudy || 'Non renseigné'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">Description</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.description || 'Non renseigné'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Posts de l'utilisateur
                    </Typography>

                    {loadingPosts ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : userPosts.length > 0 ? (
                        <List>
                            {userPosts.map((post) => (
                                <ListItem
                                    key={post.id}
                                    button
                                    onClick={() => navigate(`/posts/${post.id}`)}
                                    sx={{ mb: 1, border: '1px solid #eee', borderRadius: 1 }}
                                >
                                    <ListItemText
                                        primary={post.title}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    {post.content.substring(0, 100)}...
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="caption" color="textSecondary">
                                                    {new Date(post.createdAt).toLocaleDateString()} - {post.category}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1">Aucun post trouvé pour cet utilisateur.</Typography>
                    )}
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default UserDetails;
