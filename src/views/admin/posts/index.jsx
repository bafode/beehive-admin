import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    Checkbox,
    Toolbar,
    IconButton,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
    CircularProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { IconTrash, IconSearch, IconPlus, IconFilter } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'api/axiosInstance';
import { EPostCategory } from 'types/enums';

// ============================|| POSTS ADMIN PAGE ||============================ //

const Posts = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                sortBy: orderBy,
                orderBy: order
            };

            if (filterCategory && filterCategory !== 'all') {
                params.category = filterCategory;
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await axiosInstance.get('/posts', { params });
            setPosts(response.data.results || []);
            setTotalCount(response.data.totalResults || 0);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page, rowsPerPage, orderBy, order, filterCategory, searchTerm]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = posts.map((post) => post.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else if (selectedIndex === 0) {
            newSelected = selected.slice(1);
        } else if (selectedIndex === selected.length - 1) {
            newSelected = selected.slice(0, -1);
        } else if (selectedIndex > 0) {
            newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteSelected = async () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selected.length} post(s) ?`)) {
            try {
                await Promise.all(selected.map((id) => axiosInstance.delete(`/posts/${id}`)));
                fetchPosts();
                setSelected([]);
            } catch (error) {
                console.error('Error deleting posts:', error);
            }
        }
    };

    const handleCategoryFilterChange = (event) => {
        setFilterCategory(event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const headCells = [
        { id: 'title', numeric: false, disablePadding: true, label: 'Titre' },
        { id: 'author', numeric: false, disablePadding: false, label: 'Auteur' },
        { id: 'category', numeric: false, disablePadding: false, label: 'Catégorie' },
        { id: 'likesCount', numeric: true, disablePadding: false, label: 'Likes' },
        { id: 'commentsCount', numeric: true, disablePadding: false, label: 'Commentaires' },
        { id: 'createdAt', numeric: false, disablePadding: false, label: 'Date de création' }
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <MainCard title="Gestion des Posts">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Catégorie</InputLabel>
                                <Select value={filterCategory} label="Catégorie" onChange={handleCategoryFilterChange}>
                                    <MenuItem value="all">Toutes les catégories</MenuItem>
                                    <MenuItem value={EPostCategory.INSPIRATION}>Inspiration</MenuItem>
                                    <MenuItem value={EPostCategory.COMMUNAUTE}>Communauté</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Rechercher"
                                variant="outlined"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                InputProps={{
                                    endAdornment: <IconSearch size={20} />
                                }}
                            />
                        </Box>

                        <Button variant="contained" color="primary" startIcon={<IconPlus />} onClick={() => navigate('/posts/create')}>
                            Nouveau Post
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <Toolbar
                            sx={{
                                pl: { sm: 2 },
                                pr: { xs: 1, sm: 1 },
                                ...(selected.length > 0 && {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                                })
                            }}
                        >
                            {selected.length > 0 ? (
                                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                                    {selected.length} sélectionné(s)
                                </Typography>
                            ) : (
                                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                                    Liste des Posts
                                </Typography>
                            )}

                            {selected.length > 0 && (
                                <Tooltip title="Supprimer">
                                    <IconButton onClick={handleDeleteSelected}>
                                        <IconTrash />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Toolbar>

                        <TableContainer>
                            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                indeterminate={selected.length > 0 && selected.length < posts.length}
                                                checked={posts.length > 0 && selected.length === posts.length}
                                                onChange={handleSelectAllClick}
                                                inputProps={{ 'aria-label': 'select all posts' }}
                                            />
                                        </TableCell>
                                        {headCells.map((headCell) => (
                                            <TableCell
                                                key={headCell.id}
                                                align={headCell.numeric ? 'right' : 'left'}
                                                padding={headCell.disablePadding ? 'none' : 'normal'}
                                                sortDirection={orderBy === headCell.id ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={orderBy === headCell.id}
                                                    direction={orderBy === headCell.id ? order : 'asc'}
                                                    onClick={() => handleRequestSort(headCell.id)}
                                                >
                                                    {headCell.label}
                                                    {orderBy === headCell.id ? (
                                                        <Box component="span" sx={visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </Box>
                                                    ) : null}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : posts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Aucun post trouvé
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        posts.map((post, index) => {
                                            const isItemSelected = isSelected(post.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={post.id}
                                                    selected={isItemSelected}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            onClick={(event) => handleClick(event, post.id)}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        onClick={() => navigate(`/posts/${post.id}`)}
                                                    >
                                                        {truncateText(post.title)}
                                                    </TableCell>
                                                    <TableCell onClick={() => navigate(`/posts/${post.id}`)}>
                                                        {post.author?.firstname} {post.author?.lastname}
                                                    </TableCell>
                                                    <TableCell onClick={() => navigate(`/posts/${post.id}`)}>
                                                        <Chip
                                                            label={post.category}
                                                            color={post.category === EPostCategory.INSPIRATION ? 'primary' : 'secondary'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" onClick={() => navigate(`/posts/${post.id}`)}>
                                                        {post.likesCount || 0}
                                                    </TableCell>
                                                    <TableCell align="right" onClick={() => navigate(`/posts/${post.id}`)}>
                                                        {post.comments?.length || 0}
                                                    </TableCell>
                                                    <TableCell onClick={() => navigate(`/posts/${post.id}`)}>
                                                        {formatDate(post.createdAt)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Posts;
