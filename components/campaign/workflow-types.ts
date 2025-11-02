export interface PlaceholderOption {
  id: string
  label: string
  description?: string
  example?: string
}

export interface PlaceholderGroup {
  id: string
  label: string
  options: PlaceholderOption[]
}

export interface WorkflowNodeInput {
  name: string
  sourceNodeId: string
  sourceOutput: string
  required?: boolean
}

export interface WorkflowAvailableOutput {
  name: string
  description?: string
  placeholder: string
}

export interface WorkflowAvailableSource {
  nodeId: string
  nodeLabel: string
  outputs: WorkflowAvailableOutput[]
}

export interface PlaceholderContext {
  placeholders: PlaceholderGroup[]
  availableSources: WorkflowAvailableSource[]
}
