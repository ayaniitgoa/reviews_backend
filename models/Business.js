import { query } from "../db.js";

// export const getBusinesses = async ( locationid ) => {
//   try {
//     const result = await query(
//       "SELECT * FROM businesses WHERE locationid = $1",
//       [locationid]
//     );
//     console.log("locationid", locationid);
//     console.log("rows", result.rows);

//     return result.rows;
//   } catch (error) {
//     console.error("Database query error:", error);
//     throw error; // Re-throw to be caught by route handler
//   }

// };
export const getBusinesses = async (locationid) => {
  try {
    // Step 1: Fetch all category groups (e.g., "Healthcare", "Sports")
    const groups = await query("SELECT * FROM category_group");

    // Step 2: For each group, fetch its categories and businesses
    const result = {};
    for (const group of groups.rows) {
      const categories = await query(
        "SELECT * FROM categories WHERE category_group_id = $1",
        [group.id]
      );

      result[group.name] = {
        default: categories.rows[0]?.name || "", // Set first category as default
        categories: {},
      };

      // Step 3: Fetch businesses for each category
      for (const category of categories.rows) {
        const businesses = await query(
          "SELECT id, name, rating FROM businesses WHERE categoryid = $1 AND locationid = $2",
          [category.id, locationid]
        );

        result[group.name].categories[category.name] = businesses.rows.map(
          (b) => ({
            id: b.id,
            name: b.name,
            rating: b.rating,
            reviews: 0, // Add review count later
          })
        );
      }
    }
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw to be caught by route handler
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
