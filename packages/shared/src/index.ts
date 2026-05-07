export interface SystemMetrics {
  cpuModel: string
  cpuCores: number
  cpuUsage: number
  memoryTotal: number
  memoryUsed: number
  gpuModel: string | null
  gpuUsage: number | null
  timestamp: number
}

export interface WorkflowNode {
  id: string
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
  output?: string
}

export interface Workflow {
  id: string
  nodes: WorkflowNode[]
  createdAt: string
}

export interface StepLog {
  step: string
  message: string
  timestamp: string
}

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  answer: string
  workflow: Workflow
  run_id: string
  logs: StepLog[]
}
