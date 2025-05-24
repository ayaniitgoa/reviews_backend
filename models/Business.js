import { query } from "../db.js";

export const getBusinesses = async (locationid) => {
  try {
    // Step 1: Fetch all category groups
    const groups = await query("SELECT * FROM category_group");

    // Step 2: For each group, fetch its categories and businesses with review data
    const result = {};
    for (const group of groups.rows) {
      const categories = await query(
        "SELECT * FROM categories WHERE category_group_id = $1",
        [group.id]
      );

      result[group.name] = {
        default: categories.rows[0]?.name || "",
        categories: {},
      };

      // Step 3: Fetch businesses with review counts and average ratings
      for (const category of categories.rows) {
        const businesses = await query(
          `SELECT 
             b.id, 
             b.name, 
             COALESCE(AVG(r.rating), 0) AS rating,
             COUNT(r.reviewid) AS reviews
           FROM businesses b
           LEFT JOIN reviews r ON b.id = r.businessid
           WHERE b.categoryid = $1 AND b.locationid = $2
           GROUP BY b.id, b.name, b.rating`,
          [category.id, locationid]
        );

        result[group.name].categories[category.name] = businesses.rows.map(
          (b) => ({
            id: b.id,
            name: b.name,
            rating: parseFloat(b.rating).toFixed(1), // Format to 1 decimal place
            reviews: parseInt(b.reviews), // Ensure integer value
          })
        );
      }
    }
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export const getBusiness = async (businessid) => {
  try {
    const result = await query("SELECT * FROM businesses WHERE id = $1", [
      businessid,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw to be caught by route handler
  }
};
