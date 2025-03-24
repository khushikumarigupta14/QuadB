import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store, { persistor } from "./store";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskManager from "./pages/TaskManager";
// import Navbar from "./pages/Navbar"; // Ensure Navbar is imported

// Create ThemeContext

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/task" element={<TaskManager />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
