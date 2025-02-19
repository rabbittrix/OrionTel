Create detailed components with these requirements:
1. Use 'use client' directive for client-side components
2. Style with Tailwind CSS utility classes for responsive design
3. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
4. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
5. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
6. Create root layout.tsx page that wraps necessary navigation items to all pages
7. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
8. Accurately implement necessary grid layouts
9. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping

System Resource Monitoring Dashboard UI
</summary_title>

<image_analysis>

1. Navigation Elements:
- Top header with: Sistema, Agenda, Email, Fax, PBX, IM, Reports
- Secondary header with: Dashboard, Network, Usuarios, Shutdown, Hardware Detector, Updates, Backup/Restore, Preferences
- Left sidebar with: Dashboard, Bookmarks, Idioma, Asterisk File Editor, Monitoring, Historia, Addons, Firewall Rules, Advanced Settings, PBX Configuration


2. Layout Components:
- Main content area divided into 4 quadrants
- System resource gauges: 300x300px each
- Performance graph: ~500x300px
- Disk usage pie chart: ~300x300px
- News feed section: ~500x300px


3. Content Sections:
- System Resources (CPU, RAM, SWAP gauges)
- Performance Graph (time-series data)
- Disk Usage (pie chart with statistics)
- News Feed (dated entries with icons)


4. Interactive Controls:
- Refresh buttons on each panel
- Collapsible panel headers
- Interactive graph with hover states
- Clickable news items


5. Colors:
- Primary Blue: #0066CC (header background)
- Secondary Gray: #F5F5F5 (panel backgrounds)
- Accent Red: #FF0000 (graph lines)
- System Gauges:
  - Green: #00FF00
  - Blue: #0000FF
  - Red: #FF0000


6. Grid/Layout Structure:
- 2x2 grid layout for main content
- Fixed-width left sidebar: 200px
- Responsive main content area
- 15px padding between panels
</image_analysis>

<development_planning>

1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Header
│   │   ├── Sidebar
│   │   └── Dashboard
│   ├── features/
│   │   ├── SystemGauges
│   │   ├── PerformanceGraph
│   │   ├── DiskUsage
│   │   └── NewsFeed
│   └── shared/
├── assets/
├── styles/
├── hooks/
└── utils/
```

1.2. Project Structure Backend:

├── backend/
│   ├── src/                  # Core application code written in Rust/C
│   ├── models/               # AI/ML models and related scripts
│   ├── config/               # Configuration files
│   └── tests/                # Unit and integration tests
├── docker/
│   ├── Dockerfile            # Instructions for building the container image
│   └── docker-compose.yml    # Multi-container orchestration file
├── docs/                     # Documentation for users and developers
├── scripts/                  # Helper scripts for setup and maintenance
└── README.md                 # Project overview and installation guide

  # Development Roadmap
      Phase 1: Planning & Research
      Define project scope and requirements.
      Conduct feasibility studies for satellite integration and AI/ML implementation.
      Phase 2: Core Development
      Develop the backend in Rust/C.
      Implement basic telephony functionalities (call routing, voicemail, etc.).
      Phase 3: Frontend Development
      Build the web interface using Next.js.
      Design intuitive dashboards for administrators and end-users.
      Phase 4: Advanced Features
      Integrate AI/ML models for security and automation.
      Add support for satellite communication.
      Phase 5: Testing & Optimization
      Perform unit testing, integration testing, and stress testing.
      Optimize performance for resource-constrained environments.
      Phase 6: Deployment
      Package the application as a Docker image.
      Provide clear documentation for installation and usage.



2. Key Features:
- Real-time system resource monitoring
- Interactive performance graphs
- Disk usage visualization
- News feed integration
- Multi-language support


3. State Management:
```typescript
interface AppState {
├── systemResources: {
│   ├── cpu: number
│   ├── ram: number
│   ├── swap: number
├── }
├── diskUsage: {
│   ├── total: number
│   ├── used: number
│   └── available: number
├── }
└── performanceMetrics: TimeSeriesData[]
}
```


4. Routes:
```typescript
const routes = [
├── '/dashboard',
├── '/network/*',
├── '/users/*',
└── '/settings/*'
]
```


5. Component Architecture:
- DashboardLayout (container)
- SystemGauges (real-time monitors)
- PerformanceGraph (D3.js implementation)
- DiskUsageChart (SVG pie chart)
- NewsFeed (dynamic list)


6. Responsive Breakpoints:
```scss
$breakpoints: (
├── 'small': 768px,
├── 'medium': 1024px,
├── 'large': 1280px,
└── 'xlarge': 1440px
);
```
</development_planning>

Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- Administrative: /sistema, /preferences, /advanced-settings, /updates, /backup-restore
- Communication: /agenda, /email, /fax, /pbx, /im
- Monitoring: /reports, /dashboard, /monitoring, /network
- User Management: /usuarios, /bookmarks, /idioma
- System: /shutdown, /hardware-detector, /firewall-rules
- PBX Specific: /asterisk-file-editor, /pbx-configuration
- Miscellaneous: /historia, /addons

Page Implementations:
/sistema:
Core Purpose: System overview and main administration hub
Key Components
- System status dashboard
- Quick action buttons
- Resource usage meters
- Alert notifications
Layout Structure
- Grid-based layout
- Collapsible sidebar
- Responsive header

/agenda:
Core Purpose: Calendar and scheduling management
Key Components
- Calendar view (month

/day)
- Event creation form
- Meeting scheduler
- Reminder system
Layout Structure:
- Split view (calendar + details)
- Mobile-responsive calendar
- Floating action buttons

/email:
Core Purpose: Email client and management
Key Components
- Inbox interface
- Email composer
- Filter controls
- Search functionality
Layout Structure
- Three-column layout
- Collapsible panels
- Mobile-first inbox view

/pbx:
Core Purpose: PBX system management
Key Components
- Extension manager
- Call routing rules
- Queue management
- Voice mail settings
Layout Structure
- Tabbed interface
- Configuration panels
- Status indicators

Layouts:
AdminLayout:
Applicable routes
- /sistema
- /advanced-settings
- /preferences
Core components
- Admin navigation
- System status bar
- User profile
Responsive behavior
- Collapsible sidebar
- Stack on mobile
- Floating action menu

CommunicationLayout
Applicable routes
- /email
- /fax
- /im
Core components
- Communication toolbar
- Status indicators
- Quick actions
Responsive behavior
- Adaptive columns
- Touch-friendly controls
- Condensed mobile view

MonitoringLayout
Applicable routes
- /dashboard
- /reports
- /monitoring
Core components
- Real-time data displays
- Chart containers
- Alert system
Responsive behavior
- Responsive charts
- Grid reorganization
- Mobile optimized views

For each remaining route, similar detailed implementations would follow the same pattern, with specific components and layouts tailored to their functionality. Would you like me to continue with more specific routes?
