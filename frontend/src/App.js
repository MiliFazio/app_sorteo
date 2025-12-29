import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateRaffle from './components/CreateRaffle';
import AccessResult from './components/AccessResult';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-purple-600">
                  🎁 Raffle App
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-md text-purple-600 hover:bg-purple-50 font-medium"
                >
                  Create Raffle
                </Link>
                <Link
                  to="/access"
                  className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 font-medium"
                >
                  Access Result
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<CreateRaffle />} />
          <Route path="/access" element={<AccessResult />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
