import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Typography,
    Checkbox,
    IconButton,
    Tooltip,
    Box,
    Grid,
    Chip,
    Collapse
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectPartnerOffer } from 'store/partnerOfferSlice';
import useSWR from 'swr';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

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
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Titre' },
    { id: 'category', numeric: false, disablePadding: false, label: 'Catégorie' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Statut' }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all offers' }}
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
                            onClick={createSortHandler(headCell.id)}
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
                <TableCell>Action</TableCell>
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar(props) {
    const { numSelected, onEditClick, selectedData, onDeleteClick } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Partner Offers
                </Typography>
            )}
            {numSelected === 1 && (
                <Tooltip title="Edit">
                    <IconButton onClick={() => onEditClick(selectedData)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={() => onDeleteClick(selectedData)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

const fetchPartnerOffers = (url) => axiosInstance.get(url).then((res) => res?.data?.data);

export default function PartnerOfferDataTable({ user }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showMore, setShowMore] = useState({});
    const dispatch = useDispatch();

    const { data: po, mutate } = useSWR(`/partner-offers/${user?._id}`, fetchPartnerOffers);

    const partnerOffers = po || [];

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = partnerOffers.map((n, index) => index);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, index) => {
        const selectedIndex = selected.indexOf(index);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, index);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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

    const isSelected = (index) => selected.indexOf(index) !== -1;

    const handleShowMoreToggle = (index) => {
        setShowMore((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - partnerOffers.length) : 0;

    const visibleRows = stableSort(partnerOffers, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleEditClick = (selectedData) => {
        dispatch(selectPartnerOffer(selectedData));
    };

    const handleDeleteClick = async (selectedData) => {
        await axiosInstance.delete(`/partner-offers/${selectedData?._id}`);
        setSelected([]);
        mutate();
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    onDeleteClick={handleDeleteClick}
                    numSelected={selected.length}
                    onEditClick={handleEditClick}
                    selectedData={partnerOffers[selected[0]]}
                />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={partnerOffers.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(index);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <React.Fragment key={index}>
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, index)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {row.title}
                                            </TableCell>
                                            <TableCell>{row.category}</TableCell>
                                            <TableCell>
                                                <Chip label={row.status} color={row.status === 'Active' ? 'success' : 'default'} />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleShowMoreToggle(index)}>
                                                    {showMore[index] ? <ArrowCircleUpOutlinedIcon /> : <ArrowCircleDownOutlinedIcon />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        {showMore[index] && (
                                            <TableRow>
                                                <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                                    <Collapse in={showMore[index]} timeout="auto" unmountOnExit>
                                                        <Box margin={1}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} md={9}>
                                                                    <Typography variant="h6">Description</Typography>
                                                                    <div dangerouslySetInnerHTML={{ __html: row.description }} />
                                                                    <Typography variant="h6">Conditions</Typography>
                                                                    <Typography>{row.terms}</Typography>
                                                                </Grid>
                                                                <Grid item xs={12} md={3}>
                                                                    <img
                                                                        src={row.imageUrl}
                                                                        alt={row.title}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: 'auto',
                                                                            borderRadius: '10px'
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={partnerOffers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
