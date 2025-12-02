import cloudinary from "../../config/cloudinary";

export const uploadImageToCloudinary = (fileBuffer: Buffer, folder = "ctrl-f-images"): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url ?? "");
      }
    );

    stream.end(fileBuffer);
  });
};
