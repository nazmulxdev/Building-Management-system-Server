import { ObjectId } from "mongodb";
import { paymentsCollection } from "../../config/db.js";
import { stripe } from "../../config/stripe.js";

const uploadPendingPayment = async (req, res) => {
  try {
    const pendingData = req.body;
    const month = pendingData.month;
    const year = pendingData.year;
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
    const result = await paymentsCollection.insertOne(paymentDoc);
    const id = result.insertedId;
    res.status(200).json({
      success: true,
      message: "Check out successfully, payment for next process",
      id,
      result,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to load apartments details" });
  }
};

const getPendingPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Payment Id is required",
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID format",
      });
    }

    const result = await paymentsCollection.findOne({
      _id: new ObjectId(id),
      status: "pending",
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Pending payment not found",
      });
    }
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to load apartments details" });
  }
};

const paymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res
        .status(400)
        .send({ success: false, message: "Amount is required" });
    }
    const paymentStripeIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.status(200).send({
      success: true,
      clientSecret: paymentStripeIntent.client_secret,
    });
  } catch (error) {
    res
      .status(500)
      .send({ status: false, message: "Stripe payment creation failed" });
  }
};

const updatePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, paymentDate } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Payment Id is required",
      });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID and status are required",
      });
    }

    const pendingPayment = await paymentsCollection.findOne({
      _id: new ObjectId(id),
      status: "pending",
    });

    if (!pendingPayment) {
      return res.status(404).json({
        success: false,
        message: "Pending payment not found",
      });
    }

    const updateData = {
      $set: {
        status: "paid",
        transactionId: transactionId,
        paymentDate: paymentDate || new Date(),
      },
    };

    const result = await paymentsCollection.updateOne(
      { _id: new ObjectId(id) },
      updateData,
    );

    res.status(200).json({
      success: true,
      message: `Payment for the apartment No. ${pendingPayment.apartmentNo} has been successful`,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const paymentHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Member Id is required",
      });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Member ID format",
      });
    }
    const result = await paymentsCollection
      .find({
        userId: id,
        status: "paid",
      })
      .toArray();

    res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  uploadPendingPayment,
  getPendingPaymentById,
  paymentIntent,
  updatePaymentById,
  paymentHistoryById,
};
