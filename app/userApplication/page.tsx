"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ApplicationsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userApplications"],
    queryFn: async () => {
      const res = await axios.get("/api/getUserApplication");
      return res.data;
    },
  });

  const userApplications = data?.applications || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6">
        My Applications
      </h1>
      {isLoading ? (
        <p className="text-lg text-white animate-pulse text-center">
          Loading applications...
        </p>
      ) : error ? (
        <p className="text-red-500">Failed to load applications.</p>
      ) : userApplications.length === 0 ? (
        <p className="text-white text-center">No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userApplications.map((application: any) => (
            <div
              key={application.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold text-gray-800">
                {application.job.title}
              </h3>
              <p className="text-gray-600">{application.job.location}</p>
              <p className="text-gray-500">
                Category: {application.job.category}
              </p>
              <p className="mt-2 font-semibold">
                Status:{" "}
                <span
                  className={`text-${
                    application.status === "Pending"
                      ? "yellow"
                      : application.status === "Accepted"
                      ? "green"
                      : "red"
                  }-500`}
                >
                  {application.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
