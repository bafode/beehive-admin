// assets
import { IconUser } from '@tabler/icons-react';

// constant
const icons = {
    IconUser
};

// ==============================|| PARTENAIRES MENU ITEMS ||============================== //

const users = {
    id: 'users',
    title: 'Users',
    type: 'group',
    children: [
        {
            id: 'users-list',
            title: 'Liste des Utilisateurs',
            type: 'item',
            url: '/users/lists',
            icon: icons.IconUser,
            breadcrumbs: false
        }
    ]
};

export default users;
