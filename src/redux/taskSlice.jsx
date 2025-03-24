import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;

export const fetchWeatherForTask = createAsyncThunk(
  "tasks/fetchWeatherForTask",
  async (taskId, { getState }) => {
    const { tasks } = getState();
    const task = tasks.items.find((t) => t.id === taskId);

    if (!task || !task.location) {
      throw new Error("No location specified for this task");
    }

    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: task.location,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });

    return {
      taskId,
      weather: {
        temp: response.data.main.temp,
        condition: response.data.weather[0].main,
        icon: response.data.weather[0].icon,
      },
    };
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  weatherStatus: {},
  currentlyEditing: null, // Track which task is being edited
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ title, priority, location }) {
        return {
          payload: {
            id: Date.now(),
            title,
            priority: priority || "medium",
            location,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
    },
    toggleTask(state, action) {
      const task = state.items.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
      }
    },
    deleteTask(state, action) {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
    updateTaskPriority(state, action) {
      const { id, priority } = action.payload;
      const task = state.items.find((task) => task.id === id);
      if (task) {
        task.priority = priority;
        task.updatedAt = new Date().toISOString();
      }
    },
    clearWeatherStatus(state, action) {
      delete state.weatherStatus[action.payload];
    },
    startEditingTask(state, action) {
      state.currentlyEditing = action.payload;
    },
    cancelEditingTask(state) {
      state.currentlyEditing = null;
    },
    updateTask(state, action) {
      const { id, title, priority, location } = action.payload;
      const task = state.items.find((task) => task.id === id);
      if (task) {
        task.title = title;
        task.priority = priority;
        task.location = location;
        task.updatedAt = new Date().toISOString();
        state.currentlyEditing = null;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchWeatherForTask.pending, (state, action) => {
        state.weatherStatus[action.meta.arg] = "loading";
      })
      .addCase(fetchWeatherForTask.fulfilled, (state, action) => {
        const { taskId, weather } = action.payload;
        const task = state.items.find((t) => t.id === taskId);
        if (task) {
          task.weather = weather;
        }
        state.weatherStatus[taskId] = "succeeded";
      })
      .addCase(fetchWeatherForTask.rejected, (state, action) => {
        state.weatherStatus[action.meta.arg] = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addTask,
  toggleTask,
  deleteTask,
  updateTaskPriority,
  clearWeatherStatus,
  startEditingTask,
  cancelEditingTask,
  updateTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
