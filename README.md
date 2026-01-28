# Job Board Application 

A React-based job board application with advanced filtering, sorting, and bookmarking capabilities.

## 📋 Table of Contents

- [Requirements](#requirements)
- [Setup & Run](#setup--run)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

## Requirements

- Docker
- Node.js (for local development)

## Setup & Run

### Using Docker (Recommended)

1.  **Build and start the application:**
    ```bash
    docker-compose up --build
    ```
2.  **Access the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Development

1.  **Install dependencies:**
    ```bash
    npm install --legacy-peer-deps
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```

## Features

- **Job Listings:** Browse jobs with infinite scroll/pagination (client-side).
- **Filtering:** Filter by Job Type, Skills, and Salary Range.
- **Search:** Instant search by title or company.
- **Sorting:** Sort by Posted Date or Salary.
- **View Modes:** Toggle between Grid and List views.
- **Bookmarking:** Locally persist bookmarked jobs.
- **Tracker:** View all bookmarked jobs in a dedicated page.

## Architecture

### Application Flow

```mermaid
graph TD
    A[User] -->|Visits| B[React App]
    B --> C{Route}
    C -->|/| D[Job Listings Page]
    C -->|/tracker| E[Tracker Page]
    D --> F[Filter Panel]
    D --> G[Search Bar]
    D --> H[Job Cards]
    D --> I[Pagination]
    F --> J[Job Type Filter]
    F --> K[Skills Multi-Select]
    F --> L[Salary Range Slider]
    H --> M[Bookmark Action]
    M --> N[Zustand Store]
    N --> O[LocalStorage]
    E --> N
    E --> P[Bookmarked Jobs Display]
```

### Component Hierarchy

```mermaid
graph TD
    A[App.jsx] --> B[Router]
    B --> C[Layout]
    C --> D[Header]
    C --> E[Main Content]
    E --> F[JobListings Page]
    E --> G[Tracker Page]
    F --> H[Filter Sidebar]
    F --> I[Search & Sort Bar]
    F --> J[Job List Container]
    F --> K[Pagination Controls]
    J --> L[JobCard Component]
    G --> M[JobCard Component]
    L --> N[Bookmark Button]
    M --> N
    N --> O[useJobStore Hook]
```

### Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant S as Zustand Store
    participant LS as LocalStorage
    participant D as Mock Data

    U->>C: Load Page
    C->>D: Fetch Jobs
    D-->>C: Return Jobs Array
    C->>LS: Check Bookmarks
    LS-->>C: Return Bookmark IDs
    C->>S: Initialize Store
    
    U->>C: Click Bookmark
    C->>S: toggleBookmark(jobId)
    S->>LS: Update localStorage
    S-->>C: Update State
    C-->>U: Visual Feedback
    
    U->>C: Apply Filters
    C->>C: Filter Jobs Locally
    C-->>U: Display Filtered Results
```

### State Management

```mermaid
graph LR
    A[User Action] --> B{Action Type}
    B -->|Filter| C[Local State]
    B -->|Bookmark| D[Zustand Store]
    B -->|Search| C
    B -->|Sort| C
    C --> E[Re-render Component]
    D --> F[Update LocalStorage]
    F --> E
    E --> G[Updated UI]
```

### Deployment Architecture

```mermaid
graph TD
    A[Source Code] --> B[Docker Build]
    B --> C[Multi-Stage Build]
    C --> D[Stage 1: Node.js Build]
    C --> E[Stage 2: Nginx Serve]
    D --> F[npm install]
    D --> G[npm run build]
    G --> H[dist/ folder]
    H --> E
    E --> I[Nginx Container]
    I --> J[Port 3000]
    J --> K[Health Check]
    K -->|curl localhost:80| L{Healthy?}
    L -->|Yes| M[Service Ready]
    L -->|No| N[Retry]
```

## Tech Stack

- **React** - UI Library
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **SWR** - Data Fetching (simulation)
- **React Select** - Multi-select component
- **React Slider** - Range slider component
- **Lucide React** - Icon library
- **React Router** - Client-side routing
- **Docker & Nginx** - Containerization and deployment

## Project Structure

```
.
├── public/
│   └── job.ico                 # Favicon
├── src/
│   ├── components/
│   │   └── JobCard.jsx         # Job card component
│   ├── data/
│   │   └── mock-data.json      # Mock job data
│   ├── pages/
│   │   ├── JobListings.jsx     # Main job listings page
│   │   └── Tracker.jsx         # Bookmarked jobs page
│   ├── store/
│   │   └── useJobStore.js      # Zustand store
│   ├── utils/
│   │   └── jobUtils.js         # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies
```

## Key Features Implementation

### Filtering System
- **Job Type**: Radio button selection (All, Remote, Hybrid, Onsite)
- **Skills**: Multi-select dropdown with AND logic (jobs must have ALL selected skills)
- **Salary Range**: Dual-handle slider ($0k - $200k+)

### Bookmark Persistence
- Uses Zustand for state management
- Syncs with `localStorage` under key `bookmarkedJobs`
- Format: JSON array of job IDs `[1, 3, 5]`

### Pagination
- Client-side pagination (10 items per page)
- Next/Previous controls
- Auto-reset to page 1 on filter changes

### View Modes
- **Grid View**: Card-based layout (responsive columns)
- **List View**: Row-based layout with horizontal alignment
