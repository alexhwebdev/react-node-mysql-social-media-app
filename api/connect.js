import mysql from "mysql2";

export const db = mysql.createConnection({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'DukeqHenry19043-12',
  database: 'lama_dev_social_app'
})

