import * as Yup from 'yup';

export const loginValidation = Yup.object({
    email: Yup.string().email("Please Enter Valid email").required("Please Enter email"),
    password: Yup.string().min(5).required("Please Enter Password")

});