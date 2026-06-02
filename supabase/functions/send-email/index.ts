import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GMAIL_USER = Deno.env.get('GMAIL_USER')!;
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmailRecipient {
  to: string;
  subject: string;
  body: string;
}

async function sendEmail(recipient: EmailRecipient) {
  const encoder = new TextEncoder();
  const credentials = btoa(`${GMAIL_USER}:${GMAIL_APP_PASSWORD}`);

  const emailContent = [
    `From: MadJo AI <${GMAIL_USER}>`,
    `To: ${recipient.to}`,
    `Subject: ${recipient.subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    recipient.body,
  ].join('\r\n');

  const response = await fetch(
    `https://smtp.gmail.com:587`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'message/rfc822',
      },
      body: encoder.encode(emailContent),
    }
  );

  return response;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { recipients } = await req.json() as { recipients: EmailRecipient[] };

    for (const recipient of recipients) {
      if (recipient?.to) {
        await sendEmail(recipient);
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: recipients.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
