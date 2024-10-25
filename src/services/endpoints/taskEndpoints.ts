const taskRoutes={
  getEmployess:'api/task/assignedEmployess',
  createTask:'api/task/createTask',
  getManagerTasks:'api/task/tasksByManager',
  deleteTask: (taskId:any) => `/api/task/deleteTasks/${taskId}`,
  assignedEmployess:'api/task/taskAssignedEmployees',
  editTask: (taskId: any) => `/api/task/editTask/${taskId}`

}
export default taskRoutes