import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { MongoClient } from "npm:mongodb@6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PracticeSession {
  instrument: string;
  gradeLevel: number;
  practiceDuration: number;
  generatedRoutine: {
    id: string;
    date: string;
    instrument: string;
    gradeLevel: number;
    totalDuration: number;
    exercises: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      duration: number;
      difficulty: string;
      instructions: string[];
      tips: string[];
      completed: boolean;
    }>;
    focusArea: string;
    generatedBy: string;
  };
  timestamp: Date;
}

async function getMongoClient(): Promise<MongoClient> {
  const uri = Deno.env.get("MONGODB_URI");
  if (!uri) {
    throw new Error("MONGODB_URI environment variable not set");
  }

  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const client = await getMongoClient();
    const db = client.db("madjo_music");
    const collection = db.collection<PracticeSession>("practice_sessions");

    if (req.method === "POST") {
      const body = await req.json();
      const { instrument, gradeLevel, practiceDuration, generatedRoutine } = body;

      if (!instrument || !gradeLevel || !practiceDuration || !generatedRoutine) {
        await client.close();
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const session: PracticeSession = {
        instrument,
        gradeLevel,
        practiceDuration,
        generatedRoutine,
        timestamp: new Date(),
      };

      await collection.insertOne(session);
      await client.close();

      return new Response(
        JSON.stringify({ success: true, message: "Practice session saved successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "GET") {
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get("limit") || "10");

      const sessions = await collection
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();

      await client.close();

      return new Response(
        JSON.stringify(sessions),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await client.close();
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("MongoDB error:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
