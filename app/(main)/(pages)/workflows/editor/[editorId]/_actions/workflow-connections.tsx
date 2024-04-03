'use server'

import { db } from '@/lib/db'

export const onCreateNodesEdges = async (
  flowId: string,
  nodes: string,
  edges: string,
  flowPath: string
) => {
  try {
    const originalFlow = await db.workflows.findUnique({
      where: {
        id: flowId,
      },
      select: {
        name: true,
      },
    })

    if (!originalFlow) {
      throw new Error('Flow not found')
    }

    const updatedName = originalFlow.name.includes("(updated)") ? originalFlow.name : `${originalFlow.name} (updated)`

    const updatedFlow = await db.workflows.update({
      where: {
        id: flowId,
      },
      data: {
        nodes,
        edges,
        flowPath,
        name: updatedName,
      },
    })

    if (updatedFlow) {
      return { message: 'flow saved' }
    } else {
      throw new Error('Failed to update workflow')
    }
  } catch (error) {
    console.error('Error in onCreateNodesEdges:', error)
    throw error
  }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  console.log(state)
  const published = await db.workflows.update({
    where: {
      id: workflowId,
    },
    data: {
      publish: state,
    },
  })

  if (published?.publish) return 'Workflow published'
  return 'Workflow unpublished'
}
