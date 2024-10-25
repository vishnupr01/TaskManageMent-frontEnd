import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import Task from "../interfaces/calenderInterface";
import { createTask } from "../api/task";

interface Employee {
  _id: string;     // Unique identifier for the employee
  name: string;    // Employee's name
  email: string;   // Employee's email
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[]; // List of available employees
  currentUser: string;   // Name of the current user
  tasks?: Task[];
  departmentId: string   // Optional: List of tasks to view
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, employees, departmentId, currentUser, tasks }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [assignedTo, setAssignedTo] = useState<string[]>([]); // Multi-select array for the dropdown
  const [assignToSelf, setAssignToSelf] = useState(false); // Checkbox state for assigning task to self
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Effect to handle "Assign to Self" checkbox state
  useEffect(() => {
    if (assignToSelf) {
      if (!assignedTo.includes(currentUser)) {
        setAssignedTo((prev) => [...prev, currentUser]);
      }
    } else {
      setAssignedTo((prev) => prev.filter((user) => user !== currentUser));
    }
  }, [assignToSelf, currentUser]);

  const handleSave = async () => {

    if (!title) {
      setError("Task title is required.");
      return;
    }
    if (end < start) {
      setError("End date cannot be less than start date.");
      return;
    }

    setError(null); // Reset error state

    const newTask: Task = {
      _id: String(Date.now()), // Generate unique ID
      title,
      start,
      end,
      allDay: false,
      assignedTo,
      createdBy: currentUser,
      departmentId: departmentId // Set the current user as the creator of the task
    };

    try {
      // Send the task to the backend API
      console.log("hey newTask", newTask);
     console.log("start date:",start);
     console.log("end date:",end);
     
      const response = await createTask(newTask)
      console.log(response);
      // Replace with your actual endpoint
      onClose(); // Close modal after saving
    } catch (err) {
      console.log(err);

      setError("Failed to create task. Please try again.");
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setAssignedTo(selectedOptions); // Update selected users
  };

  if (!isOpen) return null;
  console.log("assignedTo", assignedTo);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg z-50">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Task Title */}
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        />

        {/* Start and End Dates */}
        <div className="flex flex-wrap mb-4">
          <div className="w-full sm:w-1/2 mb-2 sm:mb-0 pr-2">
            <label>Start Date:</label>
            <input
              type="datetime-local"
              value={start.toISOString().substring(0, 16)}
              onChange={(e) => setStart(new Date(e.target.value))}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label>End Date:</label>
            <input
              type="datetime-local"
              value={end.toISOString().substring(0, 16)}
              onChange={(e) => setEnd(new Date(e.target.value))}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        {/* Assigned Users Multi-select Dropdown */}
        <div className="mb-4">
          <label>Assigned To (Select multiple):</label>
          <select
            multiple
            value={assignedTo}
            onChange={handleSelectChange}
            className="p-2 border rounded w-full h-32"
          >
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {`${employee.name} (${employee.email})`}  {/* Concatenating name and email */}
              </option>
            ))}
          </select>
        </div>

        {/* Assign to Self Checkbox */}
        <div className="mb-4">
          <label>
            <input
              type="checkbox"
              checked={assignToSelf}
              onChange={(e) => setAssignToSelf(e.target.checked)}
              className="mr-2"
            />
            Assign Task to Myself
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-400 text-white rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="p-2 bg-blue-600 text-white rounded">
            Save Task
          </button>
        </div>

        {/* Task View (Optional) */}
        {tasks && tasks.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">View Tasks</h3>
            <ul className="list-disc pl-4">
              {tasks.map((task) => (
                <li key={task._id} className="mb-2">
                  <strong>{task.title}</strong> - {task.start.toLocaleString()} to {task.end.toLocaleString()}
                  <br />
                  <em>Assigned to: {task.assignedTo.join(", ")}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
