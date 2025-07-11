""// src/pages/EditTask.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    checklist: [],
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get("http://localhost:8317/api/tasks", {
          withCredentials: true,
        });
        const found = res.data.tasks.find((t) => t._id === id);
        if (!found) throw new Error("Task not found");
        setTask(found);
        setForm({
          title: found.title,
          description: found.description,
          priority: found.priority,
          dueDate: found.dueDate?.slice(0, 10),
          checklist: found.checklist,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch task for editing");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleChecklistChange = (index, field, value) => {
    const updated = [...form.checklist];
    updated[index][field] = field === "done" ? value : value.trim();
    setForm({ ...form, checklist: updated });
  };

  const addChecklistItem = () => {
    setForm({
      ...form,
      checklist: [...form.checklist, { text: "", done: false }],
    });
  };

  const removeChecklistItem = (index) => {
    const updated = form.checklist.filter((_, i) => i !== index);
    setForm({ ...form, checklist: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8317/api/tasks/${id}`, form, {
        withCredentials: true,
      });
      toast.success("Task updated successfully");
      navigate(`/task/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Task</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
      >
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Priority</label>
            <select
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">Checklist</label>
          {form.checklist.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 mb-2 bg-gray-50 p-2 rounded-md"
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) =>
                  handleChecklistChange(index, "done", e.target.checked)
                }
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) =>
                  handleChecklistChange(index, "text", e.target.value)
                }
                placeholder="Checklist item"
                className="flex-1 border border-gray-300 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => removeChecklistItem(index)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addChecklistItem}
            className="text-sm text-blue-600 mt-1 hover:underline"
          >
            + Add item
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;