// Header.js
import React, { useContext } from 'react';
import Home from '../components/Home';
import { logOutUser } from '../api/user';
import { AuthContext } from '../contex/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { logout }: any = useContext(AuthContext);
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const response = await logOutUser()
      logout()
      navigate('/login')
      console.log(response, "user logout");



    } catch (error) {
      throw error
    }

  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <h1 className="text-xl">My Application</h1>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={()=>handleLogout()} // Attach the logout function to the button
        >
          Logout
        </button>
      </header>
      <Home />
    </div>
  );
};

export default Header;
