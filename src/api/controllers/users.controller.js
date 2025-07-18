import { ObjectId } from "mongodb";
import {
  agreementsCollection,
  apartmentsCollection,
  usersCollection,
} from "../../config/db.js";

const userDataPost = async (req, res) => {
  const email = req.body.email;
  const currentTime = new Date().toISOString();
  const userExist = await usersCollection.findOne({ email });
  if (userExist) {
    // updating last login
    const updateLastLogIn = await usersCollection.updateOne(
      { email },
      {
        $set: {
          lastLogIn: currentTime,
        },
      },
    );
    return res.status(200).send({
      message: "user already exist",
      inserted: false,
      result: updateLastLogIn,
    });
  }
  try {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const getUserRole = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }
  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      res.status.send(404).send({ message: "user not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal server Error" });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await usersCollection.find({ role: "member" }).toArray();
    res.send(members);
  } catch (error) {
     res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const removeMemberStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
      email: email,
      role: "member",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member not found or already a regular user",
      });
    }
    const agreement = await agreementsCollection.findOne({
      userEmail: email,
      status: { $in: ["checked"] },
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: "No active agreement found for this member",
      });
    }

    if (!agreement.apartmentId) {
      return res.status(400).json({
        success: false,
        message: "Agreement is missing apartment reference",
      });
    }
    const [updateRole, updateApartment, updateAgreement] = await Promise.all([
      usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { role: "user" } },
      ),
      apartmentsCollection.updateOne(
        { _id: new ObjectId(agreement.apartmentId) },
        { $set: { status: "available" } },
      ),
      agreementsCollection.updateOne(
        { _id: agreement._id },
        { $set: { status: "revoked", decision: "revoked" } },
      ),
    ]);
    if (updateRole.modifiedCount === 0) {
      throw new Error("Failed to update user role");
    }

    if (updateApartment.modifiedCount === 0) {
      console.warn("Apartment status not updated - may already be available");
    }

    if (updateAgreement.modifiedCount === 0) {
      console.warn("Agreement status not updated - may already be revoked");
    }
    res.status(200).json({
      success: true,
      message: "Member successfully downgraded to regular user",
      data: {
        userId,
        email,
        apartmentId: agreement.apartmentId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error during member removal",
    });
  }
};
export { userDataPost, getUserRole, getMembers, removeMemberStatus };
