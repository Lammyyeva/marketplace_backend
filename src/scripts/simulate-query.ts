import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { FacetValue } from "@vendure/core";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  logging: true, // Turn on logging to see the SQL!
});

async function main() {
  await AppDataSource.initialize();

  // Simulate the query in getModels
  const models = await AppDataSource.getRepository(FacetValue)
    .createQueryBuilder("fv")
    .innerJoin("fv.facet", "f")
    .leftJoinAndSelect("fv.translations", "t")
    .where("f.code = :modelCode OR f.code = :markaCode", {
      modelCode: "model",
      markaCode: "marka",
    })
    .getMany();

  const result = models.map((b) => ({
    id: b.id,
    name: (b.translations && b.translations[0]?.name) || b.code,
  }));

  await AppDataSource.destroy();
}

main().catch((err) => {
  process.exit(1);
});
