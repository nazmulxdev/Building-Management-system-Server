import { usersCollection } from "../../config/db.js";

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
    console.log("error from post userdata", error);
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
    console.log("Error from getting userdata", error);
    res.status(500).send({ message: "Internal server Error" });
  }
};

export { userDataPost, getUserRole };
