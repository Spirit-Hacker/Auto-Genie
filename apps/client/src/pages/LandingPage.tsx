import { isAuthenticated } from "@/lib/http";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          ⚡ Automation Genie
        </h1>

        <div className="space-x-4">
          {!loggedIn ? (
            <>
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 rounded border border-gray-600 hover:border-white transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 rounded bg-green-600 hover:bg-green-700 transition font-semibold"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-24">
        <h2 className="text-5xl font-extrabold mb-6 leading-tight">
          Automate Your <span className="text-green-400">Crypto Trading</span>
        </h2>

        <p className="max-w-2xl text-gray-400 text-lg mb-10">
          Automation Genie lets you build powerful trading automations for
          <span className="text-white font-semibold"> Lighter</span>,
          <span className="text-white font-semibold"> Backpack</span> and
          <span className="text-white font-semibold"> Hyperliquid</span>
          — without writing a single line of code.
        </p>

        {/* CTA Buttons */}
        {!loggedIn ? (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 transition text-lg font-semibold"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 rounded border border-gray-600 hover:border-white transition text-lg"
            >
              Login
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 rounded bg-green-600 hover:bg-green-700 transition text-lg font-semibold"
          >
            Open Dashboard
          </button>
        )}
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 mt-32">
        {[
          {
            title: "Strategy Automation",
            desc: "Create triggers and actions to automate your trades with precision.",
          },
          {
            title: "Multi-Exchange Support",
            desc: "Trade seamlessly across Lighter, Backpack and Hyperliquid.",
          },
          {
            title: "Real-Time Execution",
            desc: "Low-latency execution powered by event-based automation.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-10 mt-24">
        © {new Date().getFullYear()} Automation Genie. All rights reserved.
      </footer>
    </div>
  );
}
