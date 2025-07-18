const pool = require("../config/db");
const createUser = async ({
  username,
  email,
  password,
  role,
  village,
  approved = false,
}) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password, role, village, approved)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [username, email, password, role, village || null, approved]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};

const approveUser = async (id) => {
  const result = await pool.query(
    `UPDATE users
     SET approved = true, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  approveUser,
};
