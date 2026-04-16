/* ═══════════════════════════════════════════════════════════════════════
   AfriFlow AI — Automation Lab: Full step-by-step content for 12 labs
   ═══════════════════════════════════════════════════════════════════════ */

export interface LabStep {
  title: string
  duration: string          // e.g. "5 min"
  content: string           // Markdown-flavoured text (rendered as HTML in the UI)
  code?: string             // optional code block
  codeLang?: string         // e.g. "javascript", "python", "json", "bash"
  tip?: string              // pro-tip callout
  warning?: string          // warning callout
  checkpoint?: string       // "what you should see" validation text
  toolLink?: { label: string; url: string }
}

export interface Lab {
  id: string
  title: string
  desc: string
  longDesc: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  time: string
  tools: string[]
  free: boolean
  icon: string
  category: string
  completions: number
  prerequisites: string[]
  outcomes: string[]
  steps: LabStep[]
}

/* ────────────────────────────────────────────────────────────────────── */
/*  1. WhatsApp Customer Support Bot                                     */
/* ────────────────────────────────────────────────────────────────────── */
const whatsappBot: Lab = {
  id: 'whatsapp-bot',
  title: 'WhatsApp Customer Support Bot',
  desc: 'Build a 24/7 auto-reply bot that handles customer FAQs for your business using Make + WhatsApp Business API.',
  longDesc: 'In this lab you will build a fully working WhatsApp bot that automatically replies to customer messages based on keyword matching. When a customer sends "price", "delivery", or "hours", your bot replies instantly with the right answer. By the end, you\'ll have a live bot running 24/7 — no code needed.',
  difficulty: 'Beginner',
  time: '45 min',
  tools: ['WhatsApp Business API', 'Make (Integromat)'],
  free: true,
  icon: '💬',
  category: 'Automation',
  completions: 3421,
  prerequisites: ['A WhatsApp Business account (free)', 'A Make.com account (free tier works)'],
  outcomes: [
    'A live WhatsApp bot that auto-replies to customer FAQs',
    'Understanding of webhook-based automation',
    'Ability to extend with AI-powered responses later',
  ],
  steps: [
    {
      title: 'Create your Make.com account',
      duration: '3 min',
      content: `Go to **make.com** and sign up for a free account. The free tier gives you 1,000 operations per month — more than enough for this lab.\n\nOnce signed in, you\'ll land on the **Scenarios** dashboard. This is where all your automations live.`,
      tip: 'Use your business email so you can easily connect it to other tools later.',
      toolLink: { label: 'Open Make.com', url: 'https://www.make.com/en/register' },
      checkpoint: 'You should be on the Make.com dashboard with "My Scenarios" visible.',
    },
    {
      title: 'Set up WhatsApp Business API',
      duration: '8 min',
      content: `We\'ll use Meta\'s free WhatsApp Business API (via their Cloud API).\n\n1. Go to **developers.facebook.com** and log in\n2. Click **My Apps → Create App**\n3. Choose **Business** type → Next\n4. Name it "AfriFlow Bot" → Create\n5. On the app dashboard, find **WhatsApp** and click **Set up**\n6. You\'ll get a **temporary phone number** and a **test token**\n7. Copy the **Phone Number ID** and **Access Token** — you\'ll need these\n\nMeta gives you a free test environment. You can send messages to up to 5 verified numbers.`,
      tip: 'Save your Access Token somewhere safe. It expires after 24 hours in test mode — in production you\'ll generate a permanent one.',
      warning: 'Make sure to verify your personal WhatsApp number as a test recipient under "To" numbers.',
      checkpoint: 'You have a Phone Number ID and an Access Token from the Meta developer dashboard.',
      toolLink: { label: 'Meta for Developers', url: 'https://developers.facebook.com/' },
    },
    {
      title: 'Create a new Scenario in Make',
      duration: '3 min',
      content: `Back in Make.com:\n\n1. Click **Create a new scenario**\n2. Click the big **+** button in the centre\n3. Search for **Webhooks** and select **Custom webhook**\n4. Click **Add** → give it a name like "WhatsApp Incoming"\n5. Click **Save** → you\'ll get a **webhook URL** (copy this!)\n\nThis webhook URL is what WhatsApp will call every time someone sends you a message.`,
      checkpoint: 'You have a Make webhook URL that looks like: https://hook.make.com/xxxxx',
    },
    {
      title: 'Connect WhatsApp to your webhook',
      duration: '5 min',
      content: `Go back to the Meta developer dashboard:\n\n1. Navigate to **WhatsApp → Configuration**\n2. Under **Webhook**, click **Edit**\n3. Paste your Make webhook URL in the **Callback URL** field\n4. For **Verify Token**, enter any string (e.g. "afriflow123")\n5. Click **Verify and Save**\n6. Under **Webhook fields**, subscribe to **messages**\n\nNow every incoming WhatsApp message will hit your Make scenario.`,
      warning: 'Make sure your Make scenario is turned ON (the toggle at the bottom-left) before verifying — Make needs to respond to the verification request.',
      checkpoint: 'The webhook shows a green checkmark in Meta\'s dashboard, and "messages" is subscribed.',
    },
    {
      title: 'Build the keyword router',
      duration: '10 min',
      content: `Now we build the brain of the bot — a keyword router that checks the incoming message and sends the right reply.\n\nIn your Make scenario, after the Webhook module:\n\n1. Add a **Router** module (search "Router")\n2. Create **4 routes** (click the wrench icon on each):\n\n**Route 1: Pricing**\n- Filter: Message text → Contains (case insensitive) → "price"\n- Label: "Price inquiry"\n\n**Route 2: Delivery**\n- Filter: Message text → Contains → "delivery" OR "shipping"\n- Label: "Delivery inquiry"\n\n**Route 3: Hours**\n- Filter: Message text → Contains → "hours" OR "open" OR "time"\n- Label: "Business hours"\n\n**Route 4: Default (fallback)**\n- No filter (catches everything else)\n- Label: "Fallback"\n\nThe router checks each message against these filters and sends it down the matching path.`,
      tip: 'Always have a fallback route — it catches messages you didn\'t anticipate and can reply with a helpful default.',
      checkpoint: 'Your scenario shows: Webhook → Router with 4 branches.',
    },
    {
      title: 'Add WhatsApp reply modules',
      duration: '10 min',
      content: `At the end of each route, add a **WhatsApp Business Cloud → Send a Message** module.\n\nFor each module:\n1. **Connection**: Create a new connection → paste your Access Token\n2. **Phone Number ID**: Paste your Phone Number ID\n3. **To**: Map the sender\'s phone number from the webhook data: \`{{1.entry[].changes[].value.messages[].from}}\`\n4. **Type**: Text\n5. **Body**: Write the reply\n\n**Route 1 (Pricing) reply:**`,
      code: `Hi! 👋 Here are our prices:

🔹 Basic Plan — $10/month
🔹 Pro Plan — $25/month
🔹 Business Plan — $50/month

All plans come with a 7-day free trial.
Reply "subscribe" to get started!`,
      codeLang: 'text',
    },
    {
      title: 'Add remaining replies',
      duration: '5 min',
      content: `Add reply text for the other three routes:\n\n**Route 2 (Delivery) reply:**`,
      code: `📦 Delivery Information:

🚚 Accra / Lagos / Nairobi — 1-2 business days
🌍 Other African cities — 3-5 business days
✈️ International — 7-10 business days

Free delivery on orders over $50!
Reply "track" with your order number to check status.`,
      codeLang: 'text',
      tip: 'Customise these with YOUR actual business info before going live.',
    },
    {
      title: 'Set the fallback & business hours replies',
      duration: '3 min',
      content: `**Route 3 (Hours) reply:**`,
      code: `🕐 Business Hours:

Monday - Friday: 8:00 AM - 6:00 PM
Saturday: 9:00 AM - 2:00 PM
Sunday: Closed

📍 Location: 14 Independence Ave, Accra
📞 Call us: +233 XX XXX XXXX

Need urgent help? Reply "agent" and we'll connect you to a human.`,
      codeLang: 'text',
    },
    {
      title: 'Fallback reply + test',
      duration: '3 min',
      content: `**Route 4 (Fallback) reply:**`,
      code: `Thanks for messaging us! 🙏

I can help you with:
📋 Type "price" — see our plans
📦 Type "delivery" — shipping info
🕐 Type "hours" — business hours
💬 Type "agent" — talk to a human

What would you like to know?`,
      codeLang: 'text',
      checkpoint: 'All 4 routes have a WhatsApp Send Message module connected.',
    },
    {
      title: 'Test your bot live!',
      duration: '5 min',
      content: `Time to test!\n\n1. Make sure your Make scenario toggle is **ON** (bottom-left, should be blue)\n2. Open WhatsApp on your phone\n3. Send a message to your test number:\n   - Send **"What are your prices?"** → should get pricing reply\n   - Send **"How long is delivery?"** → should get delivery reply\n   - Send **"Hello"** → should get the fallback menu\n\n🎉 **Congratulations!** You just built a working WhatsApp bot with zero code.\n\n**What to do next:**\n- Replace test replies with your real business info\n- Add more keyword routes for common questions\n- Connect to a Google Sheet to log conversations\n- In the next lab, we\'ll add AI-powered responses using ChatGPT`,
      checkpoint: 'All 4 message types return the correct automated reply on WhatsApp.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/*  2. Auto Invoice Generator                                            */
/* ────────────────────────────────────────────────────────────────────── */
const invoiceGen: Lab = {
  id: 'invoice-gen',
  title: 'Auto Invoice Generator',
  desc: 'Automatically create and send professional invoices when a sale is made. Google Sheets + Zapier + Gmail.',
  longDesc: 'Every time you add a new row to your sales spreadsheet, this automation automatically generates a professional invoice PDF and emails it to your client. No manual work, no forgotten invoices, no late payments.',
  difficulty: 'Beginner',
  time: '30 min',
  tools: ['Google Sheets', 'Zapier', 'Gmail'],
  free: true,
  icon: '🧾',
  category: 'Finance',
  completions: 2180,
  prerequisites: ['Google account', 'Zapier free account'],
  outcomes: [
    'Auto-generated invoices from spreadsheet entries',
    'Professional email delivery to clients',
    'Understanding of trigger-based automations',
  ],
  steps: [
    {
      title: 'Create your Sales spreadsheet',
      duration: '5 min',
      content: `Open **Google Sheets** and create a new spreadsheet called "AfriFlow Sales Tracker".\n\nSet up these columns in Row 1:\n\n| A | B | C | D | E | F | G |\n|---|---|---|---|---|---|---|\n| Date | Client Name | Client Email | Item | Quantity | Unit Price | Total |\n\nIn column G, add a formula to auto-calculate:`,
      code: `=IF(E2*F2>0, E2*F2, "")`,
      codeLang: 'text',
      tip: 'Format column F and G as Currency. Format column A as Date. This keeps everything clean.',
      checkpoint: 'You have a Google Sheet with 7 columns and the formula in G2.',
    },
    {
      title: 'Add a sample sale',
      duration: '2 min',
      content: `Add a test row so Zapier can detect the structure:\n\n| Date | Client Name | Client Email | Item | Qty | Unit Price | Total |\n|---|---|---|---|---|---|---|\n| 2026-03-27 | Amara Osei | amara@example.com | AI Consulting (1hr) | 2 | 150 | 300 |`,
      checkpoint: 'Row 2 is filled with sample data and the Total formula shows 300.',
    },
    {
      title: 'Create a Zapier account & new Zap',
      duration: '3 min',
      content: `1. Go to **zapier.com** and sign up (free tier = 100 tasks/month)\n2. Click **Create Zap**\n3. For the **Trigger**, search **Google Sheets**\n4. Choose **New Spreadsheet Row**\n5. Connect your Google account\n6. Select your "AfriFlow Sales Tracker" spreadsheet\n7. Select "Sheet1" as the worksheet\n8. Click **Test trigger** — it should find your sample row`,
      toolLink: { label: 'Open Zapier', url: 'https://zapier.com/app/editor' },
      checkpoint: 'Zapier finds the test row with Client Name = "Amara Osei".',
    },
    {
      title: 'Build the invoice email template',
      duration: '8 min',
      content: `Add an **Action** step:\n\n1. Search for **Gmail** → choose **Send Email**\n2. Connect your Gmail account\n3. Fill in the fields:\n\n- **To**: Map → Client Email (from Step 1)\n- **Subject**: \`Invoice from [Your Business] — {{Item}}\`\n- **Body Type**: HTML\n- **Body**:`,
      code: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #FF7A00; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">INVOICE</h1>
    <p style="margin: 5px 0 0;">Your Business Name</p>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p>Dear <strong>{{Client Name}}</strong>,</p>
    <p>Thank you for your business. Here are the details of your invoice:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="background: #333; color: white;">
        <th style="padding: 10px; text-align: left;">Item</th>
        <th style="padding: 10px;">Qty</th>
        <th style="padding: 10px;">Unit Price</th>
        <th style="padding: 10px;">Total</th>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{Item}}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">{{Quantity}}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">\${{Unit Price}}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><strong>\${{Total}}</strong></td>
      </tr>
    </table>
    
    <p style="font-size: 18px; text-align: right;">
      <strong>Amount Due: \${{Total}}</strong>
    </p>
    
    <p>Payment methods: Mobile Money, Bank Transfer, or Card<br>
    Due within 14 days of receipt.</p>
    
    <p>Questions? Reply to this email.</p>
    <p>Thank you! 🙏</p>
  </div>
  
  <div style="text-align: center; padding: 15px; color: #999; font-size: 12px;">
    Powered by AfriFlow AI Automation Lab
  </div>
</div>`,
      codeLang: 'html',
      tip: 'Replace "Your Business Name" with your actual business. You can also add your logo as an <img> tag.',
    },
    {
      title: 'Test & publish your Zap',
      duration: '5 min',
      content: `1. Click **Test action** — Zapier will send a real email to your test address\n2. Check your inbox — you should see a professional invoice email\n3. If it looks good, click **Publish Zap**\n\n**Going live:**\nNow every time you add a new row to your Sales Tracker spreadsheet, an invoice is automatically emailed to the client. No more manual invoicing!\n\n**Next steps:**\n- Add a PDF generator (like DocuPilot) between Sheets and Gmail for PDF attachments\n- Add a second action to log the invoice in a separate "Invoices Sent" sheet\n- Connect to Paystack or Flutterwave for payment links in the invoice`,
      checkpoint: 'You received a professional invoice email at your test address. The Zap is published and running.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/*  3. Lead Capture & Email Follow-up                                    */
/* ────────────────────────────────────────────────────────────────────── */
const leadCapture: Lab = {
  id: 'lead-capture',
  title: 'Lead Capture & Email Follow-up',
  desc: 'Capture leads from your website, push to Airtable, and auto-send a 5-step personalised email sequence.',
  longDesc: 'Build a complete lead funnel: a Google Form captures contact details, Make pushes them to an Airtable CRM, and an automated email sequence nurtures them over 5 days. This is the same system agencies charge $2,000+ to build.',
  difficulty: 'Intermediate',
  time: '60 min',
  tools: ['Google Forms', 'Make (Integromat)', 'Airtable'],
  free: false,
  icon: '🎯',
  category: 'Marketing',
  completions: 1890,
  prerequisites: ['Make.com account', 'Airtable free account', 'Gmail account'],
  outcomes: [
    'Automated lead capture → CRM pipeline',
    'A 5-email nurture sequence running on autopilot',
    'Understanding of multi-step automation workflows',
  ],
  steps: [
    {
      title: 'Create the Airtable CRM base',
      duration: '5 min',
      content: `1. Sign up at **airtable.com** (free tier)\n2. Create a new base called "Leads CRM"\n3. Create a table called "Contacts" with these fields:\n\n| Field Name | Type |\n|---|---|\n| Name | Single line text |\n| Email | Email |\n| Phone | Phone number |\n| Interest | Single select: AI Consulting / Training / Automation / Other |\n| Source | Single line text |\n| Status | Single select: New / Contacted / Qualified / Won / Lost |\n| Emails Sent | Number |\n| Created | Created time (auto) |\n\nSet default Status to "New" and Emails Sent to 0.`,
      toolLink: { label: 'Open Airtable', url: 'https://airtable.com/' },
      checkpoint: 'Your Airtable base has a "Contacts" table with all 8 fields.',
    },
    {
      title: 'Build the Google Form',
      duration: '5 min',
      content: `Create a Google Form that acts as your lead capture:\n\n1. Go to **forms.google.com** → Blank form\n2. Title: "Get a Free AI Consultation"\n3. Add fields:\n   - **Full Name** (Short answer, required)\n   - **Email Address** (Short answer, required, email validation)\n   - **Phone Number** (Short answer, optional)\n   - **What are you interested in?** (Multiple choice: AI Consulting, Training, Automation, Other)\n4. Click **Send** → copy the form link\n\nThis form link goes on your website, social media, or WhatsApp status.`,
      checkpoint: 'Your Google Form is live and you have the public link.',
    },
    {
      title: 'Connect Form → Airtable via Make',
      duration: '10 min',
      content: `1. Open **Make.com** → Create a new scenario\n2. Add trigger: **Google Forms → Watch Responses**\n3. Connect your Google account and select your form\n4. Add action: **Airtable → Create a Record**\n5. Connect your Airtable account\n6. Select base "Leads CRM" → table "Contacts"\n7. Map the fields:\n   - Name → Google Form "Full Name" response\n   - Email → Google Form "Email Address" response\n   - Phone → Google Form "Phone Number" response\n   - Interest → Google Form "What are you interested in?" response\n   - Source → Type "Google Form" (static text)\n   - Status → "New"\n   - Emails Sent → 0`,
      checkpoint: 'Submitting a test form response creates a new row in Airtable.',
    },
    {
      title: 'Build Email 1 — Instant welcome',
      duration: '8 min',
      content: `After the Airtable module, add: **Gmail → Send an Email**\n\nThis is the instant welcome email sent within seconds of form submission:\n\n- **To**: Map the email from the form\n- **Subject**: \`Hey {{Name}}, your free AI consultation is confirmed! 🎉\`\n- **Body (HTML)**:`,
      code: `<div style="font-family: Arial; max-width: 600px; margin: auto;">
  <h2>Hey {{Name}}! 👋</h2>
  <p>Thanks for requesting a free AI consultation. Here's what happens next:</p>
  <ol>
    <li><strong>Within 24 hours</strong> — I'll review your business needs</li>
    <li><strong>Within 48 hours</strong> — You'll get a personalised AI roadmap</li>
    <li><strong>Within the week</strong> — We can jump on a free 30-min strategy call</li>
  </ol>
  <p>In the meantime, check out how other African businesses are using AI:</p>
  <p><a href="https://afriflowai.com/business" style="color: #FF7A00;">→ AI for African Business</a></p>
  <p>Talk soon!<br><strong>Your Name</strong><br>AfriFlow AI Consultant</p>
</div>`,
      codeLang: 'html',
    },
    {
      title: 'Add delayed follow-up emails (Day 2 & 3)',
      duration: '10 min',
      content: `After Email 1, add a **Tools → Sleep** module set to **86400** seconds (24 hours).\n\nThen add **Gmail → Send Email** for Day 2:\n\n**Subject**: \`{{Name}}, here's your AI Quick Win 🚀\`\n\nShare a specific, immediately useful tip based on their interest. For example:\n- AI Consulting → "Here's how one Lagos firm saved 20 hours/week with ChatGPT"\n- Training → "Free: Our top 3 AI courses for beginners"\n- Automation → "The #1 automation every business should set up first"\n\nAdd another **Sleep (86400)** → then Email 3:\n\n**Subject**: \`Case study: How {{Interest}} transformed a business like yours\`\n\nShare a relevant success story or case study.`,
      tip: 'Make\'s free plan has limited scheduled operations. For production, use the Sleep module sparingly or upgrade to Core ($9/mo).',
    },
    {
      title: 'Add Day 5 & Day 7 follow-ups',
      duration: '8 min',
      content: `Continue the pattern:\n\n**Sleep (172800)** → Email 4 (Day 5):\n- Subject: \`Quick question, {{Name}}\`\n- Body: A soft ask — "Have you had a chance to think about how AI could help your business? I have 2 consultation slots open this week."\n\n**Sleep (172800)** → Email 5 (Day 7):\n- Subject: \`Last call — your free AI strategy session\`\n- Body: Final nudge with urgency — "This is my last follow-up. If you want a free 30-min AI strategy session, reply to this email or book directly: [your Calendly link]"\n\nAfter the last email, add an **Airtable → Update Record** module:\n- Update the contact's Status to "Contacted"\n- Set Emails Sent to 5`,
      checkpoint: 'Your complete scenario shows: Form → Airtable → Email1 → Sleep → Email2 → Sleep → Email3 → Sleep → Email4 → Sleep → Email5 → Airtable Update.',
    },
    {
      title: 'Test & activate',
      duration: '5 min',
      content: `1. Turn on your scenario\n2. Submit a test form response using your own email\n3. Verify:\n   - ✅ Record appears in Airtable with Status = "New"\n   - ✅ Welcome email arrives within 30 seconds\n   - ✅ (Optional) Use "Run once" to test each step manually\n4. Click the scheduling toggle → set to "Immediately" (runs on every form submission)\n\n🎉 **You now have a complete lead funnel running 24/7!**\n\n**Revenue potential:** Agencies charge $1,500–$3,000 to build this exact system. You just built it in an hour.\n\n**Next steps:**\n- Embed the form on your website\n- Share the form link on your WhatsApp status and social media\n- Add a Calendly booking link in Email 4 and 5\n- Track open rates by upgrading to Mailchimp or Brevo`,
      checkpoint: 'Test form submission triggers the full sequence — Airtable record created, welcome email received.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/*  4. Social Media Auto-Poster                                          */
/* ────────────────────────────────────────────────────────────────────── */
const socialScheduler: Lab = {
  id: 'social-scheduler',
  title: 'Social Media Auto-Poster',
  desc: 'Write content once in a Google Sheet, schedule automatic posts across Facebook, Instagram, and X.',
  longDesc: 'Maintain a content calendar in Google Sheets and let automation handle the posting. Write once, publish everywhere — Facebook, Instagram, X, and LinkedIn. Never manually copy-paste a post again.',
  difficulty: 'Beginner',
  time: '40 min',
  tools: ['Buffer', 'Zapier', 'Google Sheets'],
  free: false,
  icon: '📱',
  category: 'Marketing',
  completions: 2670,
  prerequisites: ['Google account', 'Zapier free account', 'Buffer free account', 'At least 1 social media business page'],
  outcomes: [
    'A content calendar that auto-posts to multiple platforms',
    'Understanding of scheduling-based automations',
    'Time saved: 5-10 hours per week on social media management',
  ],
  steps: [
    {
      title: 'Create your Content Calendar',
      duration: '5 min',
      content: `Create a Google Sheet called "Content Calendar" with these columns:\n\n| A | B | C | D | E | F |\n|---|---|---|---|---|---|\n| Post Date | Post Time | Platform | Caption | Image URL | Status |\n\nFormat column A as Date and column F as a dropdown: Draft / Scheduled / Posted.\n\nAdd 3 sample rows for today and tomorrow.`,
      code: `Post Date    | Post Time | Platform    | Caption                                       | Image URL                    | Status
2026-03-27   | 09:00     | All         | 🚀 AI is changing how African businesses work    | https://example.com/ai1.jpg  | Draft
2026-03-27   | 14:00     | Instagram   | 5 AI tools every entrepreneur needs 🧠           | https://example.com/ai2.jpg  | Draft
2026-03-28   | 10:00     | X           | Thread: How I automated my entire invoicing 🧵   |                              | Draft`,
      codeLang: 'text',
    },
    {
      title: 'Connect Buffer to your social accounts',
      duration: '5 min',
      content: `1. Sign up at **buffer.com** (free = 3 channels)\n2. Connect your social accounts:\n   - Facebook Page\n   - Instagram Business\n   - X (Twitter)\n3. Set your posting schedule in Buffer → Publishing → Posting Schedule\n\nBuffer acts as the "distribution layer" — it knows how to post to each platform.`,
      toolLink: { label: 'Open Buffer', url: 'https://buffer.com/' },
    },
    {
      title: 'Create the Zapier automation',
      duration: '10 min',
      content: `1. In Zapier, create a new Zap\n2. **Trigger**: Google Sheets → New or Updated Spreadsheet Row\n3. Select your Content Calendar spreadsheet\n4. Add a **Filter** step:\n   - Only continue if "Status" column **is exactly** "Draft"\n5. **Action**: Buffer → Add to Queue\n6. Map the fields:\n   - **Profile**: Choose your connected social profile\n   - **Text**: Map the "Caption" column\n   - **Photo URL**: Map the "Image URL" column (optional)\n   - **Scheduled Date**: Map "Post Date" + "Post Time"\n7. Add a second action: **Google Sheets → Update Row**\n   - Update the Status column to "Scheduled"`,
      tip: 'For multi-platform posting, duplicate the Buffer action step for each platform and use the "Platform" column to filter which one to use.',
      checkpoint: 'Changing a row\'s status to "Draft" triggers Buffer to queue the post and status updates to "Scheduled".',
    },
    {
      title: 'Add AI caption generation (bonus)',
      duration: '10 min',
      content: `Let's make this smarter. Add a step BEFORE Buffer:\n\n1. Add **OpenAI → Send Prompt** (or use ChatGPT integration)\n2. Prompt:`,
      code: `You are a social media manager for an African tech business. 
Rewrite this caption for {{Platform}} (match the platform's style and character limits):

Original: {{Caption}}

Rules:
- Instagram: Add 5-10 relevant hashtags, use emojis
- X/Twitter: Keep under 280 characters, add 2-3 hashtags  
- Facebook: Conversational tone, add a call-to-action
- LinkedIn: Professional tone, add industry hashtags

Return ONLY the rewritten caption, nothing else.`,
      codeLang: 'text',
      tip: 'This turns a single basic caption into platform-optimised versions. One input → multiple tailored outputs.',
    },
    {
      title: 'Test & go live',
      duration: '5 min',
      content: `1. Add a new row with Status = "Draft"\n2. Watch the Zap run:\n   - ✅ AI rewrites the caption for the platform\n   - ✅ Buffer queues the post with the optimised text\n   - ✅ Sheet updates status to "Scheduled"\n   - ✅ Post goes live at the scheduled time\n\n🎉 **You now have an AI-powered social media autopilot!**\n\n**Time saved:** 5-10 hours/week on social media management\n**Revenue opportunity:** Social media management = $300-$800/month per client\n\n**Next steps:**\n- Add image generation with DALL·E for auto-generated visuals\n- Connect Google Analytics to track which posts drive traffic\n- Build a dashboard in Airtable to see your content performance`,
      checkpoint: 'A test post appears in your Buffer queue and the sheet status changes to "Scheduled".',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/*  5. Custom ChatGPT Business Bot                                       */
/* ────────────────────────────────────────────────────────────────────── */
const aiChatbot: Lab = {
  id: 'ai-chatbot',
  title: 'Custom ChatGPT Business Bot',
  desc: 'Build a GPT-4o powered chatbot trained on your business data — products, prices, FAQs — with no code.',
  longDesc: 'Build an AI chatbot that knows everything about YOUR business. It answers customer questions using your products, pricing, and policies as context — not generic ChatGPT answers. Uses n8n (free, open-source) + OpenAI API.',
  difficulty: 'Intermediate',
  time: '90 min',
  tools: ['OpenAI API', 'n8n', 'Supabase'],
  free: false,
  icon: '🤖',
  category: 'AI',
  completions: 1340,
  prerequisites: ['OpenAI API key ($5 credit is enough)', 'n8n cloud account (free) or self-hosted', 'Supabase free account'],
  outcomes: [
    'A custom AI chatbot trained on your business knowledge',
    'Vector embeddings stored in Supabase for retrieval',
    'A webhook endpoint you can connect to any frontend',
  ],
  steps: [
    {
      title: 'Prepare your business knowledge base',
      duration: '10 min',
      content: `Create a text file with everything your chatbot should know. Structure it like this:`,
      code: `# Company: AfriTech Solutions
# Location: Lagos, Nigeria

## Products
- AI Consulting: $200/hour. We help businesses identify and implement AI solutions.
- Automation Setup: $500 flat fee. We build custom automations using Make, n8n, or Zapier.
- AI Training: $1,500 for a 2-day workshop. Up to 20 participants.

## FAQ
Q: Do you work with startups?
A: Yes! We offer a 30% startup discount on all services.

Q: How long does an automation project take?
A: Most projects are delivered within 1-2 weeks. Complex projects may take 4 weeks.

Q: Do you offer payment plans?
A: Yes, we accept 50% upfront and 50% on delivery. Mobile Money and bank transfer accepted.

## Policies
- Refund: Full refund within 7 days if not satisfied.
- Support: Free email support for 30 days after project delivery.
- Working hours: Mon-Fri, 8AM-6PM WAT.`,
      codeLang: 'markdown',
      tip: 'The more detailed your knowledge base, the better the bot answers. Add real product names, prices, and common questions.',
    },
    {
      title: 'Set up Supabase vector store',
      duration: '10 min',
      content: `We\'ll use Supabase (free tier) to store embeddings — this lets the bot search your knowledge base.\n\n1. Go to **supabase.com** → create a new project\n2. Go to the **SQL Editor** and run:`,
      code: `-- Enable the pgvector extension
create extension if not exists vector;

-- Create the documents table
create table documents (
  id bigserial primary key,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Create a search function
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
) returns table (
  id bigint,
  content text,
  similarity float
) language sql stable as $$
  select id, content, 1 - (embedding <=> query_embedding) as similarity
  from documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;`,
      codeLang: 'sql',
      toolLink: { label: 'Open Supabase', url: 'https://supabase.com/dashboard' },
      checkpoint: 'SQL runs without errors. "documents" table visible in Table Editor.',
    },
    {
      title: 'Build the n8n ingestion workflow',
      duration: '15 min',
      content: `This workflow takes your knowledge base text, splits it into chunks, generates embeddings, and stores them in Supabase.\n\n1. Open **n8n** → New workflow\n2. Add a **Manual Trigger** (for testing)\n3. Add a **Set** node → paste your knowledge base text into a field called "content"\n4. Add a **Code** node to split into chunks:`,
      code: `// Split content into paragraphs/sections
const content = items[0].json.content;
const chunks = content.split('\\n\\n').filter(c => c.trim().length > 20);

return chunks.map(chunk => ({
  json: { content: chunk.trim() }
}));`,
      codeLang: 'javascript',
      toolLink: { label: 'Open n8n', url: 'https://app.n8n.cloud/' },
    },
    {
      title: 'Generate embeddings with OpenAI',
      duration: '10 min',
      content: `After the Code node:\n\n5. Add an **OpenAI** node → operation: **Create Embedding**\n6. Model: text-embedding-ada-002\n7. Input: Map the "content" field from the previous step\n8. This converts each text chunk into a 1536-dimension vector\n\nThen:\n\n9. Add a **Supabase** node → operation: **Insert Row**\n10. Table: documents\n11. Map:\n    - content → the text chunk\n    - embedding → the embedding array from OpenAI\n12. Run the workflow → your knowledge base is now indexed!`,
      checkpoint: 'Supabase "documents" table has rows with content and embedding data.',
    },
    {
      title: 'Build the chatbot workflow',
      duration: '20 min',
      content: `Create a NEW n8n workflow for the chat endpoint:\n\n1. **Webhook** trigger (POST) — this receives the user\'s question\n2. **OpenAI** node → Create Embedding of the user\'s question\n3. **Supabase** node → call the match_documents RPC function:\n   - Function: match_documents\n   - Parameters: query_embedding = {{embedding}}, match_count = 3\n4. **Code** node → build the prompt:`,
      code: `const question = items[0].json.body.message;
const contexts = items[0].json.matches || [];
const contextText = contexts.map(c => c.content).join('\\n---\\n');

return [{
  json: {
    messages: [
      {
        role: "system",
        content: \`You are a helpful customer support assistant for an African business. 
Answer questions using ONLY the following business information. 
If the answer isn't in the context, say "I don't have that information, but you can reach us at support@afritech.com".
Be friendly, concise, and professional.

Business Context:
\${contextText}\`
      },
      {
        role: "user",
        content: question
      }
    ]
  }
}];`,
      codeLang: 'javascript',
    },
    {
      title: 'Add GPT-4o response & test',
      duration: '15 min',
      content: `5. Add **OpenAI** node → Chat Completion\n   - Model: gpt-4o\n   - Messages: Map the messages array from the Code node\n\n6. Add a **Respond to Webhook** node → return the AI response as JSON:\n   - Body: \`{ "reply": "{{response}}" }\`\n\n7. Activate the workflow\n\n**Test it:**`,
      code: `curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook/xxxxx \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What are your prices?"}'`,
      codeLang: 'bash',
      checkpoint: 'The curl command returns a JSON response with an accurate answer based on your business data.',
    },
    {
      title: 'Connect to a frontend',
      duration: '10 min',
      content: `Your chatbot is now a REST API! You can connect it to:\n\n- **Your website** — embed a chat widget that calls your webhook\n- **WhatsApp** — connect via the WhatsApp Bot lab\n- **Telegram** — use n8n's Telegram node\n\nHere\'s a simple JavaScript snippet for a website chat:`,
      code: `async function sendMessage(userMessage) {
  const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  });
  const data = await response.json();
  return data.reply;
}

// Usage
const answer = await sendMessage("What services do you offer?");
console.log(answer);
// "We offer AI Consulting ($200/hr), Automation Setup ($500), 
//  and AI Training workshops ($1,500 for up to 20 participants)."`,
      codeLang: 'javascript',
      tip: 'This is the foundation of a RAG (Retrieval-Augmented Generation) system — the same architecture used by enterprise AI products.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/*  6. AI CV Screening Pipeline                                          */
/* ────────────────────────────────────────────────────────────────────── */
const cvScreener: Lab = {
  id: 'cv-screener',
  title: 'AI CV Screening Pipeline',
  desc: 'Automatically screen job applications, score CVs against your criteria, and shortlist candidates — zero manual work.',
  longDesc: 'Build an AI pipeline that reads incoming CVs, scores them against your job requirements, and automatically sorts candidates into "shortlist", "maybe", and "reject" — saving HR teams 10+ hours per role.',
  difficulty: 'Intermediate',
  time: '75 min',
  tools: ['Claude API', 'Make (Integromat)', 'Airtable'],
  free: false,
  icon: '📋',
  category: 'HR',
  completions: 980,
  prerequisites: ['Make.com account (Core plan recommended)', 'Airtable account', 'Anthropic API key'],
  outcomes: [
    'An automated CV screening pipeline',
    'AI-powered candidate scoring and ranking',
    'Understanding of document processing automation',
  ],
  steps: [
    {
      title: 'Set up Airtable for candidate tracking',
      duration: '5 min',
      content: `Create a base called "Hiring Pipeline" with a table "Candidates":\n\n| Field | Type |\n|---|---|\n| Name | Text |\n| Email | Email |\n| Role Applied | Single Select |\n| CV Text | Long text |\n| AI Score | Number (0-100) |\n| AI Summary | Long text |\n| AI Verdict | Single Select: Shortlist / Maybe / Reject |\n| Status | Single Select: New / Reviewed / Interview / Offer |\n| Applied Date | Created time |`,
    },
    {
      title: 'Create a Google Form for applications',
      duration: '5 min',
      content: `Build a simple application form:\n\n1. "Full Name" (required)\n2. "Email Address" (required)\n3. "Role" — dropdown: Software Engineer / Data Analyst / Marketing Manager\n4. "Paste your CV/Resume below" — Paragraph text (required)\n5. "LinkedIn URL" — optional\n\nShare this form link in your job posting.`,
      tip: 'For production, accept PDF uploads and use a document parser. For this lab, pasted text keeps it simple.',
    },
    {
      title: 'Build the screening automation',
      duration: '15 min',
      content: `In Make.com:\n\n1. **Trigger**: Google Forms → Watch Responses\n2. **Action**: Airtable → Create Record (save raw application)\n3. **Action**: HTTP → Make a Request to Claude API:`,
      code: `{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "You are an expert HR recruiter. Score this CV for the role of {{Role Applied}} on a scale of 0-100.\\n\\nScoring criteria:\\n- Relevant experience (40 points)\\n- Technical skills match (30 points)\\n- Education & certifications (15 points)\\n- Communication quality (15 points)\\n\\nCV:\\n{{CV Text}}\\n\\nRespond in EXACTLY this JSON format:\\n{\\n  \\"score\\": 75,\\n  \\"verdict\\": \\"Shortlist\\",\\n  \\"summary\\": \\"3-sentence summary\\",\\n  \\"strengths\\": [\\"strength 1\\", \\"strength 2\\"],\\n  \\"concerns\\": [\\"concern 1\\"]\\n}"
    }
  ]
}`,
      codeLang: 'json',
    },
    {
      title: 'Parse AI response & update Airtable',
      duration: '10 min',
      content: `After the Claude API call:\n\n4. **JSON** module → Parse the AI response body\n5. **Airtable** → Update Record:\n   - AI Score → parsed score\n   - AI Summary → parsed summary\n   - AI Verdict → parsed verdict (Shortlist/Maybe/Reject)\n\nAdd verdict logic:\n- Score ≥ 70 → "Shortlist"\n- Score 50-69 → "Maybe"\n- Score < 50 → "Reject"`,
    },
    {
      title: 'Add automated email responses',
      duration: '10 min',
      content: `Based on the verdict, send different emails:\n\n**Router** with 3 routes:\n\n**Shortlist (score ≥ 70):**\n- Subject: "Great news! Next steps for your {{Role}} application"\n- Body: Invite to schedule an interview (include Calendly link)\n\n**Maybe (50-69):**\n- Subject: "Your application is being reviewed"\n- Body: Acknowledge receipt, mention timeline\n\n**Reject (<50):**\n- Subject: "Update on your {{Role}} application"\n- Body: Polite rejection with encouragement`,
      tip: 'Always send rejection emails promptly and kindly. It\'s good for your employer brand.',
    },
    {
      title: 'Test & review accuracy',
      duration: '15 min',
      content: `1. Submit 3-5 test applications with varying quality CVs\n2. Check Airtable — each should have:\n   - ✅ AI Score (0-100)\n   - ✅ AI Summary (3 sentences)\n   - ✅ Correct Verdict\n   - ✅ Appropriate email sent\n3. Review the AI scores — are they reasonable?\n\n🎉 **You just built an AI recruiter!**\n\n**Time saved:** 10-15 hours per open role\n**Accuracy:** AI screening catches 92% of the same candidates human reviewers do\n\n**Next steps:**\n- Add PDF parsing for uploaded CVs (use DocParser or Affinda API)\n- Build a dashboard view in Airtable for the hiring manager\n- Add bias detection prompts to ensure fair screening`,
      checkpoint: 'All test applications show AI Score, Summary, Verdict, and triggered the correct email.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/*  7. Low-Stock Inventory Alert Bot                                     */
/* ────────────────────────────────────────────────────────────────────── */
const inventoryAlert: Lab = {
  id: 'inventory-alert',
  title: 'Low-Stock Inventory Alert Bot',
  desc: 'Connect your Google Sheet inventory to WhatsApp — get instant alerts when stock drops below threshold.',
  longDesc: 'Never run out of stock again. This automation monitors your Google Sheet inventory every hour and sends you a WhatsApp alert when any product drops below your set threshold.',
  difficulty: 'Beginner',
  time: '35 min',
  tools: ['Google Sheets', 'Make (Integromat)', 'WhatsApp'],
  free: true,
  icon: '📦',
  category: 'Operations',
  completions: 1560,
  prerequisites: ['Google account', 'Make.com free account', 'WhatsApp Business API or Twilio'],
  outcomes: [
    'Automated inventory monitoring',
    'Instant WhatsApp alerts for low stock',
    'A reusable template for any threshold-based alert system',
  ],
  steps: [
    {
      title: 'Create your Inventory sheet',
      duration: '5 min',
      content: `Create a Google Sheet called "Inventory Tracker" with:\n\n| A | B | C | D | E |\n|---|---|---|---|---|\n| Product | SKU | Current Stock | Minimum Threshold | Supplier |\n\nAdd sample products:`,
      code: `Product          | SKU     | Stock | Min | Supplier
Rice (50kg)      | RICE-50 | 15    | 20  | Accra Wholesale Ltd
Cooking Oil (5L) | OIL-5L  | 8     | 10  | FoodCo Ghana
Sugar (25kg)     | SUG-25  | 45    | 15  | Sweet Imports
Flour (25kg)     | FLR-25  | 3     | 10  | Kumasi Mills`,
      codeLang: 'text',
      checkpoint: 'Sheet has 4 products. Rice, Oil, and Flour are below their minimum threshold.',
    },
    {
      title: 'Build the Make scenario',
      duration: '10 min',
      content: `1. Create a new scenario in Make\n2. **Trigger**: Schedule → set to run every 1 hour\n3. **Action**: Google Sheets → Search Rows\n   - Search for rows where **Current Stock < Minimum Threshold**\n   - Use the formula filter: Column C < Column D\n4. This returns only the products that need restocking.`,
    },
    {
      title: 'Format the alert message',
      duration: '5 min',
      content: `Add a **Text Aggregator** module to combine all low-stock items into one message:\n\nTemplate:`,
      code: `⚠️ LOW STOCK ALERT ⚠️

The following products need restocking:

{{#each items}}
📦 {{Product}} ({{SKU}})
   Current: {{Current Stock}} | Minimum: {{Minimum Threshold}}
   Supplier: {{Supplier}}

{{/each}}

🔗 Open inventory: [Sheet URL]
⏰ Alert time: {{now}}`,
      codeLang: 'text',
    },
    {
      title: 'Send WhatsApp alert',
      duration: '5 min',
      content: `Add a **WhatsApp Business Cloud → Send Message** module:\n\n- **To**: Your phone number (or a group number)\n- **Body**: The formatted alert text from the aggregator\n\nAdd a **Filter** before the WhatsApp module:\n- Only proceed if the search returned at least 1 row\n- This prevents empty alerts when everything is in stock.`,
    },
    {
      title: 'Test & activate',
      duration: '5 min',
      content: `1. Run the scenario manually\n2. You should get a WhatsApp message listing Rice, Oil, and Flour (all below threshold)\n3. Update Flour stock to 25 (above minimum)\n4. Run again — Flour should NOT appear in the alert\n5. Set the schedule to **every 1 hour** and activate\n\n🎉 **Your inventory watchdog is live!**\n\n**Extend this:**\n- Add auto-email to suppliers when stock is critical (< 50% of minimum)\n- Connect to a Telegram channel for your whole team\n- Add a column for "Reorder Amount" and auto-generate purchase orders`,
      checkpoint: 'WhatsApp alert received with only below-threshold products listed.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/*  8. AI Content Writing Machine                                        */
/* ────────────────────────────────────────────────────────────────────── */
const contentWriter: Lab = {
  id: 'content-writer',
  title: 'AI Content Writing Machine',
  desc: 'Feed a topic, target audience, and tone — get SEO blog posts, social captions, and ads generated automatically.',
  longDesc: 'Build a content generation pipeline: enter a topic in a Google Sheet, and AI automatically writes a blog post, 5 social media captions, and 2 ad variations — all optimised for your audience and brand voice.',
  difficulty: 'Beginner',
  time: '25 min',
  tools: ['ChatGPT API', 'Notion', 'Make (Integromat)'],
  free: false,
  icon: '✍️',
  category: 'AI',
  completions: 3100,
  prerequisites: ['OpenAI API key', 'Make.com account', 'Notion account (free)'],
  outcomes: [
    'An AI-powered content pipeline that writes for you',
    'SEO-optimised blog posts generated in seconds',
    'Social media captions tailored to each platform',
  ],
  steps: [
    {
      title: 'Set up the Content Briefs sheet',
      duration: '3 min',
      content: `Create a Google Sheet "Content Briefs" with columns:\n\n| Topic | Target Audience | Tone | Word Count | Keywords | Status |\n|---|---|---|---|---|---|\n| 5 AI tools for African retailers | Small business owners in Ghana | Conversational, practical | 800 | AI, retail, Africa, automation | Draft |`,
    },
    {
      title: 'Build the blog writer prompt',
      duration: '5 min',
      content: `In Make, set up:\n1. **Trigger**: Google Sheets → New Row (or Status = "Draft")\n2. **Action**: OpenAI → Chat Completion\n\nSystem prompt:`,
      code: `You are an expert content writer specialising in African business and technology. 
Write content that is:
- Practical and actionable (not theoretical)
- Relevant to African markets and contexts
- SEO-optimised with natural keyword usage
- Written in {{Tone}} tone
- Targeted at {{Target Audience}}

Format the blog post with:
1. An attention-grabbing headline (H1)
2. A hook paragraph (2-3 sentences)
3. {{Word Count}} words of body content with H2 subheadings
4. Bullet points and numbered lists where appropriate
5. A strong call-to-action conclusion
6. Meta description (155 characters)

Naturally include these keywords: {{Keywords}}

Topic: {{Topic}}`,
      codeLang: 'text',
    },
    {
      title: 'Add social media caption generator',
      duration: '5 min',
      content: `After the blog writer, add another **OpenAI** call:\n\nPrompt:`,
      code: `Based on this blog post, generate social media captions:

Blog: {{blog_content}}

Generate exactly:
1. 🐦 X/Twitter post (max 280 chars, include 2 hashtags)
2. 📸 Instagram caption (engaging, 3-5 hashtags at the end)  
3. 💼 LinkedIn post (professional, thought-leadership style, 150 words)
4. 📘 Facebook post (conversational, include a question for engagement)
5. 💬 WhatsApp status (short, emoji-rich, 1-2 lines)

Format each clearly with the platform emoji as a header.`,
      codeLang: 'text',
    },
    {
      title: 'Save to Notion',
      duration: '7 min',
      content: `Add a **Notion → Create a Page** module:\n\n1. Select your workspace → a "Content" database\n2. Map:\n   - Title → the blog headline (extracted from AI output)\n   - Body → full blog post content\n   - Tags → Keywords from the sheet\n   - Social Captions → the 5 captions as a text block\n   - Status → "Ready for Review"\n3. Add a final step: **Google Sheets → Update Row** → Status = "Generated"\n\nTest the flow end-to-end.`,
      checkpoint: 'A new Notion page appears with the full blog post + 5 social captions. Sheet status = "Generated".',
    },
    {
      title: 'Scale it up',
      duration: '5 min',
      content: `Your content machine is live! Here's how to 10x it:\n\n1. **Batch mode**: Add 10 topics to the sheet → all get processed automatically\n2. **Content calendar**: Connect to the Social Media Auto-Poster lab to auto-schedule posts\n3. **Brand voice**: Add a "Brand Voice" field with example text and feed it to the prompt\n4. **Ad copy**: Add a step that generates Facebook Ad copy and Google Ad headlines\n\n🎉 **Output per topic**: 1 blog post + 5 social captions + meta description — in under 60 seconds.\n\n**Revenue opportunity**: Content writing services sell for $100-$500 per blog post. You just automated it.`,
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/*  9. Payment Received Notifier                                         */
/* ────────────────────────────────────────────────────────────────────── */
const paymentNotifier: Lab = {
  id: 'payment-notifier',
  title: 'Payment Received Notifier',
  desc: 'When a client pays via Paystack, auto-send a WhatsApp receipt and update your Google Sheets ledger.',
  longDesc: 'Connect Paystack to WhatsApp and Google Sheets. Every time a payment comes in, your client gets an instant WhatsApp receipt and your books are automatically updated. No more manual bookkeeping.',
  difficulty: 'Intermediate',
  time: '50 min',
  tools: ['Paystack', 'Make (Integromat)', 'WhatsApp'],
  free: false,
  icon: '💳',
  category: 'Finance',
  completions: 870,
  prerequisites: ['Paystack business account', 'Make.com account', 'WhatsApp Business API setup (from Lab 1)'],
  outcomes: [
    'Instant WhatsApp receipts for every payment',
    'Auto-updated financial ledger in Google Sheets',
    'Understanding of payment webhook automations',
  ],
  steps: [
    {
      title: 'Set up the Paystack webhook',
      duration: '8 min',
      content: `1. Log into your **Paystack Dashboard**\n2. Go to **Settings → API Keys & Webhooks**\n3. In Make, create a new scenario with a **Webhooks → Custom Webhook** trigger\n4. Copy the webhook URL\n5. Paste it in Paystack's Webhook URL field\n6. Paystack sends events like \`charge.success\` whenever a payment succeeds\n\nThe webhook payload includes: amount, currency, customer email, reference, and payment channel.`,
      toolLink: { label: 'Paystack Dashboard', url: 'https://dashboard.paystack.com/' },
    },
    {
      title: 'Create the financial ledger',
      duration: '5 min',
      content: `Create a Google Sheet "Payment Ledger" with:\n\n| Date | Reference | Customer | Email | Amount | Currency | Channel | Status |\n|---|---|---|---|---|---|---|---|`,
    },
    {
      title: 'Build the automation flow',
      duration: '15 min',
      content: `In your Make scenario after the webhook:\n\n1. **Filter**: Only continue if event = "charge.success"\n2. **Google Sheets → Add Row** to Payment Ledger:\n   - Date → {{timestamp}}\n   - Reference → {{data.reference}}\n   - Customer → {{data.customer.first_name}} {{data.customer.last_name}}\n   - Amount → {{data.amount / 100}} (Paystack sends in kobo/pesewas)\n   - Currency → {{data.currency}}\n   - Channel → {{data.channel}} (card, bank, mobile_money)\n\n3. **WhatsApp → Send Message**:\n   - To: Customer phone (from {{data.customer.phone}} or look up by email)`,
      warning: 'Paystack amounts are in the smallest currency unit (kobo for NGN, pesewas for GHS). Divide by 100 for the display amount.',
    },
    {
      title: 'Design the receipt message',
      duration: '7 min',
      content: `WhatsApp receipt template:`,
      code: `Payment Received!

Hi {{customer_name}},

We've received your payment of {{currency}} {{amount}}.

Receipt Details:
-------------------
Reference: {{reference}}
Amount: {{currency}} {{amount}}
Date: {{date}}
Method: {{channel}}
-------------------

Thank you for your business!

Questions? Reply to this message.
-- Your Business Name`,
      codeLang: 'text',
    },
    {
      title: 'Add daily summary email',
      duration: '10 min',
      content: `Bonus: Add a second scenario that runs at 8 PM daily:\n\n1. **Schedule** trigger → every day at 20:00\n2. **Google Sheets → Search Rows** → filter by today's date\n3. **Aggregator** → sum all amounts\n4. **Gmail → Send Email** to yourself:\n\nSubject: "💰 Daily Sales Summary — {{today's date}}"\n\nBody includes: total revenue, number of transactions, breakdown by channel.\n\n🎉 **Your payment system is now fully automated!**\n\n**Next steps:**\n- Add failed payment alerts (filter for charge.failed events)\n- Connect to QuickBooks or Wave for professional accounting\n- Add a monthly summary report with charts`,
      checkpoint: 'A test Paystack payment triggers: Google Sheet row + WhatsApp receipt.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/* 10. Python + OpenAI API Quickstart                                    */
/* ────────────────────────────────────────────────────────────────────── */
const pythonOpenai: Lab = {
  id: 'python-openai',
  title: 'Python + OpenAI API Quickstart',
  desc: 'Write your first Python script that calls GPT-4o, processes responses, and logs results to a database.',
  longDesc: 'Move beyond no-code and learn to call AI APIs directly with Python. You\'ll build a script that sends prompts to GPT-4o, handles responses, implements retry logic, and logs everything to SQLite. This is the foundation for building custom AI tools.',
  difficulty: 'Advanced',
  time: '120 min',
  tools: ['Python', 'OpenAI API', 'SQLite'],
  free: false,
  icon: '🐍',
  category: 'Development',
  completions: 760,
  prerequisites: ['Python 3.9+ installed', 'OpenAI API key', 'Basic Python knowledge (variables, functions, loops)'],
  outcomes: [
    'Direct API calls to GPT-4o from Python',
    'Structured output parsing (JSON mode)',
    'Error handling and retry logic',
    'SQLite logging for every API call',
  ],
  steps: [
    {
      title: 'Set up your project',
      duration: '5 min',
      content: `Create a new folder and set up your environment:`,
      code: `mkdir afriflow-ai-lab && cd afriflow-ai-lab
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install openai python-dotenv`,
      codeLang: 'bash',
    },
    {
      title: 'Create your .env and main script',
      duration: '5 min',
      content: `Create a \`.env\` file:`,
      code: `OPENAI_API_KEY=sk-your-key-here`,
      codeLang: 'text',
    },
    {
      title: 'Write the basic API call',
      duration: '15 min',
      content: `Create \`main.py\`:`,
      code: `import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_gpt(prompt: str, system_msg: str = "You are a helpful assistant.") -> str:
    """Send a prompt to GPT-4o and return the response."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=1000,
    )
    return response.choices[0].message.content

# Test it!
if __name__ == "__main__":
    answer = ask_gpt(
        "What are the top 3 ways African small businesses can use AI today? Be specific and practical.",
        system_msg="You are an AI consultant specialising in African markets."
    )
    print(answer)`,
      codeLang: 'python',
      checkpoint: 'Running `python main.py` prints 3 practical AI recommendations.',
    },
    {
      title: 'Add structured JSON output',
      duration: '15 min',
      content: `Upgrade to get structured data back (not just text):`,
      code: `import json

def ask_gpt_json(prompt: str, system_msg: str = "You are a helpful assistant.") -> dict:
    """Get structured JSON responses from GPT-4o."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_msg + "\\nAlways respond in valid JSON format."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    return json.loads(response.choices[0].message.content)

# Example: Analyse a business idea
result = ask_gpt_json("""
Analyse this business idea and score it:
"A mobile app that uses AI to help Nigerian market women track their daily sales and predict what to stock."

Return JSON with:
- score (0-100)
- strengths (array of strings)
- risks (array of strings)  
- suggested_name (string)
- estimated_market_size (string)
""")

print(json.dumps(result, indent=2))`,
      codeLang: 'python',
      tip: 'JSON mode guarantees valid JSON output. No more parsing errors from markdown code blocks in responses.',
    },
    {
      title: 'Add SQLite logging',
      duration: '20 min',
      content: `Log every API call for cost tracking and debugging:`,
      code: `import sqlite3
import time
from datetime import datetime

def init_db():
    """Create the API log database."""
    conn = sqlite3.connect("api_logs.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS api_calls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            model TEXT NOT NULL,
            prompt_preview TEXT,
            response_preview TEXT,
            tokens_in INTEGER,
            tokens_out INTEGER,
            cost_usd REAL,
            duration_ms INTEGER,
            success BOOLEAN
        )
    """)
    conn.commit()
    return conn

# Cost per 1K tokens (GPT-4o pricing as of 2026)
COST_PER_1K = {"input": 0.0025, "output": 0.01}

def ask_gpt_logged(prompt: str, system_msg: str = "You are a helpful assistant.") -> str:
    """Send prompt, log the call, return response."""
    conn = init_db()
    start = time.time()
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        
        duration = int((time.time() - start) * 1000)
        usage = response.usage
        cost = (usage.prompt_tokens / 1000 * COST_PER_1K["input"] +
                usage.completion_tokens / 1000 * COST_PER_1K["output"])
        text = response.choices[0].message.content
        
        conn.execute(
            "INSERT INTO api_calls VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (datetime.now().isoformat(), "gpt-4o", prompt[:100], text[:100],
             usage.prompt_tokens, usage.completion_tokens, round(cost, 6),
             duration, True)
        )
        conn.commit()
        
        print(f"  ✅ {usage.prompt_tokens}+{usage.completion_tokens} tokens | \$\{cost:.4f} | {duration}ms")
        return text
        
    except Exception as e:
        conn.execute(
            "INSERT INTO api_calls VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (datetime.now().isoformat(), "gpt-4o", prompt[:100], str(e)[:100],
             0, 0, 0, int((time.time()-start)*1000), False)
        )
        conn.commit()
        raise`,
      codeLang: 'python',
    },
    {
      title: 'Add retry logic & batch processing',
      duration: '15 min',
      content: `Handle rate limits and errors gracefully:`,
      code: `import time

def ask_with_retry(prompt: str, max_retries: int = 3, **kwargs) -> str:
    """Retry with exponential backoff on failure."""
    for attempt in range(max_retries):
        try:
            return ask_gpt_logged(prompt, **kwargs)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt  # 1s, 2s, 4s
            print(f"  ⚠️  Retry {attempt+1}/{max_retries} in {wait}s: {e}")
            time.sleep(wait)

def batch_process(prompts: list[str], **kwargs) -> list[str]:
    """Process multiple prompts with progress tracking."""
    results = []
    for i, prompt in enumerate(prompts, 1):
        print(f"\\n[{i}/{len(prompts)}] Processing...")
        result = ask_with_retry(prompt, **kwargs)
        results.append(result)
    return results

# Example: Analyse 5 African cities for AI adoption potential
cities = ["Lagos", "Nairobi", "Accra", "Cape Town", "Kigali"]
prompts = [
    f"In 3 bullet points, what makes {city} a promising market for AI services?"
    for city in cities
]
results = batch_process(prompts, system_msg="You are an African market analyst.")

for city, result in zip(cities, results):
    print(f"\\n🏙️ {city}:\\n{result}")`,
      codeLang: 'python',
      checkpoint: 'Batch processing runs through all 5 cities. `api_logs.db` has 5 entries with cost data.',
    },
    {
      title: 'View your API usage report',
      duration: '5 min',
      content: `Query your log database:`,
      code: 'def usage_report():\n    """Print API usage summary."""\n    conn = sqlite3.connect("api_logs.db")\n    \n    stats = conn.execute("""\n        SELECT \n            COUNT(*) as calls,\n            SUM(tokens_in) as total_in,\n            SUM(tokens_out) as total_out,\n            SUM(cost_usd) as total_cost,\n            AVG(duration_ms) as avg_duration,\n            SUM(CASE WHEN success THEN 1 ELSE 0 END) as successes\n        FROM api_calls\n    """).fetchone()\n    \n    print(f"""\n API Usage Report\n-------------------\nTotal calls:    {stats[0]}\nSuccess rate:   {stats[5]}/{stats[0]} ({stats[5]/max(stats[0],1)*100:.0f}%)\nTokens (in):    {stats[1]:,}\nTokens (out):   {stats[2]:,}\nTotal cost:     ${stats[3]:.4f}\nAvg latency:    {stats[4]:.0f}ms\n-------------------\n    """)\n\nusage_report()',
      codeLang: 'python',
      tip: 'This logging pattern is essential for production AI apps. You always need to know your costs and success rates.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/* 11. AI Data Summarizer & Report Writer                                */
/* ────────────────────────────────────────────────────────────────────── */
const dataSummarizer: Lab = {
  id: 'data-summarizer',
  title: 'AI Data Summarizer & Report Writer',
  desc: 'Upload a CSV of sales data — get an AI-written executive summary with key insights and recommendations.',
  longDesc: 'Build a Python tool that reads any CSV, analyses the data with Pandas, then sends the key metrics to Claude for an executive summary. The output is a professional report your boss can read in 2 minutes.',
  difficulty: 'Intermediate',
  time: '45 min',
  tools: ['Claude API', 'Python', 'Pandas'],
  free: false,
  icon: '📊',
  category: 'Data',
  completions: 1120,
  prerequisites: ['Python 3.9+', 'Anthropic API key', 'Basic Python knowledge'],
  outcomes: [
    'Automated data analysis with Pandas',
    'AI-generated executive summaries',
    'A reusable tool for any CSV dataset',
  ],
  steps: [
    {
      title: 'Set up & create sample data',
      duration: '5 min',
      content: `Install dependencies and create a sample sales CSV:`,
      code: 'pip install anthropic pandas\n\n# Create sample_sales.csv\ncat > sample_sales.csv << \'EOF\'\ndate,product,region,units,revenue,cost\n2026-01-05,AI Consulting,Lagos,3,4500,1200\n2026-01-12,Automation Setup,Accra,5,2500,800\n2026-01-18,Training Workshop,Nairobi,2,3000,600\n2026-02-01,AI Consulting,Lagos,4,6000,1600\n2026-02-08,AI Consulting,Accra,2,3000,800\n2026-02-15,Automation Setup,Nairobi,3,1500,480\n2026-02-22,Training Workshop,Lagos,1,1500,300\n2026-03-01,AI Consulting,Nairobi,5,7500,2000\n2026-03-10,Automation Setup,Lagos,6,3000,960\n2026-03-15,Training Workshop,Accra,3,4500,900\n2026-03-20,AI Consulting,Accra,3,4500,1200\n2026-03-25,Automation Setup,Nairobi,4,2000,640\nEOF',
      codeLang: 'bash',
    },
    {
      title: 'Build the data analyser',
      duration: '15 min',
      content: `Create \`analyser.py\`:`,
      code: 'import pandas as pd\n\ndef analyse_csv(filepath: str) -> dict:\n    """Analyse a CSV and extract key business metrics."""\n    df = pd.read_csv(filepath)\n    df[\'date\'] = pd.to_datetime(df[\'date\'])\n    df[\'profit\'] = df[\'revenue\'] - df[\'cost\']\n    df[\'margin\'] = (df[\'profit\'] / df[\'revenue\'] * 100).round(1)\n    \n    # Key metrics\n    metrics = {\n        "total_revenue": f"${df[\'revenue\'].sum():,.0f}",\n        "total_profit": f"${df[\'profit\'].sum():,.0f}",\n        "avg_margin": f"{df[\'margin\'].mean():.1f}%",\n        "total_transactions": len(df),\n        "top_product": df.groupby(\'product\')[\'revenue\'].sum().idxmax(),\n        "top_region": df.groupby(\'region\')[\'revenue\'].sum().idxmax(),\n        "best_margin_product": df.groupby(\'product\')[\'margin\'].mean().idxmax(),\n        "monthly_trend": df.groupby(df[\'date\'].dt.to_period(\'M\'))[\'revenue\'].sum().to_dict(),\n        "product_breakdown": df.groupby(\'product\').agg({\n            \'revenue\': \'sum\', \'units\': \'sum\', \'profit\': \'sum\'\n        }).to_dict(\'index\'),\n        "region_breakdown": df.groupby(\'region\').agg({\n            \'revenue\': \'sum\', \'units\': \'sum\'\n        }).to_dict(\'index\'),\n    }\n    \n    # Convert Period keys to strings for JSON\n    metrics["monthly_trend"] = {\n        str(k): v for k, v in metrics["monthly_trend"].items()\n    }\n    \n    return metrics\n\nif __name__ == "__main__":\n    import json\n    result = analyse_csv("sample_sales.csv")\n    print(json.dumps(result, indent=2))',
      codeLang: 'python',
      checkpoint: 'Running `python analyser.py` shows structured metrics with revenue, profit, and breakdowns.',
    },
    {
      title: 'Connect to Claude for AI summary',
      duration: '15 min',
      content: `Create \`report_writer.py\`:`,
      code: 'import os\nimport json\nimport anthropic\nfrom dotenv import load_dotenv\nfrom analyser import analyse_csv\n\nload_dotenv()\nclient = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))\n\ndef generate_report(filepath: str) -> str:\n    """Analyse data and generate an executive summary."""\n    metrics = analyse_csv(filepath)\n    \n    prompt = f"""You are a senior business analyst. Write a professional executive summary \nbased on these sales metrics. Make it actionable and specific.\n\nData: {json.dumps(metrics, indent=2)}\n\nWrite the report in this structure:\n1. **Executive Summary** (3-4 sentences, headline findings)\n2. **Key Metrics** (bullet points with the numbers)\n3. **Top Insights** (3 data-driven insights with explanations)\n4. **Recommendations** (3 specific, actionable next steps)\n5. **Risk Flags** (any concerning trends)\n\nKeep it under 400 words. Use a professional but readable tone.\nUse currency formatting and percentages."""\n\n    response = client.messages.create(\n        model="claude-3-5-sonnet-20241022",\n        max_tokens=1000,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    \n    return response.content[0].text\n\nif __name__ == "__main__":\n    report = generate_report("sample_sales.csv")\n    print(report)\n    \n    # Save to file\n    with open("report.md", "w") as f:\n        f.write(report)\n    print("\\n Saved to report.md")',
      codeLang: 'python',
      checkpoint: 'Running the script generates a professional executive summary and saves it as report.md.',
    },
    {
      title: 'Make it reusable',
      duration: '10 min',
      content: `Upgrade to a CLI tool that works with any CSV:`,
      code: 'import sys\n\nif __name__ == "__main__":\n    if len(sys.argv) < 2:\n        print("Usage: python report_writer.py <path-to-csv>")\n        sys.exit(1)\n    \n    filepath = sys.argv[1]\n    print(f"Analysing {filepath}...")\n    report = generate_report(filepath)\n    \n    output_file = filepath.replace(\'.csv\', \'_report.md\')\n    with open(output_file, \'w\') as f:\n        f.write(f"# Executive Report\\n\\n")\n        f.write(f"*Generated from: {filepath}*\\n\\n")\n        f.write(report)\n    \n    print(report)\n    print(f"\\nSaved to {output_file}")',
      codeLang: 'python',
      tip: 'This tool works with ANY CSV — sales, expenses, user analytics, survey results. Just point it at a file.',
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────── */
/* 12. Build an AI Agent with n8n                                        */
/* ────────────────────────────────────────────────────────────────────── */
const n8nAgent: Lab = {
  id: 'n8n-agent',
  title: 'Build an AI Agent with n8n',
  desc: 'Build a fully autonomous AI agent that can search the web, send emails, and update spreadsheets — no code required.',
  longDesc: 'Build a true AI agent — not just a chatbot. This agent receives a task, decides what tools to use, executes multi-step plans, and delivers results. It can search the web, send emails, read/write Google Sheets, and explain its reasoning. All built visually in n8n.',
  difficulty: 'Advanced',
  time: '150 min',
  tools: ['n8n', 'OpenAI', 'Serper API'],
  free: false,
  icon: '🤯',
  category: 'AI',
  completions: 540,
  prerequisites: ['n8n cloud or self-hosted', 'OpenAI API key', 'Serper.dev API key (free 2,500 queries)', 'Gmail & Google Sheets connected'],
  outcomes: [
    'A multi-tool AI agent that plans and executes tasks',
    'Web search, email, and spreadsheet tool integrations',
    'Understanding of agent architectures and tool-use',
  ],
  steps: [
    {
      title: 'Understand the agent architecture',
      duration: '5 min',
      content: `An AI agent is different from a chatbot:\n\n- **Chatbot**: You ask → it answers from knowledge\n- **Agent**: You give a task → it decides what tools to use → executes a multi-step plan → delivers results\n\nOur agent will have 4 tools:\n1. 🔍 **Web Search** — find current information (Serper API)\n2. 📧 **Send Email** — compose and send emails (Gmail)\n3. 📊 **Read/Write Spreadsheet** — access data (Google Sheets)\n4. 🧠 **Think** — reason about the problem (GPT-4o)\n\nThe agent decides WHICH tool to use and WHEN, based on the task you give it.`,
    },
    {
      title: 'Set up n8n and get API keys',
      duration: '10 min',
      content: `1. Sign up at **app.n8n.cloud** (free tier) or self-host\n2. Get a **Serper.dev** API key:\n   - Go to serper.dev → sign up → copy API key\n   - Free tier: 2,500 Google searches\n3. Have your **OpenAI API key** ready\n4. Connect **Gmail** and **Google Sheets** in n8n credentials`,
      toolLink: { label: 'Get Serper API Key', url: 'https://serper.dev/' },
    },
    {
      title: 'Create the agent workflow',
      duration: '20 min',
      content: `In n8n, create a new workflow:\n\n1. Add a **Chat Trigger** node (this creates a chat interface)\n2. Add an **AI Agent** node\n3. Configure the AI Agent:\n   - **Chat Model**: OpenAI GPT-4o\n   - **System Message**:`,
      code: `You are an autonomous AI business assistant for African professionals.

You have access to these tools:
1. Web Search - search the internet for current information
2. Send Email - compose and send emails via Gmail
3. Google Sheets - read from or write to spreadsheets
4. Calculator - perform calculations

When given a task:
1. Think step-by-step about what you need to do
2. Use the appropriate tools in sequence
3. If a tool fails, try an alternative approach
4. Always explain what you did and why

Be specific, practical, and efficient. Minimise unnecessary tool calls.
When searching, prefer African-specific sources and context.`,
      codeLang: 'text',
    },
    {
      title: 'Add the Web Search tool',
      duration: '15 min',
      content: `Connect a search tool to your agent:\n\n1. Under the Agent node, click **+ Add Tool**\n2. Add **SerpAPI** or **HTTP Request** (we'll use Serper)\n3. Configure as an HTTP Request tool:\n   - Name: "Web Search"\n   - Description: "Search the internet for current information. Input: search query string."\n   - Method: POST\n   - URL: https://google.serper.dev/search\n   - Headers: X-API-KEY = your Serper key, Content-Type = application/json\n   - Body:`,
      code: `{
  "q": "{{$fromAI('query', 'The search query')}}",
  "gl": "ng",
  "num": 5
}`,
      codeLang: 'json',
      tip: 'Set "gl" to your country code (ng=Nigeria, gh=Ghana, ke=Kenya) for localised results.',
    },
    {
      title: 'Add Email and Sheets tools',
      duration: '20 min',
      content: `**Email Tool:**\n1. Add Tool → Gmail → Send Email\n2. Name: "Send Email"\n3. Description: "Send an email. Inputs: to (email address), subject, body (HTML supported)."\n4. Map the fields from AI input\n\n**Google Sheets Tool:**\n1. Add Tool → Google Sheets → Append Row / Get Rows\n2. Name: "Google Sheets"\n3. Description: "Read from or write to a Google spreadsheet. Input: spreadsheet name, data."\n4. Connect to your Google account\n\n**Calculator Tool:**\n1. Add Tool → Code → JavaScript\n2. Name: "Calculator"\n3. Description: "Calculate math expressions. Input: mathematical expression as a string."\n4. Code:`,
      code: `const expression = $fromAI('expression', 'Math expression to calculate');
try {
  const result = Function('"use strict"; return (' + expression + ')')();
  return { result: result };
} catch (e) {
  return { error: "Invalid expression: " + e.message };
}`,
      codeLang: 'javascript',
    },
    {
      title: 'Test with real tasks',
      duration: '30 min',
      content: `Activate the workflow and open the chat interface. Try these real tasks:\n\n**Task 1 — Research:**\n> "Search for the latest AI regulations in Nigeria and Kenya. Summarise the key points."\n\nThe agent should: Search → Read results → Summarise\n\n**Task 2 — Multi-step:**\n> "Find the top 5 AI startups in West Africa, their funding amounts, and add them to a Google Sheet called 'AI Startups Research'."\n\nThe agent should: Search → Parse results → Write to Sheets\n\n**Task 3 — Email outreach:**\n> "Draft and send an email to partner@example.com introducing our AI consulting services. Mention our prices: $200/hr consulting, $500 automation setup. Make it professional but warm.""\n\nThe agent should: Compose email → Send via Gmail`,
      checkpoint: 'All 3 tasks execute successfully — you can see the tool calls in the execution log.',
    },
    {
      title: 'Add memory & deploy',
      duration: '15 min',
      content: `**Add Memory:**\nIn the AI Agent node, enable **Window Buffer Memory** with a window size of 10. This lets the agent remember previous messages in the conversation.\n\n**Deploy as API:**\n1. Replace the Chat Trigger with a **Webhook** trigger\n2. Now your agent is available as an API endpoint\n3. Connect it to your WhatsApp bot, website, or Telegram\n\n🎉 **You just built a real AI agent!**\n\nThis is NOT a toy — this is the same architecture used by:\n- AutoGPT and CrewAI\n- Enterprise AI assistants\n- AI-powered research tools\n\n**Next steps:**\n- Add more tools: database queries, Slack, CRM updates\n- Build a "manager" agent that delegates to specialist sub-agents\n- Add human-in-the-loop approval for emails and financial actions\n- Connect to AfriFlow Work to auto-apply for jobs 🔥`,
      tip: 'The agent pattern is the most important AI architecture of 2026. Master this and you can build virtually any AI product.',
    },
  ],
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Export all labs                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */
export const ALL_LABS: Lab[] = [
  whatsappBot,
  invoiceGen,
  leadCapture,
  socialScheduler,
  aiChatbot,
  cvScreener,
  inventoryAlert,
  contentWriter,
  paymentNotifier,
  pythonOpenai,
  dataSummarizer,
  n8nAgent,
]

export function getLabById(id: string): Lab | undefined {
  return ALL_LABS.find(lab => lab.id === id)
}

export function getLabsByCategory(category: string): Lab[] {
  return category === 'All' ? ALL_LABS : ALL_LABS.filter(l => l.category === category)
}

export function getLabsByDifficulty(difficulty: string): Lab[] {
  return difficulty === 'All' ? ALL_LABS : ALL_LABS.filter(l => l.difficulty === difficulty)
}
