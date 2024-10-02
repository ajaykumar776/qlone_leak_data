import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [baseUrl, setBaseUrl] = useState(''); // State to store the base URL
  const [totalRecords, setTotalRecords] = useState(0); // New state to store total records
  const limit = 100;

  // Fetch data from API
  const fetchData = async (cursorValue) => {
    if (!baseUrl) {
      alert('Please enter a valid base URL');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}`, {
        params: {
          cursor: cursorValue,
          limit: limit,
        },
      });

      const { results, remaining: rem, cursor: nextCursor } = response.data.response;
      setData(results);
      setCursor(nextCursor);
      setRemaining(rem);
      setTotalRecords(rem + limit); // Calculate total records
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Fetch data when the user sets the base URL
  useEffect(() => {
    if (baseUrl) {
      fetchData(0); // Fetch data from the first page
    }
  }, [baseUrl]);

  // Handle next page click
  const handleNextPage = () => {
    if (remaining > 0) {
      fetchData(cursor + limit);
    }
  };

  // Handle previous page click
  const handlePreviousPage = () => {
    if (cursor > 0) {
      fetchData(cursor - limit);
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(user =>
    user['🔴 firstName']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user['🔴 lastName']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.authentication.email.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

      {/* Base URL Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Base URL (e.g., https://www.qloneapp.com/version-test/api/1.0/obj/user)"
          className="border border-gray-300 rounded-lg py-2 px-4 w-full"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>

      {/* Total Records */}
      <p className="mb-4 text-gray-700">Total Users in the System: {totalRecords}</p>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name or Email"
          className="border border-gray-300 rounded-lg py-2 px-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left py-3 px-4 font-semibold">First Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Last Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Mobile</th>
                  <th className="text-left py-3 px-4 font-semibold">Program</th>
                  <th className="text-left py-3 px-4 font-semibold">Profile Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-3 px-4">{user['🔴 firstName'] || '-'}</td>
                    <td className="py-3 px-4">{user['🔴 lastName'] || '-'}</td>
                    <td className="py-3 px-4">{user.authentication.email.email || '-'}</td>
                    <td className="py-3 px-4">{user['🔴 mobile'] || '-'}</td>
                    <td className="py-3 px-4">{user.current_main_programme || '-'}</td>
                    <td className="py-3 px-4">{user['🔴 isProfileCompleted'] ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className={`px-4 py-2 rounded-lg bg-blue-500 text-white ${
                cursor === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handlePreviousPage}
              disabled={cursor === 0}
            >
              Previous
            </button>
            <span className="text-gray-700">Showing {cursor + 1} - {cursor + limit} users</span>
            <button
              className={`px-4 py-2 rounded-lg bg-blue-500 text-white ${
                remaining === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleNextPage}
              disabled={remaining === 0}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
