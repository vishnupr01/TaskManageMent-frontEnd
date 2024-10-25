import React, { useState, useEffect } from "react";
import Task from "../interfaces/calenderInterface";
import { editTask, taskAssigned } from "../api/task";
import toast from "react-hot-toast";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onEdit: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  userRole: string;
  unassignedEmployees: { _id: string; name: string; email: string }[];
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

  useEffect(() => {
    if (editedTask) {
      setSelectedUsers(editedTask.assignedTo);
      fetchCurrentlyAssigned(editedTask._id);
    }
  }, [editedTask]);

  const fetchCurrentlyAssigned = async (taskId: any) => {
    try {
      const response = await taskAssigned(taskId);
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching assigned users:", error);
    }
  };

  const sendDataToBackend = async (updatedTask: Task) => {
    try {
      console.log("check updated", updatedTask);

      const response = await editTask(updatedTask._id, updatedTask);
      if (response.data.status === 'success') {
        toast.success('Updated successfully');
        setEditedTask(null);
        onEdit(updatedTask); // Call onEdit to update the state in the parent component
        onClose(); // Close the modal after successful edit
      }
      console.log("after backend", response);
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle error (e.g., show a notification)
    }
  };

  const handleSaveEdit = () => {
    if (!validateInputs()) return;

    if (editedTask) {
      const combinedUsers = Array.from(
        new Set([...selectedUsers, ...employees.map(emp => emp._id)])
      );
      const updatedTask = { ...editedTask, assignedTo: combinedUsers };
      sendDataToBackend(updatedTask); // Send updated task to backend
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    
    // Merge the new selected users with currently assigned users
    const mergedUsers = Array.from(new Set([...selectedUsers, ...selectedOptions]));
    setSelectedUsers(mergedUsers);
  };

  const handleRemoveAssigned = (employeeId: string) => {
    setEmployees(prev => prev.filter(user => user._id !== employeeId)); // Remove from currently assigned
    setSelectedUsers(prev => prev.filter(user => user !== employeeId)); // Remove from selected users if present
  };

  const validateInputs = () => {
    const errors: { title?: string; date?: string } = {};

    if (!editedTask?.title.trim()) {
      errors.title = "Title is required";
    }

    if (editedTask && editedTask.start > editedTask.end) {
      errors.date = "End date must be later than start date";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  if (!isOpen) return null;

  // Filter unassigned employees to exclude those who are already assigned
  const filteredUnassignedEmployees = unassignedEmployees.filter(
    unassigned => !employees.some(assigned => assigned._id === unassigned._id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl z-50">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>

        <div className="max-h-60 overflow-auto mb-4">
          <ul className="list-disc pl-4">
            {tasks.map(task => (
              <li key={task._id} className="mb-2">
                <strong>{task.title}</strong> - {task.start.toLocaleString()} to {task.end.toLocaleString()}
                {userRole === "Manager" && !editedTask && (
                  <div className="mt-2">
                    <button
                      onClick={() => setEditedTask(task)}
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

            <input
              type="text"
              placeholder="Task Title"
              value={editedTask.title}
              onChange={e =>
                setEditedTask(prev => (prev ? { ...prev, title: e.target.value } : prev))
              }
              className={`p-2 border rounded-full mb-2 w-full ${error.title ? "border-red-500" : ""}`}
            />
            {error.title && <p className="text-red-500 text-sm">{error.title}</p>}

            <div className="flex flex-wrap mb-2">
              <div className="w-full sm:w-1/2 mb-2 sm:mb-0 pr-2">
                <label>Start Date:</label>
                <input
                  type="datetime-local"
                  value={editedTask.start.toISOString().substring(0, 16)}
                  onChange={e =>
                    setEditedTask(prev =>
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
                  onChange={e =>
                    setEditedTask(prev =>
                      prev ? { ...prev, end: new Date(e.target.value) } : prev
                    )
                  }
                  className={`p-2 border rounded-full w-full ${error.date ? "border-red-500" : ""}`}
                />
                {error.date && <p className="text-red-500 text-sm">{error.date}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label>Currently Assigned Employees:</label>
              <div className="border p-2 rounded h-32 overflow-auto">
                {employees.map((employee: any) => (
                  <div key={employee._id} className="flex justify-between items-center mb-1">
                    <span>{`${employee.name} (${employee.email})`}</span>
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

            <div className="mb-4">
              <label>Assign/Reassign to Employees:</label>
              <select
                multiple
                value={selectedUsers}
                onChange={handleSelectChange}
                className="p-2 border w-full h-32"
              >
                {filteredUnassignedEmployees.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {`${employee.name} (${employee.email})`}
                  </option>
                ))}
              </select>
            </div>

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
        {!editedTask && (
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="p-2 bg-gray-400 text-white rounded-full">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;
