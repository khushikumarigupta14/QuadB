# Advanced Todo Application - Technical Documentation

## Overview
A feature-rich task management application with authentication, weather integration, and responsive design. Demonstrates modern React patterns and best practices.

## Core Features

### 1. Authentication System
- **Secure Login Flow**  
  - JWT-based mock authentication
  - Protected route implementation
  - Session persistence using Redux Persist
  - Form validation and error handling

### 2. Task Management Engine
- **CRUD Operations**  
  - Add tasks with priorities (High/Medium/Low)
  - Toggle completion status
  - Delete tasks with confirmation
  - Edit task details in-place
- **Advanced Features**  
  - Location-based weather integration
  - Priority-based color coding
  - Sortable task lists (by date/priority)
  - Expandable task details panel

### 3. Weather Integration
- **Real-time Data**  
  - OpenWeatherMap API integration
  - Automatic weather fetching for location-tagged tasks
  - Visual weather condition indicators
  - Temperature display in metric units
- **Robust Error Handling**  
  - API failure fallbacks
  - Loading states
  - Location validation

## Technical Architecture

### Frontend Stack
| Category        | Technology          | Purpose                          |
|-----------------|---------------------|----------------------------------|
| Core Framework  | React 18            | Component-based UI architecture  |
| Build Tool      | Vite                | Ultra-fast development tooling   |
| State Management| Redux Toolkit       | Centralized state with Thunk     |
| Routing         | React Router 6      | Client-side navigation           |
| Styling         | Tailwind CSS        | Utility-first CSS framework      |
| Icons           | Lucide React        | Consistent iconography           |

### Key Libraries
- **date-fns** - Modern date formatting utilities
- **Axios** - Promise-based HTTP client
- **Redux Persist** - LocalStorage state persistence

## Implementation Highlights
## User Workflow Flow
```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Components
    participant A as Auth API (Mock)
    participant S as Redux Store
    participant T as Todo API
    participant W as Weather API

    %% Registration Flow
    U->>UI: Accesses Registration Page
    UI->>U: Displays Registration Form
    U->>UI: Fills and Submits Form
    UI->>A: POST /register (username, password)
    A-->>UI: Returns mock success response
    UI->>S: dispatch(registerSuccess(user))
    S->>UI: Update auth state
    UI->>U: Show success, redirect to login

    %% Login Flow
    U->>UI: Accesses Login Page
    UI->>U: Displays Login Form
    U->>UI: Enters credentials
    UI->>A: POST /login (username, password)
    A-->>UI: Returns mock JWT token
    UI->>S: dispatch(loginSuccess(token, user))
    S->>UI: Update auth state
    UI->>U: Redirect to Dashboard

    %% Dashboard Interaction
    U->>UI: Views Dashboard
    UI->>S: Check auth state
    S-->>UI: Confirms authenticated
    UI->>U: Shows Todo Dashboard

    %% Todo Creation
    U->>UI: Clicks "Add Task"
    UI->>U: Shows Task Form
    U->>UI: Enters task details (title, priority, location)
    UI->>S: dispatch(addTask(taskData))
    S->>UI: Update tasks state
    alt Has Location
        UI->>W: GET /weather?location=...
        W-->>UI: Returns weather data
        UI->>S: dispatch(updateTaskWeather(taskId, weather))
    end
    UI->>U: Displays new task with weather (if applicable)

    %% Task Management
    U->>UI: Marks task complete
    UI->>S: dispatch(toggleTask(taskId))
    U->>UI: Deletes task
    UI->>S: dispatch(deleteTask(taskId))
    U->>UI: Sorts tasks
    UI->>S: dispatch(setSortCriteria(field, direction))