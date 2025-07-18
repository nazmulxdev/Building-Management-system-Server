import { ObjectId } from "mongodb";
import { couponsCollection } from "../../config/db.js";

const postCoupon = async (req, res) => {
  try {
    const { code, discount, description, expiry } = req.body;

    // Validate required fields
    if (!code || !discount || !description || !expiry) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (code, discount, description, expiry) are required",
      });
    }

    // Validate discount is a number between 1-100
    const discountValue = parseInt(discount);
    if (isNaN(discountValue) || discountValue < 1 || discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount must be a number between 1 and 100",
      });
    }

    // Validate expiry date is in the future
    const expiryDate = new Date(expiry);
    if (expiryDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future",
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await couponsCollection.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const newCoupon = {
      code,
      discount: discountValue,
      description,
      expiry: expiryDate,
      status: "active",
      createdAt: new Date(),
      // Add random gradient class
      color: [
        "bg-gradient-to-r from-emerald-500 to-teal-500",
        "bg-gradient-to-r from-amber-500 to-orange-500",
        "bg-gradient-to-r from-purple-500 to-pink-500",
      ][Math.floor(Math.random() * 3)],
    };

    const result = await couponsCollection.insertOne(newCoupon);

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: {
        _id: result.insertedId,
        ...newCoupon,
      },
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create coupon",
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      couponsCollection
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      couponsCollection.estimatedDocumentCount(),
    ]);

    res.status(200).json({
      success: true,
      data: coupons,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
    });
  }
};

const updateCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'inactive'",
      });
    }

    const result = await couponsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon status updated successfully",
    });
  } catch (error) {
    console.error("Error updating coupon status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update coupon status",
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await couponsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete coupon",
    });
  }
};

const getValidCoupons = async (req, res) => {
  try {
    const currentDate = new Date();
    const validCoupons = await couponsCollection
      .find({
        status: "active",
        expiry: {
          $gt: currentDate,
        },
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    res.status(200).json({
      success: true,
      data: validCoupons,
      message:
        validCoupons.length > 0
          ? "Valid coupons retrieved successfully"
          : "No active coupons available",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch valid coupons",
    });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const currentDate = new Date();
    if (!code) {
      return res
        .status(400)
        .send({ success: false, message: "Coupon is required" });
    }
    const coupon = await couponsCollection.findOne({
      code: code,
      status: "active",
      expiry: {
        $gt: currentDate,
      },
    });
    if (!coupon) {
      return res.status(204).json({
        success: false,
        message: "Invalid or expired coupon code",
      });
    }
    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to validate coupon",
    });
  }
};

export {
  postCoupon,
  getAllCoupons,
  updateCouponStatus,
  deleteCoupon,
  getValidCoupons,
  validateCoupon,
};
