export interface User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    email_confirmation_token?: string;
    email_confirmed?: boolean;
    profile_image_url?: string;
    created_at?: Date;
}
