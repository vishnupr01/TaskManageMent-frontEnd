import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormData from "../interfaces/formInterface";
import { fetchDepartments, registerUser } from "../api/user";
import toast from "react-hot-toast";
import RegisterProps from "../interfaces/register";

const Register: React.FC<RegisterProps> = ({ setChild, setEmail }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentError, setDepartmentError] = useState<string>('')

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const departmentData: any = await fetchDepartments();
        console.log("departmentData:", departmentData);

        if (departmentData !== undefined) {
          setDepartments(departmentData.data.data);
        } // Fetch departments from your API

      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    getDepartments();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser(data);
      if (response.data.status === "success") {
        setChild("otp")
        setEmail(response.data.data.email)
      }

      console.log(response);
    } catch (error: any) {
      console.log(error);
      console.log(error.response.data.message);


      if (error.response.data.message === "Email exists") {
        toast.error("email exists")
        return
      } else if (error.response.data.message === "Department already exists") {
        setDepartmentError("Department exist")
        return
      }

      throw error
    }
  };

  // Watch the role to conditionally render the department input
  const role = watch("role");
  console.log(departments);

  return (
    <form
      className="bg-white p-6 shadow-lg rounded-lg max-w-sm mx-auto overflow-hidden"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Name</label>
        <input
          type="text"
          className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your name"
          {...register("name", { required: "Name is required." })}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Email</label>
        <input
          type="email"
          className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format.",
            },
          })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Password</label>
        <input
          type="password"
          className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long.",
            },
            validate: (value) =>
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) ||
              "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Role</label>
        <select
          className={`w-full p-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          {...register("role", { required: "Role is required." })}
        >
          <option value="">Select Role</option>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      {role === "Employee" && (
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Department</label>
          {departments.length > 0 ? (
            <select
              className={`w-full p-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register("department", { required: "Department is required for employees." })}
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-red-500 text-sm">No departments available.</p>
          )}
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
        </div>
      )}

      {role === "Manager" && (
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Create Department</label>
          <input
            type="text"
            className={`w-full p-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter department name"
            {...register("department", { required: "Department name is required for managers." })}
          />
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
          {departmentError && <p className="text-red-500 text-sm">{departmentError}</p>}
        </div>
      )}

      <button
        type="submit"
        className="w-full p-2 border border-black mt-2 py-1 px-4 rounded-full hover:bg-black hover:text-white transition"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
