// src/components/UsersStatus/UsersStatus.js
import React, { useEffect, useState } from "react";
import "./UsersStatus.css";

function UsersStatus() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-email": localStorage.getItem("userEmail"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const err = await response.json();
          setError(err.message || "Failed to fetch users.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/approve/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail"),
        },
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.personalEmail === email ? { ...u, status: "approved" } : u))
        );
      } else {
        alert("Failed to approve user. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  const handleDeny = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/deny/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail"),
        },
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.personalEmail === email ? { ...u, status: "denied" } : u))
        );
      } else {
        alert("Failed to deny user. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="users-status">
      <h1>Users Status</h1>
      <p>Welcome to the Admin Dashboard. Approve or deny user accounts below.</p>
      {error && <p className="error-message">{error}</p>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx}>
              <td>{user.fullName || "Not Set"}</td>
              <td>{user.personalEmail}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                {user.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(user.personalEmail)} className="approve-btn">
                      Approve
                    </button>
                    <button onClick={() => handleDeny(user.personalEmail)} className="deny-btn">
                      Deny
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersStatus;
