import AdminLayout from 'layout/AdminLayout';
import Users from 'views/admin/users';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <AdminLayout />,
    children: [
        {
            path: '/',
            element: <Users />
        }
    ]
};

export default MainRoutes;
