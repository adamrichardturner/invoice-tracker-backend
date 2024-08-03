import { User } from "../models/user";

declare global {
    namespace Express {
        interface User extends User {}
    }
}
