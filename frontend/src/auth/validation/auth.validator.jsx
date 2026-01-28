import * as Yup from "yup";

export const validationAuthSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$_!%*?&]).{6,}$/,
      "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
});