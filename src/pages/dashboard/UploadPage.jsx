import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../../components/DashBoardSidebar";
import DashboardTopbar from "../../components/DashBoardTopbar";
import ViewDemo from "../../components/ViewDemo";

export default function UploadPage() {
  const navigate = useNavigate();
  const handleUploadSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-auto">
          <ViewDemo
            maxCredits={5}
            showNav={false}
            onUploadSuccess={handleUploadSuccess}
          />
        </main>
      </div>
    </div>
  );
}
