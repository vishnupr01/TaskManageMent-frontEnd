import Task from "../interfaces/calenderInterface";
import Api from "../services/axios";
import taskRoutes from "../services/endpoints/taskEndpoints";

export const getAllEmployees = async (managerId: string) => {
  try {
    const response = await Api.get(taskRoutes.getEmployess, {
      params: {
        managerId, // Pass managerId as a query parameter
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (taskData: Task) => {
  try {
    const response = await Api.post(taskRoutes.createTask, {
      taskData
    });
    return response;
  } catch (error) {
    console.log(error);
    
    throw error;
  }
};
export const getAllTasks = async (managerId: string) => {
  try {
    const response = await Api.get(taskRoutes.getManagerTasks, {
      params: {
        managerId, // Pass managerId as a query parameter
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteTask = async (taskId: string) => {
  try {
    const response = await Api.delete(taskRoutes.deleteTask(taskId));
    return response; // This could be a success message or the deleted task details
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};