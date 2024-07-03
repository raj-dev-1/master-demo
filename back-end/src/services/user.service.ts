import { Query } from "../controllers/auth.controller";
import { User } from "../models/user.model";

const checkUser = async (email: string): Promise<any | false> => {
  try {
    const user = await User.findOne({ where: { email } });
    return user ? user : false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const findUserId = async (email: string): Promise<any | number> => {
  try {
    const findUserDetails: any = await User.findOne({ where: { email } });
    if (findUserDetails) return findUserDetails.id;
  } catch (error) {
    console.log(error);
  }
};

const updateUserService = async (updatePassword : any,query: Query): Promise<any | number> => {
  try {
    const result: any = await User.update(updatePassword,query);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const createUserService = async (data:any): Promise<any | number> => {
  try {
    const result: any = await User.create(data);
    return result;
  } catch (error) {
    console.log(error);
  }
};


export { checkUser, findUserId,createUserService, updateUserService };
