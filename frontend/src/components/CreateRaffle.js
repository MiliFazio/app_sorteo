import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function CreateRaffle() {
  const [raffleName, setRaffleName] = useState('');
  const [participants, setParticipants] = useState([{ name: '' }]);
  const [categories, setCategories] = useState(['']);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addParticipant = () => {
    setParticipants([...participants, { name: '' }]);
  };

  const removeParticipant = (index) => {
    const updated = participants.filter((_, i) => i !== index);
    setParticipants(updated);
  };

  const updateParticipant = (index, value) => {
    const updated = [...participants];
    updated[index].name = value;
    setParticipants(updated);
  };

  const addCategory = () => {
    setCategories([...categories, '']);
  };

  const removeCategory = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  const updateCategory = (index, value) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    const validParticipants = participants.filter(p => p.name.trim() !== '').map((p, index) => ({
      name: p.name,
      email: `${p.name.toLowerCase().replace(/\s+/g, '')}.${index}.${Date.now()}@raffle.local`
    }));
    const validCategories = categories.filter(c => c.trim() !== '');

    if (!raffleName || validParticipants.length === 0 || validCategories.length === 0) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/raffles`, {
        name: raffleName,
        participants: validParticipants,
        categories: validCategories,
      });

      setPreview(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating raffle');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRaffleName('');
    setParticipants([{ name: '' }]);
    setCategories(['']);
    setPreview(null);
    setError('');
  };

  if (preview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
            🎉 Raffle Created Successfully!
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Results:</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share these access codes with participants so they can view their assigned category.
            </p>
            <div className="space-y-3">
              {preview.participants.map((participant, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg text-gray-800">{participant.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Category:</p>
                      <p className="text-lg font-bold text-purple-600">{participant.category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: <span className="font-mono font-bold text-purple-700">{participant.accessCode}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={resetForm}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Create New Raffle
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Create New Raffle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Raffle Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Raffle Name *
            </label>
            <input
              type="text"
              value={raffleName}
              onChange={(e) => setRaffleName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Christmas Gift Exchange"
              required
            />
          </div>

          {/* Participants */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Participants *
              </label>
              <button
                type="button"
                onClick={addParticipant}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                + Add Participant
              </button>
            </div>
            <div className="space-y-3">
              {participants.map((participant, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Participant name"
                  />
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Categories (Items to Raffle) *
              </label>
              <button
                type="button"
                onClick={addCategory}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                + Add Category
              </button>
            </div>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Chocolate, Makeup, Book"
                  />
                  {categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
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
            {loading ? 'Creating Raffle...' : '🎲 Create Raffle & Assign Categories'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRaffle;
