import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateWorkflow from "./components/CreateWorkflow";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/create-workflow" element={<CreateWorkflow />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
