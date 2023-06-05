import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderMain from './components/Header';
import NewVesting from './components/NewVesting';
import WhiteList from './components/WhiteList';
import LandingPage from './components/LandingPage';
import LockForm from './components/LockForm';
import CurrentVesting from './components/CurrentVesting';
import VestingDetail from './components/VestingDetail';
import { createContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';

export const AppContext = createContext();

function App() {
  const [WalletConnection, setWalletConnection] = useState(false)
  const [whitemod_flag, setWhitemodflag] = useState(false)


  return (
    <AppContext.Provider value={{ WalletConnection, setWalletConnection, whitemod_flag, setWhitemodflag }}>
      <ToastContainer />
      <Router>
        <div className="text-center flex flex-col h-screen">

          <HeaderMain />
          <Routes>
            <Route path='/'>
              <Route index element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
            </Route>
            <Route path="/newVesting" element={<NewVesting />} />

            <Route path="/currentVesting" element={<CurrentVesting />} />
            <Route path="/lockToken" element={<LockForm />} />
            <Route path="/vestingDetail/:vestingId" element={<VestingDetail />} />
            <Route path="/whitelist" element={<WhiteList />} />

          </Routes>
          <Footer className='self-end' />

        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
