import { getWorkflows, type Workflow } from "@/lib/http";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllWorkflows = async () => {
    try {
      const allWorkFlows = await getWorkflows();
      console.log("All Workflows: ", allWorkFlows);
      setWorkflows(allWorkFlows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWorkflows();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white px-10 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">
            ⚡ Automation Genie
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your automated trading workflows
          </p>
        </div>

        <button onClick={() => navigate("/create-workflow")} className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold">
          + New Workflow
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center mt-40">
          <p className="text-gray-400 text-lg animate-pulse">
            Loading workflows...
          </p>
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-40 text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No workflows yet
          </h2>
          <p className="text-gray-400 mb-6">
            Create your first automation for Lighter, Backpack or Hyperliquid.
          </p>
          <button onClick={() => navigate("/create-workflow")} className="px-6 py-3 rounded bg-green-600 hover:bg-green-700 transition font-semibold">
            Create Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflows.map(({ _id, nodes, edges }) => (
            <div
              key={_id}
              className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition shadow-lg"
            >
              {/* Card Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold truncate">
                  Workflow
                </h3>
                <span className="text-xs text-gray-400">
                  ID: {_id.slice(0, 8)}...
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Nodes</span>
                  <span className="font-semibold">{nodes.length}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Edges</span>
                  <span className="font-semibold">{edges.length}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button onClick={() => navigate(`/workflow/${_id}`)} className="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition text-sm font-semibold">
                  Open
                </button>

                <button className="flex-1 px-4 py-2 rounded border border-gray-600 hover:border-red-500 hover:text-red-400 transition text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
