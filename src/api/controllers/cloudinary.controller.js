const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      message: "No file uploaded",
    });
  }
  res.status(200).json({
    message: "Image is uploaded successfully",
    secure_url: req.file.path,
  });
};

export { uploadImage };
