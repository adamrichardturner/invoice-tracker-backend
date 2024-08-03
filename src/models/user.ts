export interface User extends Express.User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    email_confirmed?: boolean;
    google_id?: string;
    twitter_id?: string;
    profile_image_url?: string;
    created_at?: Date;
}
