import React from 'react';
import './App.css';
import './index.css';
import ParentComponent from './pages/ParentComponent';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import { AuthProvider } from './contex/AuthContext';
import { ProtectedRoutes } from './protected/Protected';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>

          <Toaster />

          {/* Add the Header here */}
          <Routes>
          <Route path='/login' element={<ParentComponent />} />
            <Route path='/' element={<ProtectedRoutes>
              <Home />
            </ProtectedRoutes>} />
            

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
