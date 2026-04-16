import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID from '@/models/AfriflowID'
import { getUserFromRequest } from '@/lib/auth'

// POST /api/id/projects — add a project to the authenticated user's AfriflowID
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, toolsUsed, outcomeDescription, liveUrl, screenshotUrl } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'title and description are required' }, { status: 400 })
    }

    await connectDB()

    const record = await AfriflowID.findOneAndUpdate(
      { userId: payload.userId },
      {
        $push: {
          projects: {
            title: String(title).trim(),
            description: String(description).trim(),
            toolsUsed: Array.isArray(toolsUsed) ? toolsUsed : [],
            outcomeDescription: outcomeDescription ? String(outcomeDescription).trim() : '',
            liveUrl: liveUrl || undefined,
            screenshotUrl: screenshotUrl || undefined,
            verifiedByEmployer: false,
            completedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    )

    if (!record) {
      return NextResponse.json(
        { error: 'AfriflowID not found — call GET /api/id/me to initialise your ID' },
        { status: 404 }
      )
    }

    // Trigger score recalculation by saving
    await record.save()

    return NextResponse.json({
      data: record.projects[record.projects.length - 1],
      verificationScore: record.verificationScore,
    })
  } catch (err) {
    console.error('POST /api/id/projects error:', err)
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 })
  }
}

// DELETE /api/id/projects — remove a project by its _id
export async function DELETE(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { projectId } = await req.json()
    if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })

    await connectDB()

    const record = await AfriflowID.findOneAndUpdate(
      { userId: payload.userId },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    )

    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await record.save()

    return NextResponse.json({ success: true, verificationScore: record.verificationScore })
  } catch (err) {
    console.error('DELETE /api/id/projects error:', err)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
