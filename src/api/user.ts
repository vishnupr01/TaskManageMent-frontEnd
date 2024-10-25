import FormData from "../interfaces/formInterface";
import LoginFormData from "../interfaces/loginInterface";
import Api from "../services/axios"
import userRoutes from "../services/endpoints/userEndpoints"

export const registerUser = async (formData: FormData) => {
  console.log(formData);

  try {
    const response = await Api.post(userRoutes.signUp, {
      formData
    })
    return response
  } catch (error) {
    throw error
  }

}
export const fetchDepartments = async () => {
  try {
    const response = await Api.get(userRoutes.getDepartments)
    return response
  } catch (error) {
    throw error
  }
}
export const userLogin = async (data: LoginFormData) => {
  try {
    console.log("checking data", data);

    const response = await Api.post(userRoutes.loginUser, { data })
    return response
  } catch (error) {
    throw error
  }
}
export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await Api.post(userRoutes.otpVerification, { email, otp })
    return response
  } catch (error) {
    throw error
  }


}
export const reSendOtp = async (email: string) => {
  try {
    const response = await Api.post(userRoutes.otpResend, { email })
    return response
  } catch (error) {
    throw error
  }


}
export const isUserVerifed = async () => {
  try {
    const response = await Api.get(userRoutes.verifyToken)
    return response
  } catch (error) {
    throw error
  }

}