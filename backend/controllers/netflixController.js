import NetflixTitle from "../models/NetflixTitle.js";

export const NetflixTitles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await NetflixTitle.findAndCountAll({
      limit,
      offset,
      order: [["release_year", "DESC"]], 
    });

    return res.json({
      data: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching Netflix data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default NetflixTitles ;