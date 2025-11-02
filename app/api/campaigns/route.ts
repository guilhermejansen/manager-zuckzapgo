import { NextRequest, NextResponse } from "next/server"

import { CampaignStatus, CampaignType, UserRole } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { campaignSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") as CampaignStatus | null
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where = status ? { status } : {}

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          _count: {
            select: {
              messages: true,
              contactLists: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.campaign.count({ where }),
    ])

    return NextResponse.json({
      campaigns,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = campaignSchema.parse(body)

    // TODO: In production, get userId from session/auth context
    // For now, accept it from request body or use a default value
    const userId = body.userId || "default-user-id"

    // Create the campaign
    const campaign = await prisma.campaign.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        type: validatedData.type as CampaignType,
        status: CampaignStatus.DRAFT,
        workflow: JSON.parse(JSON.stringify(validatedData.workflow)),
        userId: userId,
        userRole: UserRole.USER,
        contactLists: validatedData.contactListId
          ? {
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

    return NextResponse.json(campaign, { status: 201 })
  } catch (error: any) {
    console.error("Error creating campaign:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
