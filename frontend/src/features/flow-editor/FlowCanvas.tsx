import { useCallback, useEffect, useRef } from 'react'
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type NodeProps,
  type NodeTypes,
  type OnConnect,
  type OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { type FlowEdge, type FlowNode, type NodeType } from '../../lib/api/flows'
import { useStudioStore } from '../../store/studioStore'

// ─── Node data stored inside every RF node ────────────────────────────────────

type DTSNodeData = {
  label: string
  condition: string
  action: string
  priority: number
  /** Original node.data object (label, etc.) – needed to round-trip back to FlowNode */
  originalData: Record<string, unknown>
}

type DTSNode = Node<DTSNodeData>

// ─── Conversion helpers ───────────────────────────────────────────────────────

function toRFNode(node: FlowNode): DTSNode {
  return {
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      label: String(node.data.label ?? node.id),
      condition: node.condition,
      action: node.action,
      priority: node.priority,
      originalData: node.data,
    },
  }
}

/** Self-contained: no need for apiNodesRef – the RF node carries all API fields */
function rfNodeToApiNode(rfNode: DTSNode): FlowNode {
  return {
    id: rfNode.id,
    type: rfNode.type as NodeType,
    position: rfNode.position,
    data: rfNode.data.originalData,
    condition: rfNode.data.condition,
    action: rfNode.data.action,
    priority: rfNode.data.priority,
  }
}

function toRFEdge(edge: FlowEdge): Edge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: '#9ca3af' },
    style: { stroke: '#9ca3af', strokeWidth: 1.5 },
  }
}

// ─── Node type visual config ──────────────────────────────────────────────────

const NODE_META: Record<
  NodeType,
  {
    typeLabel: string
    container: string
    containerSelected: string
    badge: string
    text: string
    meta: string
  }
> = {
  decision: {
    typeLabel: 'DECISION',
    container: 'rounded-lg border-2 border-blue-300 bg-blue-50 shadow-sm transition-shadow',
    containerSelected: 'border-blue-600 shadow-blue-200 shadow-lg',
    badge: 'bg-blue-100 text-blue-700',
    text: 'text-blue-900',
    meta: 'text-blue-400',
  },
  boundary: {
    typeLabel: 'BOUNDARY',
    container: 'rounded-lg border-2 border-red-300 bg-red-50 shadow-sm transition-shadow',
    containerSelected: 'border-red-600 shadow-red-200 shadow-lg',
    badge: 'bg-red-100 text-red-700',
    text: 'text-red-900',
    meta: 'text-red-400',
  },
  human_gate: {
    typeLabel: 'HUMAN GATE',
    container:
      'rounded-lg border-2 border-amber-300 bg-amber-50 shadow-sm transition-shadow',
    containerSelected: 'border-amber-600 shadow-amber-200 shadow-lg',
    badge: 'bg-amber-100 text-amber-700',
    text: 'text-amber-900',
    meta: 'text-amber-400',
  },
  fallback: {
    typeLabel: 'FALLBACK',
    container: 'rounded-lg border-2 border-gray-300 bg-gray-50 shadow-sm transition-shadow',
    containerSelected: 'border-gray-500 shadow-gray-200 shadow-lg',
    badge: 'bg-gray-100 text-gray-500',
    text: 'text-gray-700',
    meta: 'text-gray-400',
  },
}

// ─── Default values for each node type ───────────────────────────────────────

const NODE_DEFAULTS: Record<
  NodeType,
  { label: string; condition: string; action: string; priority: number }
> = {
  decision: { label: 'New Decision', condition: '', action: 'auto_reply', priority: 10 },
  boundary: {
    label: 'New Boundary',
    condition: '',
    action: 'human_review',
    priority: 10,
  },
  human_gate: {
    label: 'New Human Gate',
    condition: '',
    action: 'human_review',
    priority: 20,
  },
  fallback: {
    label: 'Default',
    condition: 'True',
    action: 'auto_reply',
    priority: 999,
  },
}

// ─── Factory: stable module-level custom node components ─────────────────────

