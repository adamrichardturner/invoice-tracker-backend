import request from "supertest";
import { app, server } from "../app";
import { pool } from "../config/database";

const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15);
};

describe("Auth Controller", () => {
    let username: string;
    let email: string;
    let password: string;
    let token: string;

    beforeAll(async () => {
        const randomString = generateRandomString();
        username = `user_${randomString}`;
        email = `${randomString}@example.com`;
        password = "password123";

        const registerRes = await request(app).post("/user/register").send({
            username: username,
            email: email,
            password: password,
        });

        token = registerRes.body.token;
    });

    afterAll(async () => {
        await pool.end();
        if (server) {
            server.close();
        }
    });

    describe("POST /user/register", () => {
        it("should register a new user", async () => {
            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
        });
    });

    describe("GET /user/confirm-email", () => {
        it("should confirm the email with valid token", async () => {
            const res = await request(app).get(
                `/user/confirm-email?token=${token}`,
            );
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Email confirmed. You can now log in.");
        });

        it("should return an error with an invalid token", async () => {
            const invalidToken = "invalid-token";
            const res = await request(app).get(
                `/user/confirm-email?token=${invalidToken}`,
            );
            expect(res.statusCode).toEqual(400);
            expect(res.text).toContain("Invalid token.");
        });
    });

    describe("POST /user/login", () => {
        it("should log in a user with valid credentials", async () => {
            // Confirm email before attempting to log in
            await request(app).get(`/user/confirm-email?token=${token}`);

            const res = await request(app).post("/user/login").send({
                email: email,
                password: password,
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("username", username);
        });

        it("should return an error with invalid credentials", async () => {
            const res = await request(app).post("/user/login").send({
                email: "wrongemail@example.com",
                password: "wrongpassword",
            });
            expect(res.statusCode).toEqual(400);
            expect(res.text).toContain("Incorrect email.");
        });
    });

    describe("POST /user/logout", () => {
        it("should log out the user", async () => {
            const agent = request.agent(app);

            // Confirm email and log in before attempting to log out
            await request(app).get(`/user/confirm-email?token=${token}`);

            await agent.post("/user/login").send({
                email: email,
                password: password,
            });

            const res = await agent.post("/user/logout");
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Logged out successfully.");
        });
    });
});
