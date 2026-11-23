const { Client } = require("pg");
const client = new Client({
  connectionString:
    "postgres://postgres:al30082004@localhost:5432/gyrat_backend_db",
});
client
  .connect()
  .then(() =>
    client
      .query(
        'SELECT "baseId", "languageCode", name FROM product_translation WHERE "baseId" IN (1, 3, 62);',
      )
      .then((res) => {
        console.log(res.rows);
        client.end();
      }),
  )
  .catch((e) => console.error(e));
