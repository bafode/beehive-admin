// Énumérations pour les rôles utilisateur
export const EUserRole = {
    USER: 'user',
    ADMIN: 'admin'
};

// Énumérations pour les genres
export const EGender = {
    MALE: 'male',
    FEMALE: 'female'
};

// Énumérations pour les types d'authentification
export const EAuthType = {
    EMAIL: 'email',
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    APPLE: 'apple'
};

// Énumérations pour les catégories de posts
export const EPostCategory = {
    INSPIRATION: 'inspiration',
    COMMUNAUTE: 'communaute',
    ALL: 'all'
};

// Énumérations pour les domaines de posts
export const EPostDomain = {
    DEV: 'dev',
    DA: 'da',
    UI_UX: 'ui_ux',
    MARKETING: 'marketing',
    ALL: 'all'
};

// Énumérations pour les types de notifications
export const ENotificationType = {
    VOICE: 'voice',
    VIDEO: 'video',
    TEXT: 'text',
    CANCEL: 'cancel',
    ACCEPT: 'accept',
    VOICE_CALL: 'voice_call',
    VIDEO_CALL: 'video_call',
    TEXT_MESSAGE: 'text_message',
    CALL_CANCELED: 'call_canceled',
    ACCEPT_CALL: 'accept_call',
    LIKE: 'like',
    COMMENT: 'comment',
    FOLLOW: 'follow',
    MENTION: 'mention',
    TAG: 'tag',
    SHARE: 'share',
    NEW_POST: 'new_post',
    FRIEND_REQUEST: 'friend_request',
    FRIEND_ACCEPT: 'friend_accept',
    SYSTEM: 'system'
};

// Énumérations pour les statuts de notifications
export const ENotificationStatus = {
    UNREAD: 'unread',
    READ: 'read',
    ARCHIVED: 'archived'
};

// Énumérations pour les types de tokens
export const ETokenType = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail'
};

// Énumérations pour les noms de modèles
export const EModelNames = {
    USER: 'User',
    TOKEN: 'Token',
    POST: 'Post',
    FAVORITE: 'Favorite',
    COMMENT: 'Comment',
    MESSAGE: 'Message',
    CHAT: 'Chat',
    LANDING_CONTACT: 'LandingContact',
    NOTIFICATION: 'Notification'
};
