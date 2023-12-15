import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AppBars from './components/AppBars.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import Upload from './components/Upload.jsx';
import Accounting from './components/Accounting.jsx';

import Login from './components/Login.jsx';

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
