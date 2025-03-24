import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { PlusCircle, MapPin } from "lucide-react";
import { addTask } from "../../redux/taskSlice";

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

export default function TaskInput() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [location, setLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(addTask({ title, priority, location }));
    setTitle("");
    setPriority("medium");
    setLocation("");
    setShowLocationInput(false);
    inputRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          aria-label="Add task"
        >
          <PlusCircle size={24} />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Priority:</span>
          <div className="flex gap-1">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPriority(option.value)}
                className={`px-3 py-1 text-xs rounded-full text-white ${
                  option.color
                } ${
                  priority === option.value
                    ? "ring-2 ring-offset-1 ring-gray-400"
                    : "opacity-70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowLocationInput(!showLocationInput)}
          className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <MapPin size={16} />
          {showLocationInput ? "Cancel" : "Add Location"}
        </button>
      </div>

      {showLocationInput && (
        <div className="mt-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location (e.g., 'London')"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Adding a location will enable weather information for this task
          </p>
        </div>
      )}
    </form>
  );
}
