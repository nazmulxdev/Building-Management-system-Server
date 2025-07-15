import { apartmentsCollection } from "../../config/db.js";

const getAllApartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const minRent = parseInt(req.query.minRent);
    const maxRent = parseInt(req.query.maxRent);

    // building the query object
    const query = {};
    if (!isNaN(minRent) && !isNaN(maxRent)) {
      query.rent = { $gte: minRent, $lte: maxRent };
    } else if (!isNaN(minRent)) {
      query.rent = { $gte: minRent };
    } else if (!isNaN(maxRent)) {
      query.rent = { $lte: maxRent };
    }

    // getting total number of apartment
    const totalApartments = await apartmentsCollection.countDocuments(query);

    // calculation of total page
    const totalPages = Math.ceil(totalApartments / limit);
    const apartments = await apartmentsCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
    res.send({
      apartments,
      totalPages,
      currentPage: page,
      totalApartments,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to load apartments details" });
  }
};

export { getAllApartments };
