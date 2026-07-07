import React from 'react';
import { Link } from 'react-router-dom';

const ComplaintCard = ({ complaint }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
      case 'Critical': return 'text-red-600';
      case 'Medium': return 'text-orange-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
            {complaint.status}
          </span>
          <span className={`text-sm font-semibold ${getPriorityColor(complaint.priority)}`}>
            {complaint.priority} Priority
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{complaint.title}</h3>
        <p className="text-sm text-gray-500 mb-2">Category: {complaint.category}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
        <p className="text-xs text-gray-400 mt-3">
          Submitted on: {new Date(complaint.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col space-y-2 w-full sm:w-auto">
        {complaint.imageUrl && (
          <img 
            src={`http://localhost:5000${complaint.imageUrl}`} 
            alt="Complaint" 
            className="w-full sm:w-32 h-24 object-cover rounded-md mb-2"
          />
        )}
        <Link 
          to={`/complaints/${complaint._id}`}
          className="text-center w-full inline-flex justify-center rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-100"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ComplaintCard;
