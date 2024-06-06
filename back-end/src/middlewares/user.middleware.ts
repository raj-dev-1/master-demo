import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import fs from "fs";
import { SECRET_KEY } from "../config/constant";
import { userMassage } from "../config/message";
import { roleByName } from "../config/variables";

const getUser = async (data: { email: string; id: string }) => {
  try {
    const { email, id } = data;
    const getUserDetails = await User.findOne({
      where: { email, id },
      attributes: { exclude: ["password"] },
    });
    return getUserDetails;
  } catch (error) {
    throw error;
  }
};

const verifyToken = (role?: string[]): any => {
  return async (
    req: Request | any,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const token = await req.cookies["jwt"];

    if (!token)
      return res.status(403).json({ message: userMassage.error.tokenMissing });

    jwt.verify(
      token,
      SECRET_KEY,
      async (err: any, decoded: any): Promise<any> => {
        try {
          if (err)
            return res
              .status(401)
              .json({ message: userMassage.error.unauthorized });
          
          const userDetails: any = await getUser(decoded.userDetails);

          if (!userDetails)
            return res
              .status(401)
              .json({ message: userMassage.error.unauthorized });

          req.user = userDetails;

          if (role && role.length > 0) {
            const userRole = roleByName[userDetails.roleId];
            if (!role.includes(userRole)) {
              if (req.file) await fs.unlinkSync(req.file.path);
              return res.status(403).json({
                message: `Forbidden: ${role.join(" or ")} access required`,
              });
            }
          }
          next();
        } catch (error) {
          console.log(error);
          return res
            .status(401)
            .json({ message: userMassage.error.unauthorized });
        }
      }
    );
  };
};

export { verifyToken };
