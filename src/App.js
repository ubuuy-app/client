import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { PurchaseContextProvider } from 'contexts/PurchaseContext';

/* NOT AUTHENTICATED PAGES -> no logged in users, no data contexts */
import About from 'components/pages/About/About';
import Login from 'components/pages/Login/Login';
import RegisterOrganizationOwner from 'components/pages/RegisterOrganizationOwner/RegisterOrganizationOwner';

/* PROFILE PAGES -> logged in (authenticated) users with data contexts */
import ProfilePage from 'components/Routers/ProfilePage/ProfilePage';
import Dashboard from 'components/pages/Dashboard/Dashboard';
import Purchases from 'components/pages/Purchases/Purchases';

/* HOC */
import withNavbar from 'components/hoc/withNavbar';
import withPurchaseContext from 'components/hoc/withPurchaseContext';
import withAuthContext from 'components/hoc/withAuthContext';

import './App.css';
function App() {

  return (

    <div className="App">
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-organization-owner" element={<RegisterOrganizationOwner />} />

        <Route path="/profile" element={withAuthContext(withPurchaseContext(withNavbar(ProfilePage)))}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="purchases" element={<Purchases />} />
        </Route>
      </Routes>

      {/* <Route path="/.well-known/first-party-set" element={JSON.stringify("test")} /> */}
    </div>

  );
}

export default App;
