import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if Cloudinary credentials are set
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;

    if (!hasCloudinary) {
        // Fallback to local storage
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}-${safeName}`;

        // Define upload directory: public/uploads
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            await fs.promises.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);

        // Write file
        await fs.promises.writeFile(filePath, buffer);

        // Return public URL path
        return `/uploads/${fileName}`;
    }

    // Cloudinary upload logic
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'sattys-products',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload failed'));
                }
            }
        );

        uploadStream.end(buffer);
    });
}