function makeNodeComponent(nodeType: NodeType) {
  const meta = NODE_META[nodeType]

  function NodeComponent({ data, selected }: NodeProps<DTSNode>) {
    return (
      <>
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#d1d5db', border: '1px solid #9ca3af', width: 8, height: 8 }}
        />

        <div
          className={`w-52 px-3 py-2.5 ${meta.container} ${selected ? meta.containerSelected : ''}`}
        >
          {/* type badge + priority */}
          <div className="mb-1.5 flex items-center justify-between gap-1">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.badge}`}
            >
              {meta.typeLabel}
            </span>
            <span className={`text-[10px] font-medium ${meta.meta}`}>p={data.priority}</span>
          </div>

          {/* label */}
          <div className={`mb-1 text-xs font-semibold leading-snug ${meta.text}`}>
            {data.label}
          </div>

          {/* condition snippet */}
          {data.condition && (
            <div className={`truncate font-mono text-[10px] leading-snug ${meta.meta}`}>
              {data.condition}
            </div>
          )}

          {/* action */}
          <div className={`mt-1 text-[10px] ${meta.meta}`}>
            →&nbsp;<span className="font-mono">{data.action}</span>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#d1d5db', border: '1px solid #9ca3af', width: 8, height: 8 }}
        />
      </>
    )
  }

  NodeComponent.displayName = `${nodeType}Node`
  return NodeComponent
}

const nodeTypes: NodeTypes = {
  decision: makeNodeComponent('decision'),
  boundary: makeNodeComponent('boundary'),
  human_gate: makeNodeComponent('human_gate'),
  fallback: makeNodeComponent('fallback'),
}

// ─── Helper: pick position below existing nodes ───────────────────────────────

function nextNodePosition(rfNodes: DTSNode[]) {
  if (rfNodes.length === 0) return { x: 300, y: 150 }
  const cx = rfNodes.reduce((s, n) => s + n.position.x, 0) / rfNodes.length
  const maxY = Math.max(...rfNodes.map((n) => n.position.y))
  return { x: cx, y: maxY + 140 }
}

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND_ITEMS = Object.entries(NODE_META) as [NodeType, (typeof NODE_META)[NodeType]][]

function Legend() {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1">
      {LEGEND_ITEMS.map(([type, meta]) => (
        <span
          key={type}
          className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${meta.badge}`}
        >
          {meta.typeLabel}
        </span>
      ))}
    </div>
  )
}

// ─── FlowCanvas ───────────────────────────────────────────────────────────────

type Props = {
  nodes: FlowNode[]
  edges: FlowEdge[]
  onFlowChange?: (nodes: FlowNode[], edges: FlowEdge[]) => void
}

