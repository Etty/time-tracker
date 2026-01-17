"use client";

import { useState, useEffect, useRef } from "react";

interface Project {
  id: number;
  name: string;
}

export default function TimeEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Fetch projects from API
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      startTime: formData.get("start-time"),
      projectId: formData.get("project_id"),
      hours: formData.get("hours"),
      description: formData.get("description"),
    };

    try {
      const response = await fetch("/api/time-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("Time entry added successfully!");
        formRef.current?.reset();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage("Error submitting form. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
    >
      <legend className="text-2xl font-semibold mb-4 text-center">
        Add Time Entry
      </legend>
      {message && (
        <div
          className={`p-3 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message}
        </div>
      )}
      <div className="flex flex-col">
        <label
          htmlFor="start-time"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Start Time:
        </label>
        <input
          type="datetime-local"
          id="start-time"
          name="start-time"
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="project_id"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Project:
        </label>
        <select
          id="project_id"
          name="project_id"
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="hours"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Hours:
        </label>
        <input
          type="number"
          id="hours"
          name="hours"
          required
          min="0.01"
          step="0.01"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          required
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adding..." : "Add Time Entry"}
      </button>
    </form>
  );
}
