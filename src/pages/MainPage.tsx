import React, { useContext, useEffect, useState } from 'react';
import Home from '../components/Home';
import { logOutUser } from '../api/user';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contex/AuthContext';

const Header = () => {
  const { logout, isUser }: any = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState<string>('')
  const [role,setRole] = useState<string>('')

  useEffect(() => {
    checkVerified()
  }, [])
  const checkVerified = async () => {
    try {
      const { name,role } = await isUser()
      setName(name)
      setRole(role)
    } catch (error) {

    }
  }
  const handleLogout = async () => {
    try {
      const response = await logOutUser();
      logout();
      navigate('/login');
      console.log(response, "user logout");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <div className='border-y border-black opacity-55'>
        <header className="flex justify-between items-center p-4 bg-white-600 text-black">
          <h1 className="text-xl">Task Management</h1>
          <div className="flex items-center">
            <div className="flex items-center justify-center mr-5 w-8 h-8 rounded-full border border-black bg-violet-600 text-white font-bold">
              {role === 'Manager' ? 'M' : 'E'}
            </div>
            <span className=" mr-20 text-xl text-black">{name}</span>
            <button
              className="border border-black mt-2  py-1 px-4  rounded-full hover:bg-black hover:text-white transition ml-4"
              onClick={handleLogout} // Attach the logout function to the button
            >
              Logout
            </button>
          </div>
        </header>
      </div>
      <Home />
    </div>
  );
};

export default Header;
