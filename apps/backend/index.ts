import express from "express";
import {
  ExecutionModel,
  NodesModel,
  UserModel,
  WorkflowModel,
} from "db/client";
import mongoose from "mongoose";
import {
  CreateWorkflowSchema,
  SignInSchema,
  SignUpSchema,
  UpdateWorkflowSchema,
} from "common/types";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
import cors from "cors";

const app = express();
mongoose.connect(process.env.MONGO_URL!);

app.use(
  cors({
    origin: "http://localhost:5173", // Vite
    // origin: "http://localhost:3000", // CRA
    credentials: true,
  })
);
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { success, data } = SignUpSchema.safeParse(req.body);
  if (!success) {
    res.status(403).json({
      success: false,
      message: "Incorrect Inputs",
    });
    return;
  }

  try {
    const user = await UserModel.create({
      username: data.username,
      password: data.password,
    });

    res.status(200).json({
      success: true,
      id: user._id,
      message: "Sign up successfull"
    });
  } catch (e) {
    res.status(411).json({
      message: "Username already exists",
      success: false,
    });
  }
});

app.post("/signin", async (req, res) => {
  const { success, data } = SignInSchema.safeParse(req.body);
  if (!success) {
    res.status(403).json({
      success: false,
      message: "Incorrect Inputs",
    });
    return;
  }

  try {
    const user = await UserModel.findOne({
      username: data.username,
      password: data.password,
    });

    if (user) {
      // return user there jwt tokens
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET!
      );

      res.status(200).json({
        success: true,
        id: user._id,
        token,
        message: "Login successfull"
      });
    } else {
      res.status(401).json({
        message: "Inavlid Credentials",
        success: false
      });
    }
  } catch (e) {
    res.status(501).json({
      message: "Internal server error",
      success: false
    });
  }
});

app.post("/workflow", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { success, data } = CreateWorkflowSchema.safeParse(req.body);
  if (!success) {
    res.status(403).json({
      success: false,
      message: "Incorrect Inputs",
    });
    return;
  }

  try {
    const workflow = await WorkflowModel.create({
      userId,
      nodes: data.nodes,
      edges: data.edges,
    });

    res.status(200).json({
      success: true,
      message: "Workflow created successfully",
      workflowId: workflow._id,
    });
  } catch (e) {
    res.status(411).json({
      message: "Falied to create a workflow",
      success: false
    });
  }
});

app.put("/workflow/:workflowId", authMiddleware, async (req, res) => {
  const { success, data } = UpdateWorkflowSchema.safeParse(req.body);
  if (!success) {
    res.status(403).json({
      message: "Incorrect Inputs",
      success: false
    });
    return;
  }

  try {
    const workflow = await WorkflowModel.findByIdAndUpdate(
      req.params.workflowId,
      data,
      { new: true }
    );

    if (!workflow) {
      res.status(404).json({
        message: "Workflow not found",
        success: false
      });
      return;
    }

    res.status(200).json({
      success: true,
      id: workflow._id,
      message: "Workflow updated successfully"
    });
  } catch (e) {
    res.status(411).json({
      message: "Failed to update workflow",
      success: false
    });
  }
});

app.get("/workflow/:workflowId", authMiddleware, async (req, res) => {
  const workflow = await WorkflowModel.findById(req.params.workflowId);
  if (!workflow || req.userId !== workflow.userId.toString()) {
    res.status(404).json({
      message: "Workflow not found",
      success: false
    });
    return;
  }
  res.status(200).json({
    success: true,
    workflow,
    message: "Fetched workflow"
  });
});

app.get(
  "/workflow/executions/:workflowId",
  authMiddleware,
  async (req, res) => {
    // TODO: Make sure workflow belongs to the user

    const executions = await ExecutionModel.find({
      workflowId: req.params.workflowId,
    });

    if (!executions || executions.length <= 0) {
      res.status(404).json({
        success: false,
        message: "Failed to Fetch the executions for selected workflow"
      });
    }

    res.status(200).json({
      executions,
      success: true,
      message: "Fetched the executions for selected workflow"
    });
  }
);

app.get("/workflows", authMiddleware, async (req, res) => {
  const workflows = await WorkflowModel.find({ userId: req.userId });
  res.status(200).json({
    success: true,
    workflows,
    message: "Fetched all the workflows created by the user"
  });
});

app.get("/nodes", async (req, res) => {
  const nodes = await NodesModel.find();
  res.status(200).json({
    nodes,
    success: true,
    message: "Fetched all the nodes"
  });
});

// app.post("/credentials", (req, res) => {});

// app.get("/credentials", (req, res) => {});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started`);
});