export function FlowCanvas({ nodes, edges, onFlowChange }: Props) {
  const setSelectedNode = useStudioStore((s) => s.setSelectedNode)
  const selectedNode = useStudioStore((s) => s.selectedNode)

  const [rfNodes, setRfNodes, onNodesChangeBase] = useNodesState<DTSNode>(
    nodes.map(toRFNode),
  )
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(edges.map(toRFEdge))

  // Track deleted node IDs so they don't re-appear when API props refresh
  const deletedNodeIdsRef = useRef(new Set<string>())

  // Stable ref for onFlowChange (avoids stale closure in effects)
  const onFlowChangeRef = useRef(onFlowChange)
  useEffect(() => {
    onFlowChangeRef.current = onFlowChange
  })

  // ── Sync from API props ──────────────────────────────────────────────────
  // Merge strategy:
  //   • API nodes → update data (condition/action/priority/label), preserve drag position
  //   • RF-only nodes (not yet saved to server) → keep as-is
  //   • Nodes the user deleted → excluded via deletedNodeIdsRef
  useEffect(() => {
    setRfNodes((current) => {
      const posMap = new Map(current.map((n) => [n.id, n.position]))
      const propIds = new Set(nodes.map((n) => n.id))

      const fromApi = nodes
        .filter((n) => !deletedNodeIdsRef.current.has(n.id))
        .map((n) => ({
          ...toRFNode(n),
          position: posMap.get(n.id) ?? n.position,
        }))

      // Preserve RF-only nodes (newly added, not yet saved)
      const rfOnly = current.filter(
        (n) => !propIds.has(n.id) && !deletedNodeIdsRef.current.has(n.id),
      )

      return [...fromApi, ...rfOnly]
    })
  }, [nodes, setRfNodes])

  useEffect(() => {
    setRfEdges(edges.map(toRFEdge))
  }, [edges, setRfEdges])

  // ── Push RF state to parent for saving ──────────────────────────────────
  useEffect(() => {
    if (!onFlowChangeRef.current) return
    const apiNodes = rfNodes.map(rfNodeToApiNode)
    const apiEdges: FlowEdge[] = rfEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }))
    onFlowChangeRef.current(apiNodes, apiEdges)
  }, [rfNodes, rfEdges])

  // ── Sync selection highlight (zustand → RF) ──────────────────────────────
  useEffect(() => {
    setRfNodes((nds) =>
      nds.map((n) => ({ ...n, selected: n.id === selectedNode?.id })),
    )
  }, [selectedNode, setRfNodes])

  // ── onNodesChange wrapper: track removals ────────────────────────────────
  const onNodesChange: OnNodesChange<DTSNode> = useCallback(
    (changes) => {
      changes.forEach((c) => {
        if (c.type === 'remove') deletedNodeIdsRef.current.add(c.id)
      })
      onNodesChangeBase(changes)
    },
    [onNodesChangeBase],
  )

  // ── Node click ───────────────────────────────────────────────────────────
  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, rfNode) => {
      const apiNode = rfNodeToApiNode(rfNode as DTSNode)
      setSelectedNode(selectedNode?.id === apiNode.id ? null : apiNode)
    },
    [selectedNode, setSelectedNode],
  )

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  // ── Add node ─────────────────────────────────────────────────────────────
  const handleAddNode = useCallback(
    (nodeType: NodeType) => {
      const defs = NODE_DEFAULTS[nodeType]
      const id = `node-${Date.now().toString(36)}`
      const newNode: DTSNode = {
        id,
        type: nodeType,
        position: nextNodePosition(rfNodes),
        data: {
          label: defs.label,
          condition: defs.condition,
          action: defs.action,
          priority: defs.priority,
          originalData: { label: defs.label },
        },
      }
      setRfNodes((nds) => [...nds, newNode])
    },
    [rfNodes, setRfNodes],
  )

  // ── Delete selected node ─────────────────────────────────────────────────
  const handleDeleteSelected = useCallback(() => {
    if (!selectedNode) return
    deletedNodeIdsRef.current.add(selectedNode.id)
    setRfNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
    setRfEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id,
      ),
    )
    setSelectedNode(null)
  }, [selectedNode, setRfNodes, setRfEdges, setSelectedNode])

  // ── Connect edge ─────────────────────────────────────────────────────────
  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setRfEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: `edge-${Date.now().toString(36)}`,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 14,
              height: 14,
              color: '#9ca3af',
            },
            style: { stroke: '#9ca3af', strokeWidth: 1.5 },
          },
          eds,
        ),
      )
    },
    [setRfEdges],
  )

  return (
    <div className="relative h-full w-full">
      <Legend />

      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Delete', 'Backspace']}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background gap={20} color="#e5e7eb" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const t = node.type as NodeType
            return t === 'boundary'
              ? '#fca5a5'
              : t === 'human_gate'
                ? '#fcd34d'
                : t === 'decision'
                  ? '#93c5fd'
                  : '#d1d5db'
          }}
        />

        {/* ── Add node toolbar ── */}
        <Panel position="top-right">
          <div className="flex flex-col gap-1.5 rounded-lg border border-gray-200 bg-white p-3 shadow-md">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              ノード追加
            </p>
            {(Object.keys(NODE_DEFAULTS) as NodeType[]).map((type) => {
              const meta = NODE_META[type]
              return (
                <button
                  key={type}
                  onClick={() => handleAddNode(type)}
                  className={`rounded px-3 py-1.5 text-left text-xs font-medium transition-opacity hover:opacity-80 ${meta.badge}`}
                >
                  + {meta.typeLabel}
                </button>
              )
            })}
          </div>
        </Panel>

        {/* ── Selected node actions ── */}
        {selectedNode && (
          <Panel position="top-center">
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
              <span className="font-mono text-xs text-gray-500">{selectedNode.id}</span>
              <span className="text-xs text-gray-400">を選択中</span>
              <button
                onClick={handleDeleteSelected}
                className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                削除
              </button>
            </div>
          </Panel>
        )}

        {/* ── Usage hint ── */}
        <Panel position="bottom-left">
          <div className="rounded-md bg-white/80 px-2 py-1.5 text-[10px] text-gray-400 shadow-sm backdrop-blur">
            <div>ドラッグ: ノード移動</div>
            <div>ハンドルからドラッグ: エッジ接続</div>
            <div>Delete / Backspace: 選択要素を削除</div>
            <div>右パネル Apply: ノード設定を保存</div>
            <div>ヘッダー 保存: フロー全体を保存</div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
