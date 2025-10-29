import type { Request, Response , NextFunction } from "express";

export const errorMiddleware = (
    error:unknown,
    req: Request,
    res: Response,
    next: NextFunction
) =>{
    console.error("Error occured: ",error)

    // extracting error message
    const message = error instanceof Error ? error.message : "Something went wrong";

    // using existing status code if set , otherwise default to 500
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    return res.status(statusCode).json({
        success :false ,
        error : message || "Internal server error"
    })
}