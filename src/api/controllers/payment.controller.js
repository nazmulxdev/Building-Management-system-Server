import { paymentsCollection } from "../../config/db.js";

const uploadPendingPayment = async (req, res) => {
  try {
    const pendingData = req.body;
    const month = pendingData.month;
    const year = pendingData.year;
    console.log(pendingData);
    console.log(month);
    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Require Date for payment",
      });
    }
    const paymentsData = await paymentsCollection
      .find({
        apartmentId: pendingData.apartmentId,
        month: month,
        year: year,
        status: {
          $in: ["pending", "paid"],
        },
      })
      .toArray();

    if (paymentsData.length > 0) {
      const paidPayment = paymentsData.find((p) => p.status === "paid");
      const pendingPayment = paymentsData.find((p) => p.status === "pending");

      if (paidPayment) {
        return res.status(409).json({
          success: false,
          message: "Payment already completed for this month",
        });
      }

      if (pendingPayment) {
        return res.status(200).send({
          success: true,
          message:
            "You have already an existing pending payment for this month. Using existing pending payment.",
          id: pendingPayment._id,
        });
      }
    }
    const paymentDoc = {
      status: "pending",
      createdAt: new Date(),
      ...pendingData,
    };
    console.log(paymentDoc);
    const result = await paymentsCollection.insertOne(paymentDoc);
    const id = result.insertedId;
    res.status(200).json({
      success: true,
      message: "Check out successfully, payment for next process",
      id,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to load apartments details" });
  }
};

export { uploadPendingPayment };
