// assets
import { IconUser, IconCalendarEvent, IconPlus, IconCategory } from '@tabler/icons-react';

// constant
const icons = {
    IconUser,
    IconCalendarEvent,
    IconPlus,
    IconCategory
};

// ==============================|| EVENT MENU ITEMS ||============================== //

const events = {
    id: 'event',
    title: 'Evenements',
    type: 'group',
    children: [
        {
            id: 'event-list',
            title: 'Liste des Evenements',
            type: 'item',
            url: '/event/lists',
            icon: icons.IconCalendarEvent,
            breadcrumbs: false
        },
        {
            id: 'event-create',
            title: 'Ajouter un Evenement',
            type: 'item',
            url: '/event/create',
            icon: icons.IconPlus,
            breadcrumbs: false
        },
        {
            id: 'category-lists',
            title: 'Liste des Billets',
            type: 'item',
            url: '/category/lists',
            icon: icons.IconCategory,
            breadcrumbs: false
        },
        {
            id: 'category-create',
            title: 'Ajouter un Billet',
            type: 'item',
            url: '/category/create',
            icon: icons.IconPlus,
            breadcrumbs: false
        }
    ]
};

export default events;
