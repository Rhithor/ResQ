ResQ Radar
Because seconds matter when lives are on the line.

ResQ Radar is a real-time tactical dashboard designed to bridge the critical gap between victims in distress and the volunteers ready to assist them. In disaster scenarios, communication often breaks down into chaotic phone calls and static spreadsheets. We built this system to replace that chaos with a live, visual command center that updates instantly.

When a victim sends an SOS, it does not just sit in a database—it appears immediately on a tactical radar scan, triggering alerts for all connected volunteers. The goal is simple: turn raw data into coordinated rescue missions with sub-second latency.

Key Features
• Real-Time Incident Visualization: A tactical interface that visualizes emergency signals as they occur, providing an immediate overview of the disaster zone.

• Instant SOS Propagation: Utilizes WebSockets to broadcast distress calls to all connected clients instantly, ensuring no delay between a request for help and volunteer awareness.

• Precision Tracking: Integrated mapping modal that allows volunteers to pinpoint exact victim locations and coordinate approach routes.

• Audio-Visual Alerting: Sonar-style audio cues paired with visual indicators ensure high-priority signals capture attention immediately, even in high-stress environments.

• Secure Volunteer Access: Protected routes and dashboard access managed via Google OAuth to ensure only authorized personnel can view sensitive victim data.


The Tech Stack
ResQ Radar is built on a modern, type-safe, and scalable architecture designed for reliability:

• Frontend: Next.js 16 (App Router), Tailwind CSS, Lucide React.

• Backend: Node.js, Express, Socket.io (handling real-time bi-directional event flows).

• Database: PostgreSQL hosted on Supabase.

• ORM: Prisma (providing type-safe database queries and schema management).

• Authentication: Next-Auth with Google Provider.


Installation & Setup

Follow these steps to get the system running locally.

1. Clone the Repository
git clone https://github.com/yourusername/resq-radar.git
cd resq-radar

2. Backend Configuration
The backend handles the WebSocket connections and database interactions.

cd backend
npm install

Environment Variables: Create a .env file in the backend directory with the following credentials:

PORT=5000
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.supabase.co:5432/postgres"

Database Migration: Run Prisma to sync your local schema with the remote Supabase database.

npx prisma migrate dev --name init

Start the Server:

npm run dev


3. Frontend Configuration
Open a new terminal window to set up the client-side dashboard.

cd ../frontend
npm install

Environment Variables: Create a .env file in the frontend directory:

NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_string
GOOGLE_CLIENT_ID=your_google_cloud_client_id
GOOGLE_CLIENT_SECRET=your_google_cloud_client_secret

Start the Application:

npm run dev

Open http://localhost:3000 in your browser to access the dashboard.


License

This project is licensed under the MIT License