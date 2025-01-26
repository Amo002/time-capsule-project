import { pool } from "../config/db.js";

export const fetchCapsuleById = async (capsuleId) => {
  try {
    const [capsules] = await pool.query(
      `SELECT 
        capsules.*,
        users.username AS creator_name,
        users.profile_picture AS creator_profile_picture
      FROM capsules
      JOIN users ON capsules.user_id = users.id
      WHERE capsules.id = ?`,
      [capsuleId]
    );
    return capsules[0] || null;
  } catch (error) {
    console.error("Database error while fetching capsule:", error.message);
    throw new Error("Database error");
  }
};

export const updateCapsuleById = async (capsuleId, data) => {
  const { title, content, release_date, image_url } = data;
  try {
    const query = `
        UPDATE capsules
        SET 
          title = COALESCE(?, title),
          content = COALESCE(?, content),
          release_date = COALESCE(?, release_date),
          image_url = COALESCE(?, image_url)
        WHERE id = ?`;

    const values = [title, content, release_date, image_url, capsuleId];

    console.log("Executing query:", query, values); // Debugging

    const [result] = await pool.query(query, values);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database error while updating capsule:", error.message);
    throw new Error("Database error");
  }
};

export const deleteCapsuleById = async (capsuleId) => {
  try {
    const [result] = await pool.query(`DELETE FROM capsules WHERE id = ?`, [
      capsuleId,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database error while deleting capsule:", error.message);
    throw new Error("Database error");
  }
};

export const allCapsulesFetch = async () => {
    try {
      const [capsules] = await pool.query("SELECT id, title, release_date FROM capsules");
      return capsules;
    } catch (error) {
      console.error("Database error while fetching capsules:", error.message);
      throw new Error("Database error");
    }
  };