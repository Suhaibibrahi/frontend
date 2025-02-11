// src/components/AdminDashboard/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../apiClient"; // Corrected relative path
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // The token is automatically attached by the apiClient interceptor
        const response = await apiClient.get("/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err.response ? err.response.data : err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  // Approve pending user
  const handleApprove = async (email) => {
    try {
      await apiClient.put(`/approve/${email}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.personalEmail === email ? { ...u, status: "approved" } : u
        )
      );
    } catch (err) {
      console.error("Error approving user:", err.response ? err.response.data : err);
      alert("Failed to approve user. Please try again.");
    }
  };

  // Deny pending user
  const handleDeny = async (email) => {
    try {
      await apiClient.put(`/deny/${email}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.personalEmail === email ? { ...u, status: "denied" } : u
        )
      );
    } catch (err) {
      console.error("Error denying user:", err.response ? err.response.data : err);
      alert("Failed to deny user. Please try again.");
    }
  };

  // Promote a regular user (role "user") to admin
  const handleAssignAdmin = async (email) => {
    try {
      await apiClient.put(`/assign-admin/${email}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.personalEmail === email ? { ...u, role: "admin" } : u
        )
      );
    } catch (err) {
      console.error("Error promoting user to admin:", err.response ? err.response.data : err);
      alert("Failed to promote user. Please try again.");
    }
  };

  // Demote an admin to a regular user
  const handleDemote = async (email) => {
    try {
      // This assumes you have implemented a demotion endpoint in your backend:
      await apiClient.put(`/demote/${email}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.personalEmail === email ? { ...u, role: "user" } : u
        )
      );
    } catch (err) {
      console.error("Error demoting user:", err.response ? err.response.data : err);
      alert("Failed to demote user. Please try again.");
    }
  };

  // Delete a user (if not owner)
  const handleDeleteUser = async (email) => {
    try {
      // This assumes you have implemented a DELETE endpoint in your backend:
      await apiClient.delete(`/delete-user/${email}`);
      setUsers((prev) => prev.filter((u) => u.personalEmail !== email));
    } catch (err) {
      console.error("Error deleting user:", err.response ? err.response.data : err);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-heading">Users Status</h1>
      <p>Welcome to the Admin Dashboard. Here you can approve, promote/demote, or remove user accounts.</p>
      {error && <p className="error-message">{error}</p>}
      {!error && users.length === 0 && <p>Loading user data...</p>}
      {users.length > 0 && (
        <table className="user-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.name || "Not Set"}</td>
                <td>{u.personalEmail}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>{u.userType || "-"}</td>
                <td>
                  {u.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(u.personalEmail)} className="approve-button">
                        Approve
                      </button>
                      <button onClick={() => handleDeny(u.personalEmail)} className="deny-button">
                        Deny
                      </button>
                    </>
                  )}
                  {u.status === "approved" && u.role === "user" && (
                    <button onClick={() => handleAssignAdmin(u.personalEmail)} className="assign-admin-button">
                      Promote to Admin
                    </button>
                  )}
                  {u.status === "approved" && u.role === "admin" && (
                    <button onClick={() => handleDemote(u.personalEmail)} className="demote-button">
                      Demote to User
                    </button>
                  )}
                  {u.role !== "owner" && (
                    <button onClick={() => handleDeleteUser(u.personalEmail)} className="delete-button">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
