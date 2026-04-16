// Twilio WhatsApp helper functions
// Wraps Twilio REST API for sending outbound messages from AfriFlow AI

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ''
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ''
const FROM_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'

const TWILIO_BASE = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`

function twilioAuth(): string {
  return 'Basic ' + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')
}

/**
 * Send a plain text WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    console.log('[WhatsApp DEV]', phone, '→', message.slice(0, 80))
    return true
  }

  const to = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`

  try {
    const res = await fetch(TWILIO_BASE, {
      method: 'POST',
      headers: {
        Authorization: twilioAuth(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: FROM_NUMBER, To: to, Body: message }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error('Twilio sendMessage error:', data)
      return false
    }
    return true
  } catch (err) {
    console.error('sendWhatsAppMessage failed:', err)
    return false
  }
}

/**
 * Send a WhatsApp interactive list message via Twilio
 * (Requires approved WhatsApp Business Account)
 */
export async function sendWhatsAppList(
  phone: string,
  header: string,
  body: string,
  rows: Array<{ id: string; title: string; description?: string }>
): Promise<boolean> {
  // Twilio interactive messages require Content API (templates)
  // For now, render as plain text menu
  const menuText = [
    `*${header}*`,
    body,
    '',
    ...rows.map((r, i) => `${i + 1}. *${r.title}*${r.description ? ` — ${r.description}` : ''}`),
    '',
    '_Reply with the number to select_',
  ].join('\n')

  return sendWhatsAppMessage(phone, menuText)
}

/**
 * Send a WhatsApp button message (rendered as text in fallback)
 */
export async function sendWhatsAppButtons(
  phone: string,
  body: string,
  buttons: Array<{ id: string; title: string }>
): Promise<boolean> {
  const buttonText = [
    body,
    '',
    ...buttons.map((b, i) => `${String.fromCharCode(65 + i)}) ${b.title}`),
    '',
    '_Reply A, B, or C_',
  ].join('\n')

  return sendWhatsAppMessage(phone, buttonText)
}

/**
 * Send a pre-approved Twilio WhatsApp content template
 */
export async function sendWhatsAppTemplate(
  phone: string,
  templateSid: string,
  variables: Record<string, string> = {}
): Promise<boolean> {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    console.log('[WhatsApp DEV] Template:', templateSid, variables)
    return true
  }

  const to = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`

  try {
    const body = new URLSearchParams({
      From: FROM_NUMBER,
      To: to,
      ContentSid: templateSid,
      ContentVariables: JSON.stringify(variables),
    })

    const res = await fetch(TWILIO_BASE, {
      method: 'POST',
      headers: {
        Authorization: twilioAuth(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('Twilio sendTemplate error:', data)
      return false
    }
    return true
  } catch (err) {
    console.error('sendWhatsAppTemplate failed:', err)
    return false
  }
}
