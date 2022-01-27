import { Routes, Route } from "react-router-dom"
import './App.css';
import { useContext } from 'react';
import { useAuth } from 'contexts/AuthContext';

import * as authService from 'services/authService';
import * as userService from 'services/userService';

import Dev from 'components/Dev';
import RegisterOrganizationOwner from 'components/RegisterOrganizationOwner/RegisterOrganizationOwner';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/register-organization-owner" element={<RegisterOrganizationOwner />} />
        <Route path="/dev" element={<Dev />} />
        <Route path="/.well-known/first-party-set" element={JSON.stringify("test")} />

      </Routes>
    </div>
  );
}

export default App;
