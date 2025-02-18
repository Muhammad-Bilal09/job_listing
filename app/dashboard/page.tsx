"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number;
  posted_by: string;
};

export default function AdminJobsDashboard() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary: 0,
    posted_by: "",
  });
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await axios.get("/api/getJobs");
      return res.data;
    },
  });

  const addJobMutation = useMutation({
    mutationFn: async (newJob: typeof form) => {
      return axios.post("/api/addJobs", newJob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsOpen(false);
      resetForm();
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async (updatedJob: Job) => {
      return axios.put(`/api/updateJobs/${updatedJob.id}`, updatedJob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsOpen(false);
      resetForm();
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/api/deleteJobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  async function handleSubmit() {
    if (!session?.user?.id) {
      alert("You must be logged in to add or update jobs.");
      return;
    }

    const jobData = {
      ...form,
      posted_by: session.user.id,
    };

    if (editingJob) {
      updateJobMutation.mutate({ ...jobData, id: editingJob.id });
    } else {
      addJobMutation.mutate(jobData);
    }
  }

  async function handleDelete(id: string) {
    deleteJobMutation.mutate(id);
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      category: "",
      location: "",
      salary: 0,
      posted_by: "",
    });
    setEditingJob(null);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
        Admin Job Listings
      </h1>
      <button
        onClick={() => {
          setIsOpen(true);
          setEditingJob(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition mb-4"
      >
        Add Job
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="text-center">Loading jobs...</p>
        ) : (
          jobs.map((job: Job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">Title:{job.title}</h3>
              <p className="text-gray-700 mb-2">
                discription:{job.description}
              </p>
              <p className="text-gray-600">Category: {job.category}</p>
              <p className="text-gray-600">Location: {job.location}</p>
              <p className="text-gray-600">Salary: ${job.salary}</p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => {
                    setForm(job);
                    setEditingJob(job);
                    setIsOpen(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingJob ? "Edit Job" : "Add Job"}
            </h2>
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Salary"
              type="number"
              value={form.salary}
              onChange={(e) =>
                setForm({ ...form, salary: Number(e.target.value) })
              }
            />

            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Posted By"
              value={form.posted_by}
              onChange={(e) => setForm({ ...form, posted_by: e.target.value })}
              disabled
            />
            <button
              onClick={handleSubmit}
              className={`w-full ${
                addJobMutation.isPending || updateJobMutation.isPending
                  ? "bg-gray-400"
                  : "bg-green-500"
              } text-white p-2 rounded hover:bg-green-600 transition`}
              disabled={addJobMutation.isPending || updateJobMutation.isPending}
            >
              {editingJob ? "Update Job" : "Create Job"}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
