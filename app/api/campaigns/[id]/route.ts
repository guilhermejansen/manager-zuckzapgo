import { NextRequest, NextResponse } from "next/server"

import { CampaignStatus } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { campaignSchema } from "@/lib/validations"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        contactLists: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            messages: true,
            contactLists: true,
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if campaign exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
    })

    if (!existingCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Validate the request body
    const validatedData = campaignSchema.partial().parse(body)

    // Update the campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        workflow: validatedData.workflow
          ? JSON.parse(JSON.stringify(validatedData.workflow))
          : undefined,
        contactLists: validatedData.contactListId
          ? {
              set: [],
              connect: [{ id: validatedData.contactListId }],
            }
          : undefined,
      },
      include: {
        contactLists: true,
        _count: {
          select: {
            messages: true,
            contactLists: true,
          },
        },
      },
    })

    return NextResponse.json(campaign)
  } catch (error: any) {
    console.error("Error updating campaign:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if campaign exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
      select: { status: true },
    })

    if (!existingCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Don't delete running campaigns
    if (existingCampaign.status === CampaignStatus.RUNNING) {
      return NextResponse.json({ error: "Cannot delete a running campaign" }, { status: 400 })
    }

    // Delete the campaign
    await prisma.campaign.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 })
  }
}
