import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function AccessResult() {
  const [accessCode, setAccessCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/result/${accessCode}`);
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid access code');
      setLoading(false);
    }
  };

  const reset = () => {
    setAccessCode('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          🔍 Access Your Result
        </h2>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Your Access Code
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-mono font-bold tracking-wider focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="XXXXXXXX"
                maxLength="8"
                required
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Enter the 8-character code you received from the raffle organizer
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Checking...' : 'View My Result'}
            </button>
          </form>
        ) : (
          <div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🎉 Hello, {result.name}!
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-gray-600 mb-2">Your assigned category is:</p>
                <p className="text-3xl font-bold text-purple-600 mb-4">{result.category}</p>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-600">Your access code:</p>
                  <p className="text-xl font-mono font-bold text-gray-800">{result.code}</p>
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Check Another Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessResult;
