import { announcementCollection } from "../../config/db.js";

const postAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }
    const newAnnouncement = {
      title,
      description,
      createdAt: new Date(),
    };
    const result = await announcementCollection.insertOne(newAnnouncement);
    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create announcement",
    });
  }
};

const getAllAnnouncements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const [announcements, total] = await Promise.all([
      announcementCollection
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      announcementCollection.estimatedDocumentCount(),
    ]);

    res.status(200).json({
      success: true,
      data: announcements,
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
      message: "Internal server error",
    });
  }
};

export { postAnnouncement, getAllAnnouncements };
