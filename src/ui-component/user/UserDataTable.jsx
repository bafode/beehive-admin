import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    Checkbox,
    IconButton,
    Tooltip,
    Button,
    Avatar,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconTrash, IconSearch, IconPlus, IconFilter, IconEye, IconEdit } from '@tabler/icons-react';
import axiosInstance from 'api/axiosInstance';
import { EUserRole } from 'types/enums';

function createData(id, firstname, lastname, email, city, school, role, isEmailVerified, avatar, accountClosed) {
    return {
        id,
        firstname,
        lastname,
        email,
        city,
        school,
        role,
        isEmailVerified,
        avatar,
        accountClosed
    };
}

const headCells = [
    { id: 'avatar', numeric: false, disablePadding: true, label: 'Avatar' },
    { id: 'firstname', numeric: false, disablePadding: false, label: 'Prénom' },
    { id: 'lastname', numeric: false, disablePadding: false, label: 'Nom' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'city', numeric: false, disablePadding: false, label: 'Ville' },
    { id: 'school', numeric: false, disablePadding: false, label: 'École' },
    { id: 'role', numeric: false, disablePadding: false, label: 'Rôle' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Statut' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function UserDataTable() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('firstname');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filterRole, setFilterRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                sortBy: orderBy,
                orderBy: order
            };

            if (filterRole && filterRole !== 'all') {
                params.role = filterRole;
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await axiosInstance.get('/users', { params });
            console.log('Users data:', response.data);
            setUsers(response.data.results || []);
            setTotalCount(response.data.totalResults || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, orderBy, order, filterRole, searchTerm]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = users.map((user) => user.id);
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
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selected.length} utilisateur(s) ?`)) {
            try {
                await Promise.all(selected.map((id) => axiosInstance.delete(`/users/${id}`)));
                fetchUsers();
                setSelected([]);
            } catch (error) {
                console.error('Error deleting users:', error);
            }
        }
    };

    const handleRoleFilterChange = (event) => {
        setFilterRole(event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleViewUser = (id) => {
        navigate(`/users/profile/${id}`);
    };

    const handleEditUser = (id) => {
        navigate(`/users/${id}`);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const rows = users.map((user) => {
        // Utiliser _id si id n'est pas disponible
        const userId = user.id || user._id;
        return createData(
            userId,
            user.firstname || 'N/A',
            user.lastname || 'N/A',
            user.email,
            user.city || 'N/A',
            user.school || 'N/A',
            user.role || 'user',
            user.isEmailVerified ? 'Oui' : 'Non',
            user.avatar,
            user.accountClosed
        );
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Rôle</InputLabel>
                        <Select value={filterRole} label="Rôle" onChange={handleRoleFilterChange}>
                            <MenuItem value="all">Tous les rôles</MenuItem>
                            <MenuItem value={EUserRole.USER}>Utilisateur</MenuItem>
                            <MenuItem value={EUserRole.ADMIN}>Administrateur</MenuItem>
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

                <Button variant="contained" color="primary" startIcon={<IconPlus />} onClick={() => navigate('/users/create')}>
                    Nouvel Utilisateur
                </Button>
            </Box>

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
                            Liste des Utilisateurs
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
                                        indeterminate={selected.length > 0 && selected.length < rows.length}
                                        checked={rows.length > 0 && selected.length === rows.length}
                                        onChange={handleSelectAllClick}
                                        inputProps={{ 'aria-label': 'select all users' }}
                                    />
                                </TableCell>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        {headCell.id !== 'avatar' && headCell.id !== 'actions' ? (
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
                                        ) : (
                                            headCell.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        Aucun utilisateur trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        onClick={(event) => handleClick(event, row.id)}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Avatar
                                                        src={row.avatar}
                                                        alt={`${row.firstname} ${row.lastname}`}
                                                        sx={{ width: 40, height: 40 }}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" id={labelId} scope="row">
                                                    {row.firstname}
                                                </TableCell>
                                                <TableCell>{row.lastname}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.city}</TableCell>
                                                <TableCell>{row.school}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.role}
                                                        color={row.role === 'admin' ? 'error' : 'primary'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.accountClosed ? 'Fermé' : 'Actif'}
                                                        color={row.accountClosed ? 'error' : 'success'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Tooltip title="Voir">
                                                            <IconButton size="small" color="primary" onClick={() => handleViewUser(row.id)}>
                                                                <IconEye size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Modifier">
                                                            <IconButton
                                                                size="small"
                                                                color="secondary"
                                                                onClick={() => handleEditUser(row.id)}
                                                            >
                                                                <IconEdit size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
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
        </Box>
    );
}
