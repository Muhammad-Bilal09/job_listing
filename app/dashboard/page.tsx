"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBars } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { signOut } from "next-auth/react";
import { Job } from "@/types/Types";
import { SidebarProps } from "@/types/Types";
import Link from "next/link";

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  setIsModelOpen,
  isModelOpen,
}) => (
  <>
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
        onClick={() => setIsOpen(false)}
      />
    )}

    <aside
      className={`fixed top-0 left-0 w-64 bg-gradient-to-r from-gray-500 to-gray-700 text-white p-5 h-full flex flex-col z-50 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:flex`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-500">Admin Panel</h2>
        <FaTimes
          className="lg:hidden text-white text-2xl cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      </div>

      <ul className="flex-grow">
        <li
          className="flex items-center space-x-2 p-3 cursor-pointer text-black hover:text-white bg-blue-200 hover:bg-blue-400 rounded"
          onClick={() => setIsModelOpen(true)}
        >
          <FaPlus /> <span>Add Job</span>
        </li>
        <Link href="/jobs">
          <li className="flex items-center space-x-2 my-4 p-3 cursor-pointer text-black hover:text-white bg-blue-200 hover:bg-blue-400 rounded">
            Jobs
          </li>
        </Link>
        <Link href="/application">
          <li className="flex items-center space-x-2 p-3 cursor-pointer text-black hover:text-white bg-blue-200 hover:bg-blue-400 rounded">
            Applications
          </li>
        </Link>
      </ul>

      <ul>
        <li
          className="flex items-center space-x-2 p-3 cursor-pointer text-black hover:text-white bg-red-500 hover:bg-red-400 rounded"
          onClick={() => signOut()}
        >
          <span>Logout</span>
          <LuLogOut />
        </li>
      </ul>
    </aside>
  </>
);

const AdminJobsDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [form, setForm] = useState<Job>({
    id: "",
    title: "",
    description: "",
    category: "",
    location: "",
    salary: 0,
    posted_by: "",
  });
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await axios.get("/api/getJobs");
      return res.data;
    },
  });

  const addJobMutation = useMutation({
    mutationFn: async (newJob: Omit<Job, "id">) =>
      axios.post("/api/addJobs", newJob),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      setIsOpen(false);
      resetForm();
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async (updatedJob: Job) =>
      axios.put(`/api/updateJobs/${updatedJob.id}`, updatedJob),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      setIsOpen(false);
      resetForm();
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`/api/deleteJobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  function resetForm() {
    setForm({
      id: "",
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {!isOpen && (
        <button
          className="lg:hidden p-3 text-2xl bg-gray-700 text-white fixed top-4 left-4 z-50 rounded"
          onClick={() => setIsOpen(true)}
        >
          <FaBars />
        </button>
      )}

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsModelOpen={setIsModelOpen}
        isModelOpen={isModelOpen}
      />
      <main className="flex-1 p-6 bg-gray-100 md:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-center">Job Listings</h1>

        {isLoading ? (
          <p className="text-center">Loading jobs...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-lg shadow-md break-words min-w-[200px] max-w-md w-full overflow-hidden"
              >
                <h3 className="text-xl font-bold truncate">{job.title}</h3>
                <p className="text-gray-600 line-clamp-3">{job.description}</p>
                <p className="text-gray-600">
                  Category: <span className="break-words">{job.category}</span>
                </p>
                <p className="text-gray-600">
                  Location: <span className="break-words">{job.location}</span>
                </p>
                <p className="text-gray-600">Salary: ${job.salary}</p>

                <div className="flex space-x-3 mt-4">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center space-x-2"
                    onClick={() => {
                      setForm(job);
                      setEditingJob(job);
                      setIsModelOpen(true);
                    }}
                  >
                    <FaEdit /> <span>Edit</span>
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded flex items-center space-x-2"
                    onClick={() => deleteJobMutation.mutate(job.id)}
                  >
                    <FaTrash /> <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingJob ? "Edit Job" : "Add Job"}
              </h2>
              <FaTimes
                className="cursor-pointer"
                onClick={() => setIsModelOpen(false)}
              />
            </div>
            {(["title", "description", "category", "location"] as const).map(
              (field) => (
                <input
                  key={field}
                  className="w-full p-2 border rounded mb-2"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              )
            )}
            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Salary"
              type="number"
              value={form.salary}
              onChange={(e) =>
                setForm({ ...form, salary: Number(e.target.value) })
              }
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center space-x-2"
              onClick={() => {
                if (editingJob) {
                  updateJobMutation.mutate(form);
                } else {
                  addJobMutation.mutate({
                    ...form,
                    posted_by: session?.user?.id ?? "",
                  });
                }
              }}
              disabled={addJobMutation.isPending || updateJobMutation.isPending}
            >
              {addJobMutation.isPending || updateJobMutation.isPending ? (
                <span className="animate-spin border-t-2 border-white border-solid rounded-full w-4 h-4"></span>
              ) : editingJob ? (
                "Update Job"
              ) : (
                "Create Job"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsDashboard;
