import * as Yup from "yup";

export const loginValidation = Yup.object({
  email: Yup.string()
    .email("Please Enter Valid email")
    .required("Please Enter email"),
  password: Yup.string().min(5).required("Please Enter Password"),
});

export const settingValidation = Yup.object({
  name: Yup.string()
    .min(2, "Name should be at least 2 characters")
    .required("Please enter your name"),
  gender: Yup.string()
    .oneOf(["male", "female"], "Please select a valid gender")
    .required("Please select your gender"),
  // image: Yup.string()
  //   .url("Please enter a valid URL")
  //   .required("Please enter the image URL"),
  phone: Yup.string()
    .matches(/^\+?\d{10}$/, "Please enter a valid 10-digit phone number")
    .required("Please enter your phone number"),
  address: Yup.string()
    .min(5, "Address should be at least 5 characters")
    .required("Please enter your address"),
  department: Yup.string()
    .min(2, "department should be at least 2 characters")
    .required("Please enter your department"),
});
