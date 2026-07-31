import { useTranslation } from "react-i18next";
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const ProtectedRoute = ({
  children
}) => {
  const {
    t
  } = useTranslation();
  const {
    user,
    loading
  } = useContext(AuthContext);
  if (loading) {
    return <div className="flex h-screen items-center justify-center">{t("ProtectedRoute.loading")}</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;