import { create } from 'zustand'
import { type FlowNode } from '../lib/api/flows'

type StudioState = {
  selectedNode: FlowNode | null
  setSelectedNode: (node: FlowNode | null) => void
  demoStep: number | null
  setDemoStep: (step: number | null) => void
}

export const useStudioStore = create<StudioState>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  demoStep: null,
  setDemoStep: (step) => set({ demoStep: step }),
}))
