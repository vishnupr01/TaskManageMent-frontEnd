import React, { useContext, useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import ReactCalendar from "react-calendar"; // Small calendar component
import "react-calendar/dist/Calendar.css"; // Styles for small calendar
import TaskModal from "./TaskModal";
import Task from "../interfaces/calenderInterface";
import TaskDetailModal from "./ViewTaskModal";
import { SlotInfo } from 'react-big-calendar';
import { deleteTask, getAllEmployees, getAllTasks } from "../api/task";
import { AuthContext } from "../contex/AuthContext";

// 2. Localizer Setup (for date manipulation with date-fns)
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// 4. Main Component
const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false); // Modal state
  const [taskList, setTaskList] = useState<Task[]>([]); // Manage task list
  const [employees, setEmployess] = useState<[]>([]); // Employee list without duplicates
  const [currentUser, setCurrentUser] = useState('User1'); // Set current user or manage this according to your logic
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const { isUser }: any = useContext(AuthContext);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>(''); // User role
  const [managerId, setmanagerId] = useState<string>('');

  // Filter tasks by the search query
  const filteredTasks = taskList.filter((task) =>
    task.assignedTo.some((user) => user.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle event creation
  const handleNewTask = (newTask: Task) => {
    setTaskList([...taskList, newTask]); // Add new task to the list
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { userId, departmentId, role, managerId } = await isUser();
      console.log("User ID:", userId, "Department ID:", departmentId, "Role:", role, "managerID:", managerId);
      if (userId) {
        setCurrentUser(userId);
        setDepartmentId(departmentId);
        setUserRole(role); // Set user role
        setmanagerId(managerId)
        await fetchAllTasks(userId);
        await fetchEmployess(userId);
      }
    };

    fetchUserDetails();
  }, [currentUser]);

  const fetchEmployess = async (userId: any) => {
    try {
      const response = await getAllEmployees(userId as string);
      setEmployess(response.data.data);
    } catch (error) {
      throw error;
    }
  };
 

  const fetchAllTasks = async (userId: any) => {
    try {
      let response: any = null
      if (userRole === 'Manager') {
        response = await getAllTasks(userId as string);
      } else {
        response = await getAllTasks(managerId as string);
      }

      console.log("task list", response);
      const fetchedTasks = response.data.data.map((task: any) => ({
        _id: task._id,
        title: task.title, // Assuming title exists in the fetched task
        start: new Date(task.start), // Adjust based on your logic
        end: new Date(task.end), // You may want to set this differently
        allDay: false,
        assignedTo: task.assignedTo, // Ensure this field exists
        createdBy: task.createdBy, // Ensure this field exists
        departmentId: task.departmentId // Ensure this field exists
      }));
      console.log("fetchedTasks", fetchedTasks);

      setTaskList(fetchedTasks); // Set the fetched tasks into taskList
    } catch (error) {
      // throw error;
    }
  };

  // Handle date click
  const handleDateClick = (slotInfo: SlotInfo) => {
    const selectedDate = slotInfo.start;
    const tasksForDate = filteredTasks.filter((task) =>
      task.start.toDateString() === selectedDate.toDateString()
    );
    setTasksForSelectedDate(tasksForDate);
    // Set tasks for selected date
    if (userRole === "Manager") {
      setDetailModalOpen(true);
    }
    // Open detail modal
  };

  // Handle editing a task
  const handleEditTask = (updatedTask: Task) => {
    setTaskList((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    console.log("task id", taskId);
    const response = await deleteTask(taskId);
    console.log(response, "response after deletion");
    setTaskList((prev) => prev.filter((task) => task._id !== taskId));
    setDetailModalOpen(false);
  };

  // Get tasks for selected date
  const tasksForSelectedDateFiltered = filteredTasks.filter((task) =>
    task.start.toDateString() === selectedDate.toDateString()
  );
  console.log(managerId, "manager");

  return (
    <div className="container mx-auto mt-10">
      {/* Header with small calendar and search bar */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Task Calendar</h1>
        <input
          type="text"
          placeholder="Search by person"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded shadow-md"
        />
        {userRole === 'Manager' && ( // Only show button if user is a manager
          <button
            onClick={() => setModalOpen(true)} // Open modal on click
            className="ml-4 p-2 bg-blue-600 text-white rounded"
          >
            Create Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Small Calendar for date selection */}
        <div className="md:col-span-1">
          <ReactCalendar
            value={selectedDate}
            onChange={(value) => setSelectedDate(value as Date)} // Update selected date
            className="rounded-lg border shadow-md"
          />
        </div>

        {/* Big Calendar for tasks */}
        <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg">
          <BigCalendar
            localizer={localizer}
            events={filteredTasks} // Display filtered tasks
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            style={{ height: 600 }}
            views={["month", "week", "day"]}
            date={selectedDate} // Sync big calendar with selected date
            onNavigate={(date) => setSelectedDate(date)} // Sync when navigating
            selectable
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: '#3174ad',
                color: 'white',
                borderRadius: '5px',
                padding: '10px',
              },
            })}
            popup
            components={{
              event: ({ event }) => (
                <span>
                  <strong>{event.title}</strong>
                  <br />
                  <span>{event.assignedTo.join(", ")}</span>
                </span>
              ),
            }}
            onSelectEvent={(event) => {
              const tasksForDate = filteredTasks.filter(
                (task) => task._id === event._id
              );
              if (tasksForDate.length > 0) {
                setTasksForSelectedDate(tasksForDate);
                setDetailModalOpen(true);
              }
            }}
            onSelectSlot={handleDateClick} // Handle date clicks
          />
        </div>
      </div>

      {/* Modal for creating new tasks */}
      <TaskModal
        currentUser={currentUser}
        departmentId={departmentId}
        employees={employees}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
       unassignedEmployees={employees}
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        tasks={tasksForSelectedDate}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        userRole={userRole}
      />
    </div>
  );
};

export default Home;
