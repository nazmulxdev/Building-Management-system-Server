import { apartmentsCollection } from "../../config/db.js";

const getAllApartments = async (req, res) => {
  try {
    const apartments = await apartmentsCollection.find().toArray();
    res.send(apartments);
  } catch (error) {
    res.status(500).send({ message: "Failed to load apartments details" });
  }
};

export { getAllApartments };
