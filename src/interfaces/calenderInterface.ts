// 1. Task Interface
export default interface Task {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  assignedTo: string[]; // Array of users
  createdBy: string; 
  departmentId:string// Single user who created the task
}

