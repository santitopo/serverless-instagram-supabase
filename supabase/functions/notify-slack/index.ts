import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const SLACK_TOKEN = "SLACK_TOKEN";
const SLACK_CHANNEL = "SLACK_CHANNEL";
const slackToken = Deno.env.get(SLACK_TOKEN);
const slackChannelId = Deno.env.get(SLACK_CHANNEL);

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const resp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${slackToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: id,
        text: text,
      }),
    });
    const data = await resp.json();
    // Print result, which includes information about the message (like TS)
    return !!data?.ok;
  } catch (error) {
    console.error(error);
  }
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, x-client-info, apikey",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { username, description, created_at } = await req.json();

  const message = `New post created:
  Created by: ${username}
  Description: ${description}
  Posted at: ${created_at}`;

  //Send message to Slack and wait for result
  const success = await publishMessage(slackChannelId, message);

  return new Response(
    JSON.stringify(
      success
        ? `Message sent successfully: ${message}`
        : "Message failed to deliver"
    ),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
