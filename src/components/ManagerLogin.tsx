import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// Assuming you have an API function to handle manager login
import LoginFormData from "../interfaces/loginInterface";
import { reSendOtp, userLogin } from "../api/user";
import RegisterProps from "../interfaces/register";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext";

const ManagerLogin: React.FC<RegisterProps> = ({ setChild, setEmail }) => {
  const navigate = useNavigate()
  const { login }:any = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [email, setEmails] = useState<string>("");

  const onSubmit = async (data: LoginFormData) => {
    try {
      setEmails(data.email); // You can keep this to store the email in state if needed elsewhere
      const managerData = { ...data, role: "Manager" };
      // Add custom role "Manager"
      console.log("managerData",managerData);
      
      const response = await userLogin(managerData);
      console.log("Login successful:", response);

      if (response.data.status === "success") {
        toast.success("Login successful");
        login(response.data.token)
        navigate('/')
      } else {
        toast.error("Login failed");
      }
    } catch (error: any) {
      console.log("Login error:", error);
      if (error.response?.data?.message === "password is incorrect") {
        toast.error("Invalid email or password");
        return;
      } else if (error.response?.data?.message === "User not found") {
        toast.error("User not found");
        return;
      } else if (error.response?.data?.message === "trying to loging invalid portal") {
        toast.error("Trying to log in to an invalid portal");
        return;
      } else if (error.response?.data?.message === "User not verified") {
        console.log("email for resend", data.email); // Use data.email directly here
        await reSendOtp(data.email); // Pass data.email instead of state
        setChild("otp");
        setEmail(data.email)
        return;
      }
    }
  };

  return (
    <form
      className="bg-white p-6 shadow-lg rounded-lg max-w-sm mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Manager Login</h2>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Email</label>
        <input
          type="email"
          className={`w-full p-2 border ${errors.email ? "border-red-500" : "border-gray-300"
            } rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format.",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Password</label>
        <input
          type="password"
          className={`w-full p-2 border ${errors.password ? "border-red-500" : "border-gray-300"
            } rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long.",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Hidden role input */}
      <input
        type="hidden"
        value="Manager"
        {...register("role")}
      />

      <button
        type="submit"
        className="w-full p-2 border border-black mt-2 py-1 px-4 rounded-full hover:bg-black hover:text-white transition"
      >
        Login
      </button>
    </form>
  );
};

export default ManagerLogin;
