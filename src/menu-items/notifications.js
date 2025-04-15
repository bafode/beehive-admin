// assets
import { IconBell } from '@tabler/icons-react';

// constant
const icons = {
    IconBell
};

// ==============================|| NOTIFICATIONS MENU ITEMS ||============================== //

const notifications = {
    id: 'notifications',
    title: 'Notifications',
    type: 'group',
    children: [
        {
            id: 'notifications-list',
            title: 'Liste des Notifications',
            type: 'item',
            url: '/notifications',
            icon: icons.IconBell,
            breadcrumbs: false
        }
    ]
};

export default notifications;
