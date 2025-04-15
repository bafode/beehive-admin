import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Grid,
    Typography,
    Button,
    Box,
    Avatar,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    CircularProgress,
    Chip,
    Paper,
    Tab,
    Tabs
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'api/axiosInstance';

// ============================|| USER PROFILE PAGE ||============================ //

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/users/${userId}`);
                setUser(response.data);

                // Fetch user posts
                const postsResponse = await axiosInstance.get(`/users/${userId}/posts`);
                setUserPosts(postsResponse.data.results || []);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (!user) {
        return (
            <MainCard>
                <Typography variant="h5" color="error">
                    Utilisateur non trouvé
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/users/lists')}>
                    Retour à la liste des utilisateurs
                </Button>
            </MainCard>
        );
    }

    return (
        <MainCard title="Profil Utilisateur">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Retour
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => navigate(`/users/${userId}`)}>
                            Éditer le profil
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                src={user.avatar}
                                alt={`${user.firstname} ${user.lastname}`}
                                sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                            />
                            <Typography variant="h3" gutterBottom>
                                {user.firstname} {user.lastname}
                            </Typography>
                            <Chip label={user.role} color={user.role === 'admin' ? 'error' : 'primary'} sx={{ mb: 2 }} />
                            <Typography variant="body1" paragraph>
                                {user.description || 'Aucune description disponible'}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Email: {user.email}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Ville: {user.city || 'Non renseigné'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    École: {user.school || 'Non renseigné'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Domaine d'étude: {user.fieldOfStudy || 'Non renseigné'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Niveau d'étude: {user.levelOfStudy || 'Non renseigné'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Membre depuis: {user.createdAt ? formatDate(user.createdAt) : 'Non disponible'}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Posts" />
                            <Tab label="Activité" />
                            <Tab label="Statistiques" />
                        </Tabs>

                        <Box sx={{ p: 2 }}>
                            {tabValue === 0 && (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Posts de l'utilisateur ({userPosts.length})
                                    </Typography>

                                    {userPosts.length > 0 ? (
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
                                                                    {post.content?.substring(0, 100)}...
                                                                </Typography>
                                                                <br />
                                                                <Typography component="span" variant="caption" color="textSecondary">
                                                                    {formatDate(post.createdAt)} - {post.category}
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography variant="body1">Cet utilisateur n'a pas encore publié de posts.</Typography>
                                    )}
                                </>
                            )}

                            {tabValue === 1 && (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Activité récente
                                    </Typography>
                                    <Typography variant="body1">Aucune activité récente à afficher.</Typography>
                                </>
                            )}

                            {tabValue === 2 && (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Statistiques de l'utilisateur
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        Posts
                                                    </Typography>
                                                    <Typography variant="h3">{userPosts.length}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        Commentaires
                                                    </Typography>
                                                    <Typography variant="h3">0</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        Likes reçus
                                                    </Typography>
                                                    <Typography variant="h3">
                                                        {userPosts.reduce((total, post) => total + (post.likesCount || 0), 0)}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default UserProfile;
