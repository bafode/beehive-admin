import Grid from '@mui/material/Grid';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import UserDataTable from 'ui-component/user/UserDataTable';
// ============================|| PARTENAIRE ADMIN PAGE ||============================ //

const Users = () => {
    return (
        <MainCard title="Utilisateurs">
            <Grid container>
                <Grid item xs={12}>
                    <UserDataTable />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Users;
