import React, { useState } from "react";
import axios from "axios";

const AddStudent = ({ onStudentAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStudent = { name, email, dob };
    
    try {
      await axios.post("http://localhost:8080/api/v1/student", newStudent, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Student added successfully!");
      onStudentAdded(); // Refresh student list after adding
      setName("");
      setEmail("");
      setDob("");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  return (
    <div>
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
