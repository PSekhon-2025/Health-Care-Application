const pool = require("../config/db");
const localDb = require("../config/localDb");

const MedicalHistory = {
  // Insert a new medical history record
  async create(data, useLocal = false) {
    const {
      gov_id,
      notes,
      // Loss of Vision
      loss_of_vision,
      loss_of_vision_eye,
      loss_of_vision_onset,
      loss_of_vision_pain,
      loss_of_vision_duration,
      // Redness
      redness,
      redness_eye,
      redness_onset,
      redness_pain,
      redness_duration,
      // Watering
      watering,
      watering_eye,
      watering_onset,
      watering_pain,
      watering_duration,
      // Discharge
      discharge_type,
      // Itching
      itching,
      itching_eye,
      itching_duration,
      // Pain Final
      pain_final,
      pain_final_eye,
      pain_final_onset,
      pain_final_duration,
      // Systemic History
      htn,
      dm,
      heart_disease,
      // Allergy History
      allergy_drops,
      allergy_tablets,
      seasonal_allergies,
      // Contact Lenses
      contact_lenses_use,
      contact_lenses_duration,
      contact_lenses_frequency,
      // Eye Surgical History
      cataract_or_injury,
      retinal_lasers,
    } = data;

    // Validate required fields
    if (!gov_id) {
      throw new Error("Missing required field: gov_id is required.");
    }

    if (useLocal) {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO medical_history (
            gov_id, notes,
            loss_of_vision, loss_of_vision_eye, loss_of_vision_onset, loss_of_vision_pain, loss_of_vision_duration,
            redness, redness_eye, redness_onset, redness_pain, redness_duration,
            watering, watering_eye, watering_onset, watering_pain, watering_duration,
            discharge_type,
            itching, itching_eye, itching_duration,
            pain_final, pain_final_eye, pain_final_onset, pain_final_duration,
            htn, dm, heart_disease,
            allergy_drops, allergy_tablets, seasonal_allergies,
            contact_lenses_use, contact_lenses_duration, contact_lenses_frequency,
            cataract_or_injury, retinal_lasers
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(gov_id) DO UPDATE SET
            notes = excluded.notes,
            loss_of_vision = excluded.loss_of_vision,
            loss_of_vision_eye = excluded.loss_of_vision_eye,
            loss_of_vision_onset = excluded.loss_of_vision_onset,
            loss_of_vision_pain = excluded.loss_of_vision_pain,
            loss_of_vision_duration = excluded.loss_of_vision_duration,
            redness = excluded.redness,
            redness_eye = excluded.redness_eye,
            redness_onset = excluded.redness_onset,
            redness_pain = excluded.redness_pain,
            redness_duration = excluded.redness_duration,
            watering = excluded.watering,
            watering_eye = excluded.watering_eye,
            watering_onset = excluded.watering_onset,
            watering_pain = excluded.watering_pain,
            watering_duration = excluded.watering_duration,
            discharge_type = excluded.discharge_type,
            itching = excluded.itching,
            itching_eye = excluded.itching_eye,
            itching_duration = excluded.itching_duration,
            pain_final = excluded.pain_final,
            pain_final_eye = excluded.pain_final_eye,
            pain_final_onset = excluded.pain_final_onset,
            pain_final_duration = excluded.pain_final_duration,
            htn = excluded.htn,
            dm = excluded.dm,
            heart_disease = excluded.heart_disease,
            allergy_drops = excluded.allergy_drops,
            allergy_tablets = excluded.allergy_tablets,
            seasonal_allergies = excluded.seasonal_allergies,
            contact_lenses_use = excluded.contact_lenses_use,
            contact_lenses_duration = excluded.contact_lenses_duration,
            contact_lenses_frequency = excluded.contact_lenses_frequency,
            cataract_or_injury = excluded.cataract_or_injury,
            retinal_lasers = excluded.retinal_lasers
        `;

        const values = [
          gov_id,
          notes,
          loss_of_vision,
          loss_of_vision_eye,
          loss_of_vision_onset,
          loss_of_vision_pain,
          loss_of_vision_duration,
          redness,
          redness_eye,
          redness_onset,
          redness_pain,
          redness_duration,
          watering,
          watering_eye,
          watering_onset,
          watering_pain,
          watering_duration,
          discharge_type,
          itching,
          itching_eye,
          itching_duration,
          pain_final,
          pain_final_eye,
          pain_final_onset,
          pain_final_duration,
          htn,
          dm,
          heart_disease,
          allergy_drops,
          allergy_tablets,
          seasonal_allergies,
          contact_lenses_use,
          contact_lenses_duration,
          contact_lenses_frequency,
          cataract_or_injury,
          retinal_lasers,
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
        INSERT INTO medical_history (
          gov_id, notes,
          loss_of_vision, loss_of_vision_eye, loss_of_vision_onset, loss_of_vision_pain, loss_of_vision_duration,
          redness, redness_eye, redness_onset, redness_pain, redness_duration,
          watering, watering_eye, watering_onset, watering_pain, watering_duration,
          discharge_type,
          itching, itching_eye, itching_duration,
          pain_final, pain_final_eye, pain_final_onset, pain_final_duration,
          htn, dm, heart_disease,
          allergy_drops, allergy_tablets, seasonal_allergies,
          contact_lenses_use, contact_lenses_duration, contact_lenses_frequency,
          cataract_or_injury, retinal_lasers
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36)
        ON CONFLICT (gov_id) 
        DO UPDATE SET
          notes = EXCLUDED.notes,
          loss_of_vision = EXCLUDED.loss_of_vision,
          loss_of_vision_eye = EXCLUDED.loss_of_vision_eye,
          loss_of_vision_onset = EXCLUDED.loss_of_vision_onset,
          loss_of_vision_pain = EXCLUDED.loss_of_vision_pain,
          loss_of_vision_duration = EXCLUDED.loss_of_vision_duration,
          redness = EXCLUDED.redness,
          redness_eye = EXCLUDED.redness_eye,
          redness_onset = EXCLUDED.redness_onset,
          redness_pain = EXCLUDED.redness_pain,
          redness_duration = EXCLUDED.redness_duration,
          watering = EXCLUDED.watering,
          watering_eye = EXCLUDED.watering_eye,
          watering_onset = EXCLUDED.watering_onset,
          watering_pain = EXCLUDED.watering_pain,
          watering_duration = EXCLUDED.watering_duration,
          discharge_type = EXCLUDED.discharge_type,
          itching = EXCLUDED.itching,
          itching_eye = EXCLUDED.itching_eye,
          itching_duration = EXCLUDED.itching_duration,
          pain_final = EXCLUDED.pain_final,
          pain_final_eye = EXCLUDED.pain_final_eye,
          pain_final_onset = EXCLUDED.pain_final_onset,
          pain_final_duration = EXCLUDED.pain_final_duration,
          htn = EXCLUDED.htn,
          dm = EXCLUDED.dm,
          heart_disease = EXCLUDED.heart_disease,
          allergy_drops = EXCLUDED.allergy_drops,
          allergy_tablets = EXCLUDED.allergy_tablets,
          seasonal_allergies = EXCLUDED.seasonal_allergies,
          contact_lenses_use = EXCLUDED.contact_lenses_use,
          contact_lenses_duration = EXCLUDED.contact_lenses_duration,
          contact_lenses_frequency = EXCLUDED.contact_lenses_frequency,
          cataract_or_injury = EXCLUDED.cataract_or_injury,
          retinal_lasers = EXCLUDED.retinal_lasers
        RETURNING *;
      `;

      const values = [
        gov_id,
        notes,
        loss_of_vision,
        loss_of_vision_eye,
        loss_of_vision_onset,
        loss_of_vision_pain,
        loss_of_vision_duration,
        redness,
        redness_eye,
        redness_onset,
        redness_pain,
        redness_duration,
        watering,
        watering_eye,
        watering_onset,
        watering_pain,
        watering_duration,
        discharge_type,
        itching,
        itching_eye,
        itching_duration,
        pain_final,
        pain_final_eye,
        pain_final_onset,
        pain_final_duration,
        htn,
        dm,
        heart_disease,
        allergy_drops,
        allergy_tablets,
        seasonal_allergies,
        contact_lenses_use,
        contact_lenses_duration,
        contact_lenses_frequency,
        cataract_or_injury,
        retinal_lasers,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    }
  },

  // Fetch medical history by government ID
  async getByGovId(gov_id, useLocal = false) {
    if (useLocal) {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM medical_history WHERE gov_id = ?";
        localDb.get(query, [gov_id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    } else {
      const query = "SELECT * FROM medical_history WHERE gov_id = $1";
      const result = await pool.query(query, [gov_id]);
      return result.rows[0];
    }
  },

  // Update medical history
  async update(gov_id, data, useLocal = false) {
    return this.create({ ...data, gov_id: gov_id }, useLocal);
  },

  // Delete medical history
  async delete(gov_id, useLocal = false) {
    if (useLocal) {
      return new Promise((resolve, reject) => {
        const query = "DELETE FROM medical_history WHERE gov_id = ?";
        localDb.run(query, [gov_id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ gov_id: gov_id });
          }
        });
      });
    } else {
      const query = "DELETE FROM medical_history WHERE gov_id = $1 RETURNING *";
      const result = await pool.query(query, [gov_id]);
      return result.rows[0];
    }
  },

  // Fetch all medical histories (for admin purposes)
  async fetchAll(useLocal = false) {
    if (useLocal) {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM medical_history";
        localDb.all(query, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    } else {
      const query = "SELECT * FROM medical_history";
      const result = await pool.query(query);
      return result.rows;
    }
  },
};

module.exports = MedicalHistory;
