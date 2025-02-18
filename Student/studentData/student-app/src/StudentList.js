import React, { useEffect, useState } from "react";
import axios from "axios";
import AddStudent from "./AddStudent";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = () => {
    axios
      .get("http://localhost:8080/api/v1/student")
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching students");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Student List</h2>
      <AddStudent onStudentAdded={fetchStudents} />
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <strong>{student.name}</strong> - {student.email} - Age: {student.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
