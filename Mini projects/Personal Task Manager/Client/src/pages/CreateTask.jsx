import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    checklist: [],
  });

  const [checklistItem, setChecklistItem] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addChecklistItem = () => {
    if (checklistItem.trim() !== "") {
      setForm((prev) => ({
        ...prev,
        checklist: [...prev.checklist, { text: checklistItem, done: false }],
      }));
      setChecklistItem("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8317/api/tasks",
        form,
        { withCredentials: true }
      );
      toast.success("Task created successfully");
      setForm({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
        checklist: [],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create task"
      );
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded-md my-5">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Task Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Checklist */}
        <div>
          <label className="block font-medium mb-1">TODO Checklist</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={checklistItem}
              onChange={(e) => setChecklistItem(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
              placeholder="Enter task"
            />
            <button
              type="button"
              onClick={addChecklistItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <ul className="list-disc list-inside">
            {form.checklist.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
        >
          Create Task
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateTask;
