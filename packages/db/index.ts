import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const EdgesScheme = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const PositionSchema = new Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const NodeDataSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["ACTION", "TRIGGER"],
      required: true,
    },
    metadata: Schema.Types.Mixed,
  },
  {
    _id: false,
  }
);

const WorkflowNodesSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    nodeId: {
      type: mongoose.Types.ObjectId,
      ref: "Nodes",
      required: true,
    },
    data: NodeDataSchema,
    position: PositionSchema,
    credentials: {
      type: Schema.Types.Mixed,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const WorkflowSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  nodes: [WorkflowNodesSchema],
  edges: [EdgesScheme],
});

const CredentialsTypeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    required: true,
  },
});

const metadataTypeSchema = new Schema(
  {
    kind: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    values: {
      type: String,
    },
  },
  { _id: false }
);

const NodesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["ACTION", "TRIGGER"],
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  credentialsType: [CredentialsTypeSchema],
  metadataSchema: [metadataTypeSchema],
});

const ExecutionSchema = new Schema({
  workflowId: {
    type: mongoose.Types.ObjectId,
    ref: "Workflows",
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILURE"],
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  endTime: {
    type: Date,
  },
});

export const UserModel = mongoose.model("Users", UserSchema);
export const WorkflowModel = mongoose.model("Workflows", WorkflowSchema);
export const NodesModel = mongoose.model("Nodes", NodesSchema);
export const ExecutionModel = mongoose.model("Executions", ExecutionSchema);
