"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { JobApplication } from "@/types/Types";

export default function ApplicationPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get("/api/getApplication");

      return response.data?.applications ?? [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await axios.put(`/api/jobApplication/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      console.log(data);
    },
  });

  if (isLoading)
    return <p className="text-center text-gray-500">Loading applications...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">Failed to fetch applications</p>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white text-center">
        Job Applications
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Job Title</th>
              <th className="p-3 border">Applicant Name</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Resume</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app: JobApplication) => (
              <tr key={app.id} className="border hover:bg-gray-50">
                <td className="p-3 border">{app.id}</td>
                <td className="p-3 border">{app.job.title}</td>
                <td className="p-3 border">{app.user.name}</td>
                <td className="p-3 border text-blue-600 font-semibold">
                  {app.status}
                </td>
                <td className="p-3 border">
                  <a
                    href={app.resume}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    View Resume
                  </a>
                </td>
                <td className="p-3 border">
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: app.id,
                        status: "Approved",
                      })
                    }
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: app.id,
                        status: "Rejected",
                      })
                    }
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
