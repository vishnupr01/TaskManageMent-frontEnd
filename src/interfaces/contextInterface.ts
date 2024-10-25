export default interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  loading: boolean;
  isUser: () => any
 
}