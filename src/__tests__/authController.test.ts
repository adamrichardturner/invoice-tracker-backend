import request from "supertest";
import { app } from "../app";
import { pool } from "../config/database";

const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15);
};

describe("Auth Controller", () => {
    afterAll(async () => {
        await pool.end();
    });

    describe("POST /user/register", () => {
        it("should register a new user", async () => {
            const randomString = generateRandomString();
            const username = `user_${randomString}`;
            const email = `${randomString}@example.com`;

            const res = await request(app).post("/user/register").send({
                username: username,
                email: email,
                password: "password123",
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("token");
            expect(res.body.message).toContain(
                "User registered. Please check your email to confirm.",
            );
        });
    });

    describe("GET /user/confirm-email", () => {
        it("should confirm the email with valid token", async () => {
            const randomString = generateRandomString();
            const username = `user_${randomString}`;
            const email = `${randomString}@example.com`;

            const registerRes = await request(app).post("/user/register").send({
                username: username,
                email: email,
                password: "password123",
            });

            const token = registerRes.body.token;

            const res = await request(app).get(
                `/user/confirm-email?token=${token}`,
            );
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Email confirmed. You can now log in.");
        });

        it("should return an error with an invalid token", async () => {
            const token = "invalid-token";
            const res = await request(app).get(
                `/user/confirm-email?token=${token}`,
            );
            expect(res.statusCode).toEqual(400);
            expect(res.text).toContain("Invalid token.");
        });
    });

    describe("POST /user/login", () => {
        it("should log in a user with valid credentials", async () => {
            const randomString = generateRandomString();
            const username = `user_${randomString}`;
            const email = `${randomString}@example.com`;

            await request(app).post("/user/register").send({
                username: username,
                email: email,
                password: "password123",
            });

            const res = await request(app).post("/user/login").send({
                username: email,
                password: "password123",
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("username", username);
        });

        it("should return an error with invalid credentials", async () => {
            const res = await request(app).post("/user/login").send({
                username: "wronguser",
                password: "wrongpassword",
            });
            expect(res.statusCode).toEqual(400);
            expect(res.text).toContain("Invalid credentials");
        });
    });

    describe("POST /user/logout", () => {
        it("should log out the user", async () => {
            const agent = request.agent(app);

            const randomString = generateRandomString();
            const username = `user_${randomString}`;
            const email = `${randomString}@example.com`;

            await agent.post("/user/register").send({
                username: username,
                email: email,
                password: "password123",
            });

            await agent.post("/user/login").send({
                username: email,
                password: "password123",
            });

            const res = await agent.post("/user/logout");
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Logged out successfully.");
        });
    });
});
