import Link from "next/link";
import Sidebar from "../component/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
  <Sidebar/>
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Welcome to Learnfinity Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <StatsCard title="Total Users" value="1,234" icon="👤" />
          <StatsCard title="Total Lessons" value="45" icon="📚" />
          <StatsCard title="Total Activities" value="120" icon="🎯" />
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Recent Activity</h3>
          <ul className="space-y-4">
            <li className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl mr-4">🎉</span>
              <div>
                <p className="font-semibold">New user registered</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </li>
            <li className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl mr-4">📚</span>
              <div>
                <p className="font-semibold">New lesson added</p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </li>
            <li className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl mr-4">🎯</span>
              <div>
                <p className="font-semibold">New activity completed</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center">
        <span className="text-3xl mr-4">{icon}</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}