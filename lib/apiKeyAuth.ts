import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from './mongodb'
import APIClient, { IAPIClient } from '@/models/APIClient'
import APILog from '@/models/APILog'

/**
 * Validate an API key from the Authorization header (Bearer <key>)
 * Returns the APIClient doc or null if invalid / rate-limited.
 */
export async function validateAPIKey(
  req: NextRequest,
  endpoint: string
): Promise<{ client: IAPIClient | null; error: string | null; status: number }> {
  const authHeader = req.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) {
    return { client: null, error: 'Missing or invalid Authorization header. Use: Bearer <your-api-key>', status: 401 }
  }

  const rawKey = authHeader.replace('Bearer ', '').trim()
  const prefix = rawKey.slice(0, 9) // e.g. "afr_live_"

  await connectDB()

  // Find all clients with this prefix (should be 1)
  const candidates = await APIClient.find({ apiKeyPrefix: prefix, isActive: true })
  let matched: IAPIClient | null = null
  for (const c of candidates) {
    const ok = await bcrypt.compare(rawKey, c.apiKey)
    if (ok) { matched = c; break }
  }

  if (!matched) {
    return { client: null, error: 'Invalid API key', status: 401 }
  }

  // Check plan allows this endpoint
  const allowed = matched.allowedEndpoints.some((e) => endpoint.includes(e))
  if (!allowed) {
    return { client: null, error: `Your plan does not include access to this endpoint`, status: 403 }
  }

  // Check monthly limit (reset if needed)
  const now = new Date()
  if (now >= matched.resetDate) {
    matched.callsThisMonth = 0
    matched.resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  }

  if (matched.callsThisMonth >= matched.monthlyCallLimit) {
    return {
      client: null,
      error: `Rate limit exceeded. Your ${matched.plan} plan allows ${matched.monthlyCallLimit} calls/month.`,
      status: 429,
    }
  }

  return { client: matched, error: null, status: 200 }
}

/**
 * Log API usage and increment call counters
 */
export async function logAPICall(
  client: IAPIClient,
  endpoint: string,
  method: string,
  responseStatus: number,
  responseTimeMs: number,
  req: NextRequest,
  errorMessage?: string
) {
  try {
    client.callsThisMonth += 1
    client.callsTotal += 1
    await client.save()

    await APILog.create({
      clientId: client._id,
      endpoint,
      method,
      responseStatus,
      responseTimeMs,
      ipAddress: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown',
      errorMessage,
    })
  } catch {
    // non-fatal
  }
}
