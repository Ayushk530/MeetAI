import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  CallSessionStartedEvent,
  CallSessionParticipantLeftEvent
} from "@stream-io/node-sdk";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { Groq } from "groq-sdk";
import { StreamChat } from "stream-chat";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");
  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or api key" },
      { status: 400 }
    );
  }
  const body = await req.text();
  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const eventType = (payload as Record<string, unknown>)?.type;

  // Meeting join logic (keeps your meeting status filter as-is)
  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 });
    }
    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );
    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not Found" }, { status: 404 });
    }
    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date()
      })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));
    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Groq agent connection
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
    const aiIntro = await groq.chat.completions.create({
      model: "llama-3-8b-8192",
      messages: [
        { role: "system", content: existingAgent.instructions },
        { role: "user", content: "Agent joining the meeting now." }
      ]
    });

    // Send the AI message to meeting chat using StreamChat (not streamVideo)
    const chatClient = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!, // Should be same as your frontend
      process.env.STREAM_CHAT_SECRET_KEY!
    );
    const channel = chatClient.channel('messaging', meetingId);

    await channel.watch(); // Ensure channel is active/open/created

    await channel.sendMessage({
     text: aiIntro.choices[0].message.content ?? "",
    user_id: existingAgent.id
    });

    // You may want to add the agent as a member if the agent is not already part of the channel:
    // await channel.addMembers([existingAgent.id]);
  }
  else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingID" }, { status: 400 });
    }
    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  }
  return NextResponse.json({ status: "ok" });
}
