// src/utils/authUtils.ts
import { NavigateFunction } from "react-router-dom";

export function handleAdminLogout(navigate: NavigateFunction) {
  localStorage.removeItem("adminToken");
  navigate("/admin/login");
}

export function handleLogout(navigate: NavigateFunction) {
  localStorage.removeItem("token");
  navigate("/");
}

export function handleReturn(navigate: NavigateFunction, path: string) {
  navigate(path);
}