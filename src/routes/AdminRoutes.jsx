import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import AdminLayout from '../layout/AdminLayout';

// Admin pages routing
const Users = Loadable(lazy(() => import('views/admin/users')));
const UserDetails = Loadable(lazy(() => import('views/admin/users/UserDetails')));
const UserProfile = Loadable(lazy(() => import('views/admin/users/UserProfile')));
const Posts = Loadable(lazy(() => import('views/admin/posts')));
const PostDetails = Loadable(lazy(() => import('views/admin/posts/PostDetails')));
const CreatePost = Loadable(lazy(() => import('views/admin/posts/CreatePost')));
const MessagesAdmin = Loadable(lazy(() => import('views/admin/messages')));
const Notifications = Loadable(lazy(() => import('views/admin/notifications')));
const Dashboard = Loadable(lazy(() => import('views/admin/dashboard')));

// ==============================|| ADMIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <AdminLayout />,
    children: [
        {
            path: '/admin',
            element: <Dashboard />
        },
        {
            path: '/users',
            children: [
                {
                    path: 'profile',
                    element: <Users />
                },
                {
                    path: 'lists',
                    element: <Users />
                },
                {
                    path: ':userId',
                    element: <UserDetails />
                },
                {
                    path: 'profile/:userId',
                    element: <UserProfile />
                }
            ]
        },
        {
            path: '/posts',
            children: [
                {
                    path: 'lists',
                    element: <Posts />
                },
                {
                    path: 'create',
                    element: <CreatePost />
                },
                {
                    path: ':postId',
                    element: <PostDetails />
                }
            ]
        },
        {
            path: '/messages',
            element: <MessagesAdmin />
        },
        {
            path: '/notifications',
            element: <Notifications />
        }
    ]
};

export default MainRoutes;
