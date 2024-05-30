const userMassage = {
  success: {
    signUpSuccess: "The user has successfully signed up.",
    signUpSuccessWithEmail:
      "The user has successfully signed up. email sent to your registered email.",
    loginSuccess: "The user has been successfully logged in.",
    profileRetrieved: "The user profile has been successfully retrieved.",
    delete: "User and associated Data deleted successfully",
    update: "User Data updated successfully",
    logout: "Logged out successfully",
    leaveRequest: "Leave request sent successfully",
    leaveStatus: "Leave status retrieved successfully",
    leaveBalance: "Leave balance retrieved successfully",
    leaveApproval: "Leave approved successfully",
    leaveReject: "Leave rejected successfully",
    leaveApprovalWithOutEmailAndUserLeave:
      "Leave approved successfully but leave model not updated and email not send successfully",
    leaveRejectWithOutEmailAndUserLeave:
      "Leave rejected successfully but leave model not updated and email not send successfully",
    studentList: "The list has been retrieved successfully.",
    userDelete: "The user has been deleted successfully.",
    otp: "The OTP has been sent successfully.",
    otpVerify: "The OTP successfully verified.",
    leaveUpdate:
      "The email regarding the update on leave has been sent successfully.",
    leaveUpdateWithOutEmail:
      "The leave was updated successfully. but the email was not sent successfully. please update to user",
    userLeave: "User leave created successfully.",
  },
  error: {
    unauthorized: "Unauthorized - invalid token",
    tokenMissing: "Unauthorized - token missing",
    invalidCredentials: "Invalid credentials",
    userNotFound: "User not found",
    genericError: "An error occurred. please try again later.",
    signUpError: "The user sign-up process was unsuccessful.",
    passwordNotMatch: "The password and confirm password do not match.",
    invalidEmail:
      "There is already a user registered with this email address.",
    wrongPassword: "Wrong password",
    fillDetails: "Please provide the details of the user.",
    uploadImage: "The image upload was unsuccessful.",
    password: "Your password should be between 4-20 characters!",
    delete: "The user's details were not deleted.",
    update: "The user's data was not updated successfully.",
    leaveRequest: "The leave request was not sent successfully.",
    leaveStatus: "Leave request has already been approved or rejected.",
    leaveStatusError: "You cannot modify the status of your leave.",
    leaveRequestLimit:
      "You have already requested a leave twice and wait for the approval.",
    studentList: "The student list has not been retrieved successfully.",
    studentUpdateRole: "This individual is not a student.",
    hodUpdateRole: "This person is not a head of department.",
    facultyUpdateRole: "This person is not a member of the faculty.",
    userDelete: "The deletion of the user was not successful.",
    otp: "The OTP was not sent successfully.",
    otpVerify: "The OTP not successfully verified.",
    otpTime:
      "The OTP has not been sent successfully.please wait for some time.",
    userLeave: "User leave not created successfully.",
    mail: "The email was not sent successfully.",
    leaveApproval: "Leave not approved successfully",
    leaveReject: "Leave not rejected successfully",
    userLeaveRec: "User leave not recorded successfully",
  },
};

export {userMassage};
