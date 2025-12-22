import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateWorkflow from "./components/CreateWorkflow";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Landing from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import WorkflowDetails from "./pages/WorkflowDetails";
import WorkflowExecutions from "./pages/WorkflowExecutions";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create-workflow" element={<CreateWorkflow />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflow/:workflowId" element={<WorkflowDetails />} />
          <Route path="/workflow/executions/:workflowId" element={<WorkflowExecutions />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
