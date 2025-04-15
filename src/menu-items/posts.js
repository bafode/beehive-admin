// assets
import { IconArticle } from '@tabler/icons-react';

// constant
const icons = {
    IconArticle
};

// ==============================|| POSTS MENU ITEMS ||============================== //

const posts = {
    id: 'posts',
    title: 'Posts',
    type: 'group',
    children: [
        {
            id: 'posts-list',
            title: 'Liste des Posts',
            type: 'item',
            url: '/posts/lists',
            icon: icons.IconArticle,
            breadcrumbs: false
        }
    ]
};

export default posts;
