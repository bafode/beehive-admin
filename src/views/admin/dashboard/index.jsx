import { useEffect, useState } from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import { IconUsers, IconArticle, IconMessage, IconBell } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'api/axiosInstance';

// ============================|| DASHBOARD PAGE ||============================ //

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        posts: 0,
        messages: 0,
        notifications: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Fetch users count
                const usersResponse = await axiosInstance.get('/users');
                const postsResponse = await axiosInstance.get('/posts');
                const messagesResponse = await axiosInstance.get('/landing-contacts');

                setStats({
                    users: usersResponse.data.totalResults || 0,
                    posts: postsResponse.data.totalResults || 0,
                    messages: messagesResponse.data.totalResults || 0,
                    notifications: 0 // À implémenter si une API est disponible
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ icon, title, value, color }) => {
        const IconComponent = icon;

        return (
            <Card sx={{ bgcolor: color, color: 'white' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <IconComponent size={48} />
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h3">{value}</Typography>
                            <Typography variant="subtitle1">{title}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    return (
        <MainCard title="Tableau de Bord">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom>
                        Bienvenue dans le portail d'administration
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Gérez les utilisateurs, les posts, les messages et les notifications de votre application.
                    </Typography>
                </Grid>

                {loading ? (
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <Typography>Chargement des statistiques...</Typography>
                        </Box>
                    </Grid>
                ) : (
                    <>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard icon={IconUsers} title="Utilisateurs" value={stats.users} color="#1e88e5" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard icon={IconArticle} title="Posts" value={stats.posts} color="#43a047" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard icon={IconMessage} title="Messages" value={stats.messages} color="#fb8c00" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard icon={IconBell} title="Notifications" value={stats.notifications} color="#e53935" />
                        </Grid>
                    </>
                )}
            </Grid>
        </MainCard>
    );
};

export default Dashboard;
