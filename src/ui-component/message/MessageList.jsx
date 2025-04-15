import { useState, useEffect } from 'react';
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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconTrash, IconSearch, IconEye, IconMail } from '@tabler/icons-react';
import axiosInstance from 'api/axiosInstance';

// Define headCells for table columns
const headCells = [
    { id: 'firstName', numeric: false, disablePadding: true, label: 'Prénom' },
    { id: 'lastName', numeric: false, disablePadding: false, label: 'Nom' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'subject', numeric: false, disablePadding: false, label: 'Sujet' },
    { id: 'message', numeric: false, disablePadding: false, label: 'Message' },
    { id: 'createdAt', numeric: false, disablePadding: false, label: "Date d'envoi" },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
];

// Utility function to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
};

// Function for stable sorting
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// Comparator function for sorting
function getComparator(order, orderBy) {
    return (a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    };
}

// Truncate text function
const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Main MessageList component
const MessageList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                sortBy: orderBy,
                orderBy: order
            };

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await axiosInstance.get('/landing-contacts', { params });
            setMessages(response.data.results || []);
            setTotalCount(response.data.totalResults || 0);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [page, rowsPerPage, orderBy, order, searchTerm]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = messages.map((message) => message.id);
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
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selected.length} message(s) ?`)) {
            try {
                await Promise.all(selected.map((id) => axiosInstance.delete(`/landing-contacts/${id}`)));
                fetchMessages();
                setSelected([]);
            } catch (error) {
                console.error('Error deleting messages:', error);
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleViewMessage = (message) => {
        setCurrentMessage(message);
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
    };

    const handleSendEmail = (email) => {
        window.open(`mailto:${email}`);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                    label="Rechercher"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        endAdornment: <IconSearch size={20} />
                    }}
                />

                <Button variant="contained" color="primary" onClick={fetchMessages}>
                    Rafraîchir
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
                            Messages de contact
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
                                        indeterminate={selected.length > 0 && selected.length < messages.length}
                                        checked={messages.length > 0 && selected.length === messages.length}
                                        onChange={handleSelectAllClick}
                                        inputProps={{ 'aria-label': 'select all messages' }}
                                    />
                                </TableCell>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        {headCell.id !== 'actions' ? (
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
                                    <TableCell colSpan={8} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : messages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        Aucun message trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stableSort(messages, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((message, index) => {
                                        const isItemSelected = isSelected(message.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={message.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        onClick={(event) => handleClick(event, message.id)}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                                    {message.firstName || 'N/A'}
                                                </TableCell>
                                                <TableCell>{message.lastName || 'N/A'}</TableCell>
                                                <TableCell>{message.email}</TableCell>
                                                <TableCell>{truncateText(message.subject, 30)}</TableCell>
                                                <TableCell>{truncateText(message.message, 50)}</TableCell>
                                                <TableCell>{formatDate(message.createdAt)}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Tooltip title="Voir le message">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleViewMessage(message)}
                                                            >
                                                                <IconEye size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Répondre par email">
                                                            <IconButton
                                                                size="small"
                                                                color="secondary"
                                                                onClick={() => handleSendEmail(message.email)}
                                                            >
                                                                <IconMail size={18} />
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
                    labelRowsPerPage="Lignes par page"
                />
            </Paper>

            {/* Message View Dialog */}
            <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
                {currentMessage && (
                    <>
                        <DialogTitle>
                            Message de {currentMessage.firstName} {currentMessage.lastName}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    De: {currentMessage.firstName} {currentMessage.lastName} ({currentMessage.email})
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Date: {formatDate(currentMessage.createdAt)}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Sujet: {currentMessage.subject}
                                </Typography>
                            </Box>
                            <DialogContentText sx={{ whiteSpace: 'pre-wrap' }}>{currentMessage.message}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseViewDialog}>Fermer</Button>
                            <Button variant="contained" color="primary" onClick={() => handleSendEmail(currentMessage.email)}>
                                Répondre
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default MessageList;
