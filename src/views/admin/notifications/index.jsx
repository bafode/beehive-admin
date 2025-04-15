import { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Box,
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
    CircularProgress,
    Avatar,
    Button
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { IconTrash, IconSearch, IconFilter, IconBell } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'api/axiosInstance';
import { ENotificationStatus, ENotificationType } from 'types/enums';

// ============================|| NOTIFICATIONS ADMIN PAGE ||============================ //

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // Note: This is a placeholder. You'll need to implement the actual API endpoint
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                sortBy: orderBy,
                orderBy: order
            };

            if (filterType && filterType !== 'all') {
                params.type = filterType;
            }

            if (filterStatus && filterStatus !== 'all') {
                params.status = filterStatus;
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            // This is a placeholder. Replace with actual API call when available
            const response = await axiosInstance.get('/notifications', { params });
            setNotifications(response.data.results || []);
            setTotalCount(response.data.totalResults || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // For demo purposes, create mock data if API is not available
            const mockNotifications = Array.from({ length: 20 }, (_, index) => ({
                id: `notif-${index}`,
                type: Object.values(ENotificationType)[Math.floor(Math.random() * Object.values(ENotificationType).length)],
                status: Object.values(ENotificationStatus)[Math.floor(Math.random() * Object.values(ENotificationStatus).length)],
                sender: {
                    id: `user-${index}`,
                    firstname: `Prénom${index}`,
                    lastname: `Nom${index}`,
                    avatar: `https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${index % 10}.jpg`
                },
                recipient: {
                    id: `user-${index + 10}`,
                    firstname: `Prénom${index + 10}`,
                    lastname: `Nom${index + 10}`
                },
                message: `Ceci est un exemple de notification ${index + 1}`,
                createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
            }));

            setNotifications(mockNotifications);
            setTotalCount(mockNotifications.length);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [page, rowsPerPage, orderBy, order, filterType, filterStatus, searchTerm]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = notifications.map((n) => n.id);
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
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selected.length} notification(s) ?`)) {
            try {
                // Replace with actual API call when available
                await Promise.all(selected.map((id) => axiosInstance.delete(`/notifications/${id}`)));
                fetchNotifications();
                setSelected([]);
            } catch (error) {
                console.error('Error deleting notifications:', error);
                // For demo purposes, just remove from local state
                setNotifications(notifications.filter((n) => !selected.includes(n.id)));
                setSelected([]);
            }
        }
    };

    const handleTypeFilterChange = (event) => {
        setFilterType(event.target.value);
        setPage(0);
    };

    const handleStatusFilterChange = (event) => {
        setFilterStatus(event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const headCells = [
        { id: 'type', numeric: false, disablePadding: true, label: 'Type' },
        { id: 'sender', numeric: false, disablePadding: false, label: 'Expéditeur' },
        { id: 'recipient', numeric: false, disablePadding: false, label: 'Destinataire' },
        { id: 'message', numeric: false, disablePadding: false, label: 'Message' },
        { id: 'status', numeric: false, disablePadding: false, label: 'Statut' },
        { id: 'createdAt', numeric: false, disablePadding: false, label: 'Date' }
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

    const getNotificationTypeLabel = (type) => {
        switch (type) {
            case ENotificationType.LIKE:
                return 'Like';
            case ENotificationType.COMMENT:
                return 'Commentaire';
            case ENotificationType.FOLLOW:
                return 'Abonnement';
            case ENotificationType.MENTION:
                return 'Mention';
            case ENotificationType.NEW_POST:
                return 'Nouveau post';
            case ENotificationType.SYSTEM:
                return 'Système';
            default:
                return type;
        }
    };

    const getNotificationStatusColor = (status) => {
        switch (status) {
            case ENotificationStatus.UNREAD:
                return 'error';
            case ENotificationStatus.READ:
                return 'success';
            case ENotificationStatus.ARCHIVED:
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <MainCard title="Gestion des Notifications">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Type</InputLabel>
                                <Select value={filterType} label="Type" onChange={handleTypeFilterChange}>
                                    <MenuItem value="all">Tous les types</MenuItem>
                                    <MenuItem value={ENotificationType.LIKE}>Like</MenuItem>
                                    <MenuItem value={ENotificationType.COMMENT}>Commentaire</MenuItem>
                                    <MenuItem value={ENotificationType.FOLLOW}>Abonnement</MenuItem>
                                    <MenuItem value={ENotificationType.MENTION}>Mention</MenuItem>
                                    <MenuItem value={ENotificationType.NEW_POST}>Nouveau post</MenuItem>
                                    <MenuItem value={ENotificationType.SYSTEM}>Système</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Statut</InputLabel>
                                <Select value={filterStatus} label="Statut" onChange={handleStatusFilterChange}>
                                    <MenuItem value="all">Tous les statuts</MenuItem>
                                    <MenuItem value={ENotificationStatus.UNREAD}>Non lu</MenuItem>
                                    <MenuItem value={ENotificationStatus.READ}>Lu</MenuItem>
                                    <MenuItem value={ENotificationStatus.ARCHIVED}>Archivé</MenuItem>
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

                        <Button variant="contained" color="primary" startIcon={<IconBell />} onClick={() => fetchNotifications()}>
                            Rafraîchir
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
                                    Liste des Notifications
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
                                                indeterminate={selected.length > 0 && selected.length < notifications.length}
                                                checked={notifications.length > 0 && selected.length === notifications.length}
                                                onChange={handleSelectAllClick}
                                                inputProps={{ 'aria-label': 'select all notifications' }}
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
                                    ) : notifications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Aucune notification trouvée
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        notifications.map((notification, index) => {
                                            const isItemSelected = isSelected(notification.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={notification.id}
                                                    selected={isItemSelected}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            onClick={(event) => handleClick(event, notification.id)}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                                        <Chip
                                                            label={getNotificationTypeLabel(notification.type)}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar
                                                                src={notification.sender?.avatar}
                                                                alt={notification.sender?.firstname}
                                                                sx={{ width: 30, height: 30, mr: 1 }}
                                                            />
                                                            <Typography variant="body2">
                                                                {notification.sender?.firstname} {notification.sender?.lastname}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {notification.recipient?.firstname} {notification.recipient?.lastname}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{truncateText(notification.message)}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={notification.status}
                                                            color={getNotificationStatusColor(notification.status)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{formatDate(notification.createdAt)}</TableCell>
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

export default Notifications;
