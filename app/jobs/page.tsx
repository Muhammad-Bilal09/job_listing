"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Job } from "@/types/Types";
import { Application } from "@/types/Types";
import { gradients } from "@/constants/constants";

export default function JobsPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [Title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await axios.get("/api/getJobs");
      return res.data;
    },
  });

  const locations = [...new Set(jobs.map((job: Job) => job.location))];
  const categories = [...new Set(jobs.map((job: Job) => job.category))];
  const title = [...new Set(jobs.map((job: Job) => job.title))];

  const filteredJobs = jobs.filter(
    (job: Job) =>
      (!search || job.title.toLowerCase().includes(search.toLowerCase())) &&
      (!location || job.location === location) &&
      (!Title || job.title === Title) &&
      (!minSalary || job.salary >= parseFloat(minSalary))
  );

  const applyForJobMutation = useMutation({
    mutationFn: async (application: Application) => {
      if (!resume) {
        throw new Error("No resume uploaded.");
      }

      const formData = new FormData();
      formData.append("job_id", application.job_id);
      formData.append("user_id", application.user_id);
      formData.append("status", application.status);
      formData.append("resume", resume);

      console.log(formData);
      const res = await axios.post("/api/applyJobs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      alert("Application submitted successfully.");
      setSelectedJob(null);
      setResume(null);
      setUploadSuccess(true);
    },
    onError: (error) => {
      alert("Error submitting application: " + error.message);
      setUploadSuccess(false);
    },
  });

  async function handleApply(job: Job) {
    if (!session?.user?.id) {
      alert("You must be logged in to apply for a job.");
      return;
    }

    if (!resume) {
      alert("Please upload your resume before applying.");
      return;
    }

    const applicationData: Application = {
      job_id: job.id,
      user_id: session.user.id,
      resume: resume.name,
      status: "Pending",
      id: "",
    };

    applyForJobMutation.mutate(applicationData);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      setResume(file);
    }
  }

  function handleClickUpload() {
    document.getElementById("file")?.click();
  }

  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold my-6  text-white">Job Listings</h1>
      <div className="flex flex-wrap mt-6 bg-white p-4 rounded-lg shadow-lg my-12 gap-4">
        <select
          className="p-3 w-60 border border-gray-300 rounded outline-none text-black"
          value={Title}
          onChange={(e) => setTitle(e.target.value)}
        >
          <option value="">Select Title</option>
          {title.map((loc: any) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          className="p-3 w-60 border border-gray-300 rounded outline-none text-black"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Select Location</option>
          {locations.map((loc: any) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="p-3 w-60 border border-gray-300 rounded outline-none text-black"
          placeholder="Min Salary (Rs)"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />
      </div>

      <div className="w-full flex justify-center items-center">
        {isLoading ? (
          <p className="text-lg font-semibold text-gray-600 animate-pulse">
            Loading jobs...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {filteredJobs.map((job: Job, index: number) => (
              <div
                key={job.id}
                className={`bg-gradient-to-br ${
                  gradients[index % gradients.length]
                } 
                      p-6 rounded-2xl shadow-md hover:shadow-2xl 
                      transition-transform transform hover:-translate-y-2 
                      cursor-pointer border border-gray-200`}
              >
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                <p className="text-gray-200 mt-1">{job.location}</p>
                <p className="text-gray-100 text-sm">{job.category}</p>
                <p className="text-white mt-2 text-sm line-clamp-2">
                  {job.description}
                </p>
                <p className="text-yellow-200 font-bold text-lg mt-4">
                  Rs-{job.salary}
                </p>
                <p className="text-gray-100 text-xs mt-1">
                  Posted by: {job.posted_by}
                </p>
                <button
                  className="w-full mt-5 bg-gradient-to-r from-blue-900 to-green-100 text-white py-2 rounded-lg hover:opacity-90 transition"
                  onClick={() => setSelectedJob(job)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">
              {selectedJob.title}
            </h2>
            <p className="text-gray-600 mb-2">{selectedJob.description}</p>
            <p className="text-gray-700 mb-2">
              Location: {selectedJob.location}
            </p>
            <p className="text-gray-700 mb-2">
              Category: {selectedJob.category}
            </p>
            <p className="text-gray-700 mb-2">Salary: Rs{selectedJob.salary}</p>
            <p className="text-gray-700 mb-4">
              Posted by: {selectedJob.posted_by}
            </p>
            <div className="flex flex-col items-center py-2">
              <h1>Upload Your Resume</h1>
              <div
                onClick={handleClickUpload}
                className="lg:w-96 lg:h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-gray-700 font-semibold text-lg">
                  Upload a File
                </p>
                <p className="text-gray-500 text-sm">Click to select a file</p>
                {resume && (
                  <p className="mt-2 text-gray-700 font-medium">
                    {resume.name}
                  </p>
                )}
              </div>
              <input
                type="file"
                name="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <button
              onClick={() => handleApply(selectedJob)}
              className={`w-full ${
                applyForJobMutation.isPending ? "bg-gray-400" : "bg-blue-500"
              } text-white p-2 rounded hover:bg-blue-600 transition`}
              disabled={applyForJobMutation.isPending}
            >
              {applyForJobMutation.isPending
                ? "Applying..."
                : "Submit Application"}
            </button>

            <button
              onClick={() => setSelectedJob(null)}
              className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            {uploadSuccess !== null && (
              <div className="mt-4 text-center">
                {uploadSuccess ? (
                  <p className="text-green-500">File uploaded successfully!</p>
                ) : (
                  <p className="text-red-500">
                    Error uploading file. Please try again.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
