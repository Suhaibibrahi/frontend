import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css'; // Create a separate CSS file for styling

function Admin() {
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // Success or error
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setFeedback('Error fetching users.');
        setFeedbackType('error');
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const approveUser = async (email) => {
    try {
      await axios.put(`http://localhost:5000/approve/${email}`);
      setFeedback(`User ${email} approved successfully!`);
      setFeedbackType('success');
      setUsers(users.filter(user => user.email !== email)); // Remove the user from the list
    } catch (err) {
      setFeedback('Error approving user.');
      setFeedbackType('error');
    }
  };

  const clearFeedback = () => setFeedback('');

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      {feedback && (
        <div
          className={`feedback-message ${feedbackType}`}
          onClick={clearFeedback}
        >
          {feedback}
        </div>
      )}

      {loading ? (
        <p>Loading pending users...</p>
      ) : users.length === 0 ? (
        <p>No pending users to approve.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.email}>
                <td>{user.email}</td>
                <td>
                  <button
                    className="approve-button"
                    onClick={() => approveUser(user.email)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
