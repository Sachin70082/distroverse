import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AppBars from './Components/AppBars.jsx';
import Footer from './Components/Footer.jsx';
import Home from './Components/Home.jsx';
import Upload from './Components/Upload.jsx';
import Accounting from './Components/Accounting.jsx';

import Login from './Components/Login.jsx';

import Cookies from 'js-cookie';

const DefaultLayout = ({ children }) => {
  return (
    <>
      <AppBars />
      {children}
      <Footer />
    </>
  );
};

function App() {
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setUserData(storedToken);
    }
    setLoading(false); // Set loading to false once user data check is done
  }, []);

  // Render nothing until loading is complete
  if (loading) {
    return null;
  }
  
  return (
    <Routes>
      <Route
        path="/login"
        element={userData ? <Home /> : <Login setUserData={setUserData} />}
      />
      <Route
        path="/*"
        element={userData ? <ProtectedRoutes /> : <Login setUserData={setUserData} />}
      />
    </Routes>
  );
};

const ProtectedRoutes = () => {
  return (
    <DefaultLayout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="accounting" element={<Accounting />} />
      </Routes>
    </DefaultLayout>
  );
};


export default App
