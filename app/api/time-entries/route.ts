import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { startTime, projectId, hours, description } = await request.json();

    // Validate required fields
    if (!startTime || !projectId || !hours || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate hours is positive
    if (parseFloat(hours) <= 0) {
      return NextResponse.json(
        { error: "Hours must be positive" },
        { status: 400 },
      );
    }

    // Create the time entry
    const timeEntry = await prisma.timeEntry.create({
      data: {
        startTime: new Date(startTime),
        projectId: parseInt(projectId),
        hours: parseFloat(hours),
        description,
      },
    });

    return NextResponse.json(timeEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
