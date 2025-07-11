import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await axios.get("http://localhost:8317/api/tasks", {
          withCredentials: true,
        });
        const found = data.tasks.find((t) => t._id === id);
        if (!found) throw new Error("Task not found");
        setTask(found);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch task details");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const determineStatus = (checklist) => {
    const total = checklist.length;
    const completed = checklist.filter((item) => item.done).length;
    if (total === 0 || completed === 0) return "pending";
    if (completed === total) return "completed";
    return "in progress";
  };

  const handleToggle = async (index) => {
    const updatedChecklist = [...task.checklist];
    updatedChecklist[index].done = !updatedChecklist[index].done;

    const updatedTask = {
      ...task,
      checklist: updatedChecklist,
      status: determineStatus(updatedChecklist),
    };

    try {
      await axios.put(`http://localhost:8317/api/tasks/${task._id}`, updatedTask, {
        withCredentials: true,
      });
      setTask(updatedTask);
      toast.success("Checklist updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8317/api/tasks/${task._id}`, {
        withCredentials: true,
      });
      toast.success("Task deleted");
      navigate("/tasks");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-600">Loading task details...</div>;
  if (!task) return null;

  const doneCount = task.checklist?.filter((item) => item.done).length || 0;
  const totalCount = task.checklist?.length || 0;
  const progress = totalCount ? (doneCount / totalCount) * 100 : 0;

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const statusColors = {
    pending: "text-purple-600",
    "in progress": "text-blue-600",
    completed: "text-green-600",
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 bg-white rounded-lg shadow-md">
      {/* Title + Icons */}
      <div className="flex justify-between items-start sm:items-center flex-wrap gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
        <div className="flex gap-4">
          <Pencil
            className="w-5 h-5 text-blue-600 hover:text-blue-700 cursor-pointer"
            onClick={() => navigate(`/task/${task._id}/edit`)}
          />
          <Trash2
            className="w-5 h-5 text-red-600 hover:text-red-700 cursor-pointer"
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* Status & Priority */}
      <div className="flex justify-between items-center flex-wrap gap-3 text-sm mb-4">
        <span className={`capitalize font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
        <span className={`px-3 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority} Priority
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-5 whitespace-pre-wrap">
        {task.description || "No description provided."}
      </p>

      {/* Progress */}
      <div className="mb-5">
        <p className="text-sm font-semibold mb-1">
          Progress: {doneCount} / {totalCount}
        </p>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="h-3 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Dates */}
      <div className="text-sm text-gray-600 space-y-1 mb-6">
        <p>
          <span className="font-medium">Start Date:</span> {formatDate(task.startDate)}
        </p>
        <p>
          <span className="font-medium">Due Date:</span> {formatDate(task.dueDate)}
        </p>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Checklist</h2>
        {task.checklist.length === 0 ? (
          <p className="text-gray-500">No checklist items added.</p>
        ) : (
          <ul className="space-y-3">
            {task.checklist.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => handleToggle(index)}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  readOnly
                  className="accent-blue-600 cursor-pointer"
                />
                <span
                  className={`text-sm ${
                    item.done ? "line-through text-gray-500" : "text-gray-800"
                  }`}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TaskDetails;
