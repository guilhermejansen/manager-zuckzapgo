/**
 * Edit Campaign Page (Server Component)
 *
 * Busca dados da campanha no servidor e renderiza o editor cliente.
 */

import { notFound, redirect } from "next/navigation"

import { getCampaignAction } from "@/app/actions/campaigns"
import { CampaignEditor } from "@/components/campaign/campaign-editor"
import { logger } from "@/lib/logger"
import type { WorkflowFormData } from "@/lib/validations"

interface EditCampaignPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCampaignPage({ params }: EditCampaignPageProps) {
  // Next.js 15: params é uma Promise que precisa ser awaited
  const resolvedParams = await params
  const campaignId = resolvedParams.id

  // Buscar campanha no servidor
  const result = await getCampaignAction(campaignId)

  if (!result.success || !result.data) {
    logger.error("Campaign not found", new Error(result.error || "Campaign not found"), {
      component: "EditCampaignPage",
      action: "loadCampaign",
      metadata: { campaignId },
    })
    notFound()
  }

  const campaign = result.data

  // Apenas campanhas DRAFT podem ser editadas
  if (campaign.status !== "DRAFT") {
    logger.warn("Attempted to edit non-draft campaign", null, {
      component: "EditCampaignPage",
      action: "loadCampaign",
      metadata: { campaignId, status: campaign.status },
    })
    redirect(`/admin/campaigns/${campaignId}`)
  }

  // Preparar dados para o editor cliente
  const workflow = (campaign.workflow as WorkflowFormData) ?? {
    metadata: { version: "1.0.0" },
    nodes: [],
    edges: [],
  }

  // Extrair contactListId da relação many-to-many
  const contactListId = (campaign as any).contactLists?.[0]?.id ?? ""

  const initialData = {
    name: campaign.name,
    description: campaign.description ?? "",
    type: campaign.type as "SINGLE" | "SCHEDULED" | "RECURRING",
    contactListId,
    scheduledAt: campaign.scheduledAt,
    cronExpression: campaign.cronExpression,
    status: campaign.status as
      | "DRAFT"
      | "SCHEDULED"
      | "RUNNING"
      | "PAUSED"
      | "COMPLETED"
      | "CANCELLED"
      | "FAILED",
    workflow,
  }

  return <CampaignEditor campaignId={campaignId} initialData={initialData} />
}
