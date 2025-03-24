import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  Loader2,
  AlertCircle,
  Edit,
  Save,
  X,
  Star,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import {
  toggleTask,
  deleteTask,
  fetchWeatherForTask,
  startEditingTask,
  cancelEditingTask,
  updateTask,
  togglePinnedTask,
} from "../../redux/taskSlice";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const WeatherIcon = ({ condition }) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun size={18} className="text-yellow-500" />;
    case "rain":
      return <CloudRain size={18} className="text-blue-500" />;
    case "clouds":
      return <Cloud size={18} className="text-gray-500" />;
    case "partly cloudy":
      return <CloudSun size={18} className="text-gray-400" />;
    default:
      return <Cloud size={18} className="text-gray-400" />;
  }
};

export default function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  const weatherStatus = useSelector((state) => state.tasks.weatherStatus);
  const currentlyEditing = useSelector((state) => state.tasks.currentlyEditing);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    priority: "medium",
    location: "",
    dueDate: "",
  });
  const [expandedWeather, setExpandedWeather] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'today', 'tomorrow', 'completed', 'pending'
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const sortedTasks = [...tasks].sort((a, b) => {
    // Pinned tasks should always appear first
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter((task) => {
    // Search filter
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Status filter
    let matchesFilter = true;
    switch (filter) {
      case "completed":
        matchesFilter = task.completed;
        break;
      case "pending":
        matchesFilter = !task.completed;
        break;
      case "today":
        matchesFilter = task.dueDate && isToday(parseISO(task.dueDate));
        break;
      case "tomorrow":
        matchesFilter = task.dueDate && isTomorrow(parseISO(task.dueDate));
        break;
      case "pinned":
        matchesFilter = task.pinned;
        break;
      default:
        matchesFilter = true;
    }

    // Date filter
    const matchesDate = selectedDate
      ? task.dueDate &&
        format(parseISO(task.dueDate), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      : true;

    return matchesSearch && matchesFilter && matchesDate;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFetchWeather = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task?.location) {
      dispatch(fetchWeatherForTask(taskId));
    }
  };

  const handleStartEditing = (task) => {
    dispatch(startEditingTask(task.id));
    setEditFormData({
      title: task.title,
      priority: task.priority,
      location: task.location || "",
      dueDate: task.dueDate || "",
    });
  };

  const handleCancelEditing = () => {
    dispatch(cancelEditingTask());
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveEdit = (taskId) => {
    dispatch(
      updateTask({
        id: taskId,
        ...editFormData,
      })
    );
  };

  const toggleWeather = (taskId) => {
    setExpandedWeather((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
    const task = tasks.find((t) => t.id === taskId);
    if (
      task?.location &&
      !task.weather &&
      weatherStatus[taskId] !== "loading"
    ) {
      handleFetchWeather(taskId);
    }
  };

  //   const handlePriorityChange = (taskId, newPriority) => {
  //     dispatch(
  //       updateTaskPriority({
  //         id: taskId,
  //         priority: newPriority,
  //       })
  //     );
  //   };

  const handleTogglePin = (taskId) => {
    dispatch(togglePinnedTask(taskId));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => requestSort("priority")}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Priority
            {sortConfig.key === "priority" &&
              (sortConfig.direction === "ascending" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              ))}
          </button>
          <button
            onClick={() => requestSort("createdAt")}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Date
            {sortConfig.key === "createdAt" &&
              (sortConfig.direction === "ascending" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              ))}
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50"
            >
              <Calendar size={18} />
              <span className="hidden sm:inline">Date</span>
            </button>
            {showCalendar && (
              <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-2">
                <input
                  type="date"
                  value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => handleDateSelect(new Date(e.target.value))}
                  className="p-1 border rounded"
                />
                {selectedDate && (
                  <button
                    onClick={clearDateFilter}
                    className="w-full mt-2 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() =>
                document
                  .getElementById("filterDropdown")
                  .classList.toggle("hidden")
              }
              className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <div
              id="filterDropdown"
              className="hidden absolute z-10 right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-1"
            >
              <button
                onClick={() => {
                  setFilter("all");
                  document
                    .getElementById("filterDropdown")
                    .classList.add("hidden");
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  filter === "all" ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => {
                  setFilter("completed");
                  document
                    .getElementById("filterDropdown")
                    .classList.add("hidden");
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  filter === "completed" ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => {
                  setFilter("pending");
                  document
                    .getElementById("filterDropdown")
                    .classList.add("hidden");
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  filter === "pending" ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => {
                  setFilter("today");
                  document
                    .getElementById("filterDropdown")
                    .classList.add("hidden");
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  filter === "today" ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                Today
              </button>
              <button
                onClick={() => {
                  setFilter("tomorrow");
                  document
                    .getElementById("filterDropdown")
                    .classList.add("hidden");
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  filter === "tomorrow" ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => {
                  setFilter("pinned");
                  document
                    .getElementById("filterDropdown")
                    .classList.add("hidden");
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  filter === "pinned" ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                Pinned
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found. Try adjusting your search or filters.
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`border rounded-lg overflow-hidden transition-all ${
                task.completed ? "bg-gray-50" : "bg-white"
              } ${task.pinned ? "border-yellow-400 border-2" : ""}`}
            >
              <div className="p-4">
                {currentlyEditing === task.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Task title"
                    />
                    <div className="flex gap-3">
                      <select
                        name="priority"
                        value={editFormData.priority}
                        onChange={handleEditFormChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditFormChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Location (optional)"
                      />
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        name="dueDate"
                        value={editFormData.dueDate || ""}
                        onChange={handleEditFormChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancelEditing}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => handleTogglePin(task.id)}
                          className={`p-1 ${
                            task.pinned
                              ? "text-yellow-500"
                              : "text-gray-300 hover:text-yellow-500"
                          }`}
                          aria-label={task.pinned ? "Unpin task" : "Pin task"}
                        >
                          <Star
                            size={20}
                            fill={task.pinned ? "currentColor" : "none"}
                          />
                        </button>

                        <button
                          onClick={() => dispatch(toggleTask(task.id))}
                          className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border flex items-center justify-center ${
                            task.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300"
                          }`}
                          aria-label={
                            task.completed
                              ? "Mark as incomplete"
                              : "Mark as complete"
                          }
                        >
                          {task.completed && <Check size={16} />}
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium ${
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-2 items-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(
                              new Date(task.createdAt),
                              "MMM d, yyyy h:mm a"
                            )}
                          </span>
                          {task.dueDate && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                isToday(parseISO(task.dueDate))
                                  ? "bg-blue-100 text-blue-800"
                                  : isTomorrow(parseISO(task.dueDate))
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {isToday(parseISO(task.dueDate))
                                ? "Today"
                                : isTomorrow(parseISO(task.dueDate))
                                ? "Tomorrow"
                                : format(parseISO(task.dueDate), "MMM d")}
                            </span>
                          )}
                          {task.updatedAt !== task.createdAt && (
                            <span className="text-xs text-gray-400">
                              (edited)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEditing(task)}
                          className="p-1 text-gray-500 hover:text-blue-500"
                          aria-label="Edit task"
                        >
                          <Edit size={20} />
                        </button>
                        {task.location && (
                          <button
                            onClick={() => toggleWeather(task.id)}
                            disabled={weatherStatus[task.id] === "loading"}
                            className="p-1 text-gray-500 hover:text-green-500 flex items-center"
                            aria-label="Toggle weather"
                          >
                            {weatherStatus[task.id] === "loading" ? (
                              <Loader2 size={20} className="animate-spin" />
                            ) : (
                              <>
                                <Cloud size={20} />
                                <ChevronDown
                                  size={16}
                                  className={`ml-1 transition-transform duration-200 ${
                                    expandedWeather[task.id] ? "rotate-180" : ""
                                  }`}
                                />
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => dispatch(deleteTask(task.id))}
                          className="p-1 text-gray-500 hover:text-red-500"
                          aria-label="Delete task"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {task.location && expandedWeather[task.id] && (
                      <div
                        className={`mt-3 transition-all duration-300 overflow-hidden ${
                          expandedWeather[task.id]
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {task.weather ? (
                          <div className="p-3 bg-blue-50 rounded-md flex items-center gap-3">
                            <WeatherIcon condition={task.weather.condition} />
                            <div>
                              <p className="text-sm font-medium">
                                Current weather in {task.location}:{" "}
                                {task.weather.condition}
                              </p>
                              <p className="text-sm text-gray-600">
                                Temperature: {task.weather.temp}°C
                              </p>
                            </div>
                          </div>
                        ) : weatherStatus[task.id] === "loading" ? (
                          <div className="p-3 bg-gray-50 rounded-md flex items-center gap-3">
                            <Loader2
                              size={18}
                              className="animate-spin text-gray-400"
                            />
                            <p className="text-sm text-gray-600">
                              Loading weather data...
                            </p>
                          </div>
                        ) : weatherStatus[task.id] === "failed" ? (
                          <div className="p-3 bg-red-50 rounded-md flex items-center gap-3 text-red-600">
                            <AlertCircle size={18} />
                            <p className="text-sm">
                              Failed to fetch weather data.{" "}
                              <button
                                onClick={() =>
                                  dispatch(fetchWeatherForTask(task.id))
                                }
                                className="text-red-700 underline"
                              >
                                Try again
                              </button>
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              dispatch(fetchWeatherForTask(task.id))
                            }
                            className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 text-left"
                          >
                            Click to load weather for {task.location}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
