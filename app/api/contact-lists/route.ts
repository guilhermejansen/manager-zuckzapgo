import { NextRequest, NextResponse } from "next/server"

import { ContactSource, ContactType } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const contactLists = await prisma.contactList.findMany({
      include: {
        _count: {
          select: {
            contacts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(contactLists)
  } catch (error) {
    console.error("Error fetching contact lists:", error)
    return NextResponse.json({ error: "Failed to fetch contact lists" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const contactList = await prisma.contactList.create({
      data: {
        name: body.name,
        description: body.description || null,
        source: body.source || ContactSource.MANUAL,
        type: body.type || ContactType.INDIVIDUAL,
      },
      include: {
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    })

    return NextResponse.json(contactList, { status: 201 })
  } catch (error) {
    console.error("Error creating contact list:", error)
    return NextResponse.json({ error: "Failed to create contact list" }, { status: 500 })
  }
}
