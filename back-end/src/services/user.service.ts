import { Condition } from "../controllers/auth.controller";
import { User } from "../models/user.model";

// interface UserInstance {
//   id: number;
//   // Add any other properties if necessary
// }

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

const updateUserService = async (updatePassword : any,conditon: Condition): Promise<any | number> => {
  try {
    const result: any = await User.update(updatePassword,conditon);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export { checkUser, findUserId, updateUserService };
