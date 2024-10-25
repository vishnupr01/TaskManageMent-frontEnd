type Role = "Employee" | "Manager" | "";
type Department = "HR" | "Finance" | "Engineering" | "";
export default  interface FormData {
  
  name: string;
  email: string;
  password: string;
  role: Role;
  department?: Department;
}