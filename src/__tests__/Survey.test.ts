import request from "supertest";
import { getConnection, getConnectionOptions } from "typeorm";
import { app } from "../app";

import createConnection from "../database";

describe("Surveys", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new survey", async () => {
    const response = await request(app).post("/surveys").send({
      title: "ttitle example",
      description: "Description Example",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("to be able to get all survey", async () => {
    await request(app).post("/surveys").send({
      title: "title example",
      description: "Description Example",
    });
    const response = await request(app).get("/surveys");

    expect(response.body.length).toBe(2);
  });
});
