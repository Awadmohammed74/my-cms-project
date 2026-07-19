import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user } = useAuth(); // بنسحب حالة المستخدم من الـ Context اللي عملناه

  // إذا كان الـ user موجوداً، افتح الصفحة المطلوبة (Outlet)
  // إذا كان الـ user قيمته null، حول المستخدم لصفحة الـ login
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
