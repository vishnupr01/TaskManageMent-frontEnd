import React, { useState, useEffect } from "react";
import Task from "../interfaces/calenderInterface";
import { taskAssigned } from "../api/task";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onEdit: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  userRole: string;
  unassignedEmployees: { _id: string; name: string }[]; // Array of unassigned employee objects
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onEdit,
  onDelete,
  userRole,
  unassignedEmployees,
}) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [error, setError] = useState<{ title?: string; date?: string }>({});
  const [employees, setEmployees] = useState<any[]>([]);

  // Prepopulate the assigned users when a task is selected for editing
  useEffect(() => {
    if (editedTask) {
      setSelectedUsers(editedTask.assignedTo);
    }
  }, [editedTask]);

  const handleEditTask = (task: Task) => {
    fetchCurrentlyAssigned(task._id);
    setEditedTask(task);
    setSelectedUsers(task.assignedTo);
  };

  const fetchCurrentlyAssigned = async (taskId: any) => {
    try {
      console.log("Getting taskId:", taskId);
      const response = await taskAssigned(taskId);
      console.log(response.data.data, "Current assigned users");
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching assigned users:", error);
    }
  };

  const handleSaveEdit = () => {
    if (!validateInputs()) return;

    if (editedTask) {
      onEdit({ ...editedTask, assignedTo: selectedUsers });
      setEditedTask(null); // Reset after saving
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedUsers(selectedOptions);
  };

  const handleRemoveAssigned = (employeeId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user !== employeeId));
  };

  const validateInputs = () => {
    const errors: { title?: string; date?: string } = {};

    if (!editedTask?.title.trim()) {
      errors.title = "Title is required";
    }

    if (editedTask && editedTask.start >= editedTask.end) {
      errors.date = "End date must be later than start date";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  console.log(userRole, "userRole");

  if (!isOpen) return null;

  // Filter unassigned employees to exclude those who are already assigned
  const filteredUnassignedEmployees = unassignedEmployees.filter(
    (unassigned) => !employees.some((assigned) => assigned._id === unassigned._id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl z-50">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>

        {/* Scrollable task list */}
        <div className="max-h-60 overflow-auto mb-4">
          <ul className="list-disc pl-4">
            {tasks.map((task) => (
              <li key={task._id} className="mb-2">
                <strong>{task.title}</strong> - {task.start.toLocaleString()} to {task.end.toLocaleString()}
                {userRole === "Manager" && !editedTask && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="bg-black text-white font-semibold py-1 px-1 rounded transition duration-200 hover:bg-green-600 min-w-[70px] min-h-[20px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task._id)}
                      className="bg-black text-white font-semibold py-1 px-1 ml-2 rounded transition duration-200 hover:bg-green-600 min-w-[70px] min-h-[20px]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {editedTask && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Editing: {editedTask.title}</h3>

            {/* Task Title Edit */}
            <input
              type="text"
              placeholder="Task Title"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask((prev) => (prev ? { ...prev, title: e.target.value } : prev))
              }
              className={`p-2 border rounded-full mb-2 w-full ${error.title ? "border-red-500" : ""}`}
            />
            {error.title && <p className="text-red-500 text-sm">{error.title}</p>}

            {/* Start and End Dates */}
            <div className="flex flex-wrap mb-2">
              <div className="w-full sm:w-1/2 mb-2 sm:mb-0 pr-2">
                <label>Start Date:</label>
                <input
                  type="datetime-local"
                  value={editedTask.start.toISOString().substring(0, 16)}
                  onChange={(e) =>
                    setEditedTask((prev) =>
                      prev ? { ...prev, start: new Date(e.target.value) } : prev
                    )
                  }
                  className="p-2 border rounded-full w-full"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label>End Date:</label>
                <input
                  type="datetime-local"
                  value={editedTask.end.toISOString().substring(0, 16)}
                  onChange={(e) =>
                    setEditedTask((prev) =>
                      prev ? { ...prev, end: new Date(e.target.value) } : prev
                    )
                  }
                  className={`p-2 border rounded-full w-full ${error.date ? "border-red-500" : ""}`}
                />
                {error.date && <p className="text-red-500 text-sm">{error.date}</p>}
              </div>
            </div>

            {/* Currently Assigned Employees */}
            <div className="mb-4">
              <label>Currently Assigned Employees:</label>
              <div className="border p-2 rounded h-32 overflow-auto">
                {employees.map((employee: any) => (
                  <div key={employee._id} className="flex justify-between items-center mb-1">
                    <span>{employee.name}</span>
                    <button
                      onClick={() => handleRemoveAssigned(employee._id)}
                      className="text-red-500 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assign/Reassign to Employees */}
            <div className="mb-4">
              <label>Assign/Reassign to Employees:</label>
              <select
                multiple
                value={selectedUsers}
                onChange={handleSelectChange}
                className="p-2 border w-full h-32"
              >
                {filteredUnassignedEmployees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Save and Cancel Buttons */}
            <div className="mt-4 flex justify-between">
              <button onClick={handleSaveEdit} className="p-2 bg-blue-600 text-white rounded-full">
                Save Changes
              </button>
              <button
                onClick={() => setEditedTask(null)}
                className="p-2 bg-gray-400 text-white rounded-full"
              >
                Cancel Edit
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="p-2 bg-gray-400 text-white rounded-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
