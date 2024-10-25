import { useContext, useEffect, useState } from "react";
import Register from '../components/Register';
import ManagerLogin from '../components/ManagerLogin';
import EmployeeLogin from '../components/EmployeeLogin';
import taskImage from '../../src/assets/taskImage.jpg';
import Otp from "../components/OtpPage";
import { AuthContext } from "../contex/AuthContext";
import { useNavigate } from "react-router-dom";

const ParentComponent: React.FC = () => {
  const navigate = useNavigate()
  const [selectedForm, setSelectedForm] = useState<string>("managerLogin");
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated }: any = useContext(AuthContext)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const handleEmail = (data: string) => {
    console.log("isedaaa", data);

    setEmail(data);
    setLoading(false);

  }

  const handleSelectedForm = (data: string) => {

    setSelectedForm(data);

  };
  // useEffect(() => {
  //   console.log("loading",loading);


  //     delay()
  // }, [email])
  // const delay = () => {
  //   alert('hey')
  //   setTimeout(() => {
  //     setSelectedForm('otp');
  //   }, 3000);

  // }
  // Adjust the delay time (in milliseconds) as needed


  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left section */}
      <div className={`flex-1 bg-white text-black border-y border-black border-opacity-30 flex flex-col items-center justify-center pt-8 px-4 md:px-0 ${selectedForm === "register" ? "min-h-[85vh]" : "max-h-[80vh]"}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Manage Your Tasks Efficiently</h2>
        <p className="text-center mb-4">
          Organize, prioritize, and track tasks easily to stay on top of your work.
        </p>
        <img src={taskImage} alt="Illustration" className="mt-4 w-3/4 md:w-1/3" />
        <button
          onClick={() => setSelectedForm("register")}
          className="border border-black mt-2 py-1 px-4 rounded-full hover:bg-black hover:text-white transition"
        >
          Sign Up
        </button>
      </div>

      {/* Right section (dynamic content) */}
      <div className={`flex-1 bg-gray-100 flex flex-col items-center justify-center p-4 pt-8 ${selectedForm === "register" ? "min-h-[85vh]" : "max-h-[80vh]"}`}>
        <div className="w-full max-w-sm">
          {/* Buttons for toggling between forms */}
          {selectedForm !== 'otp' && <div className="flex gap-4 mb-4 justify-center">
            <button
              className={`px-3 py-1 rounded ${selectedForm === "register" ? "bg-gray-500 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedForm("register")}
            >
              Register
            </button>
            <button
              className={`px-3 py-1 rounded ${selectedForm === "managerLogin" ? "bg-gray-500 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedForm("managerLogin")}
            >
              Manager Login
            </button>
            <button
              className={`px-3 py-1 rounded ${selectedForm === "employeeLogin" ? "bg-gray-500 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedForm("employeeLogin")}
            >
              Employee Login
            </button>
          </div>}

          {/* Dynamic forms based on the selectedForm state */}
          {selectedForm === "register" && <Register setChild={handleSelectedForm} setEmail={handleEmail} />}
          {selectedForm === "managerLogin" && <ManagerLogin setChild={handleSelectedForm} setEmail={handleEmail} />}
          {selectedForm === "employeeLogin" && <EmployeeLogin setChild={handleSelectedForm} setEmail={handleEmail} />}
          {selectedForm === "otp" && <Otp email={email} />}
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;
