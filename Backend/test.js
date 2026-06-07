const db = require("./db");

async function test() {
  const [rows] = await db.query("SELECT * FROM item_types");

  console.log(rows);
}

test();
