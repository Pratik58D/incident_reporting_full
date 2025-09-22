import multer from "multer";
import type { FileFilterCallback, StorageEngine } from "multer";

import path from "path";
import fs from "fs"

//removing special charecter and white space from filename

const re = /\s+/g;
const sanitizeFileName = (name: string) =>
  name.replace(re, "-").replace(/[^a-zA-Z0-9_\-\.]/g, "");

const createStorage = (folderName : string) : StorageEngine =>{
    const uploadPath = path.join(process.cwd(), "uploads", folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination : (_req , _file ,cb) => cb(null,uploadPath),
     filename: (_req, file, cb) => {
      const lastDot = file.originalname.lastIndexOf(".");
      const base = file.originalname.substring(0, lastDot);
      const ext = file.originalname.substring(lastDot);
      cb(null, `${sanitizeFileName(base)}-${Date.now()}${ext}`);
    },

  })

};


// File filter
// const fileFilter = (
//   _req: Express.Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) => {
//   const allowed = [
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "video/mp4",
//     "image/gif",
//     "application/pdf",
//   ];

//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Invalid file type."));
// };

// Factory function for creating multer instances
const createUploader = (folderName: string) =>
  multer({ 
    storage: createStorage(folderName), 
    limits: { fileSize: 5 * 1024 * 1024 } 
    });

export const incidentUpload = createUploader("incident");
export const messageUpload = createUploader("message");