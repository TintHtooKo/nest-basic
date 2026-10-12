import { DataSource } from "typeorm";

export default new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "your_database_password",
    database: "your_database_name",
    entities: ["**/*.entity.js"],
    migrations: ["migrations/*.js"],
})