import 'express';

declare global {
  namespace Express {
    // Let TS know about req.file/req.files from multer
    interface Request {
      file?: any;
      files?: any;
    }
  }
}

