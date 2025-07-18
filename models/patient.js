const pool = require("../config/db");
const localDb = require("../config/localDb");

const Patient = {
  // Insert a new patient
  async create(data, useLocal = false) {
    const {
      gov_id,
      full_name,
      date_of_birth,
      relative_name,
      phone_number,
      email,
      address,
      latitude,
      longitude,
    } = data;

    // Validate required fields
    if (!full_name || !date_of_birth) {
      throw new Error(
        "Missing required fields: full_name and date_of_birth are required."
      );
    }

    if (useLocal) {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO patients 
            (gov_id, full_name, date_of_birth, relative_name, phone_number, email, address, latitude, longitude)
          VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(gov_id) DO NOTHING
        `;
        const values = [
          gov_id,
          full_name,
          date_of_birth,
          relative_name,
          phone_number,
          email,
          address,
          latitude,
          longitude,
        ];
        localDb.run(query, values, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...data });
          }
        });
      });
    } else {
      const query = `
        INSERT INTO patients 
          (gov_id, full_name, date_of_birth, relative_name, phone_number, email, address, latitude, longitude)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (gov_id) 
        DO UPDATE SET
          full_name = EXCLUDED.full_name,
          date_of_birth = EXCLUDED.date_of_birth,
          relative_name = EXCLUDED.relative_name,
          phone_number = EXCLUDED.phone_number,
          email = EXCLUDED.email,
          address = EXCLUDED.address,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude
        RETURNING *;
      `;
      const values = [
        gov_id,
        full_name,
        date_of_birth,
        relative_name,
        phone_number,
        email,
        address,
        latitude,
        longitude,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    }
  },

  // New search method
  async search(searchTerm, useLocal = false) {
    if (useLocal) {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT * FROM patients
          WHERE gov_id LIKE ?
          OR phone_number LIKE ?
          OR full_name LIKE ?
        `;
        const values = [
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ];
        localDb.all(query, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    } else {
      const query = `
        SELECT * FROM patients
        WHERE gov_id ILIKE $1
        OR phone_number ILIKE $2
        OR full_name ILIKE $3
      `;
      const values = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
      const result = await pool.query(query, values);
      return result.rows;
    }
  },

  fetchAllRemote() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM patients", [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      });
    });
  },

  fetchByID(id) {
    if (useLocal) {
      return new Promise((resolve, reject) => {
        localDb.get(
          "SELECT * FROM patients WHERE gov_id = ?",
          [gov_id],
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          "SELECT * FROM patients WHERE id = $1",
          [id],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.rows[0]);
            }
          }
        );
      });
    }
  },

  updatePatient(id, data) {
    const {
      full_name,
      date_of_birth,
      relative_name,
      phone_number,
      email,
      address,
      latitude,
      longitude,
    } = data;
    if (useLocal) {
      return new Promise((resolve, reject) => {
        const query = `
            UPDATE patients
          SET full_name = ?, date_of_birth = ?, relative_name = ?, phone_number = ?, email = ?, address = ?, latitude = ?, longitude = ?
          WHERE gov_id = ?
          `;
        const values = [
          full_name,
          date_of_birth,
          relative_name,
          phone_number,
          email,
          address,
          latitude,
          longitude,
          gov_id,
        ];
        localDb.run(query, values, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, ...data });
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        const query = `
          UPDATE patients
          SET full_name = $1, date_of_birth = $2, relative_name = $3, phone_number = $4, email = $5, address = $6, latitude = $7, longitude = $8
          WHERE gov_id = $9
          RETURNING *;
        `;
        const values = [
          full_name,
          date_of_birth,
          relative_name,
          phone_number,
          email,
          address,
          latitude,
          longitude,
          gov_id,
        ];
        pool.query(query, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows[0]);
          }
        });
      });
    }
  },

  // Fetch all local patients
  fetchLocalPatients() {
    return new Promise((resolve, reject) => {
      localDb.all("SELECT * FROM patients", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  //Delete a patient by full_name and date_of_birth
  async deletePatient(full_name, date_of_birth, useLocal = false) {
    if (useLocal) {
      return new Promise((resolve, reject) => {
        const query = `
          DELETE FROM patients 
          WHERE gov_id = ?
        `;
        localDb.run(query, [gov_id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ gov_id });
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        const query = `
          DELETE FROM patients 
          WHERE gov_id = $1
          RETURNING *;
        `;
        const values = [gov_id];
        pool.query(query, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows[0]);
          }
        });
      });
    }
  },
};

module.exports = Patient;
