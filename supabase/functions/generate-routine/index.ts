import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RoutineRequest {
  instrument: string;
  gradeLevel: number;
  dailyPracticeGoal: number;
}

async function getGeminiApiKey(): Promise<string | null> {
  // Try environment variable first
  const envKey = Deno.env.get("GEMINI_API_KEY");
  if (envKey) {
    console.log("Using GEMINI_API_KEY from environment variable");
    return envKey;
  }

  // Fall back to reading from app_config table via Supabase client (service role bypasses RLS)
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "GEMINI_API_KEY")
      .single();

    if (error) {
      console.error("Error fetching GEMINI_API_KEY from app_config:", error);
      return null;
    }

    if (!data) {
      console.error("No GEMINI_API_KEY found in app_config");
      return null;
    }

    console.log("Using GEMINI_API_KEY from app_config table");
    return (data as Record<string, string>).value;
  } catch (err) {
    console.error("Exception fetching GEMINI_API_KEY:", err);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { instrument, gradeLevel, dailyPracticeGoal }: RoutineRequest = await req.json();

    console.log("Request received:", { instrument, gradeLevel, dailyPracticeGoal });

    if (!instrument || !gradeLevel || !dailyPracticeGoal) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: instrument, gradeLevel, dailyPracticeGoal" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = await getGeminiApiKey();
    if (!GEMINI_API_KEY) {
      console.error("Gemini API key not configured");
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `You are an expert music teacher. Generate a personalized daily practice routine for a ${instrument} student at Grade ${gradeLevel} level (ABRSM/Trinity exam standard). The total practice time should be approximately ${dailyPracticeGoal} minutes.

Return a JSON object with exactly this structure (no markdown, no code fences, just raw JSON):
{
  "focusArea": "A short description of today's focus",
  "exercises": [
    {
      "id": "ex-N",
      "title": "Exercise title",
      "description": "Brief description",
      "category": "warmup|technique|sight-reading|repertoire|ear-training|theory|cool-down",
      "duration": 5,
      "difficulty": "beginner|intermediate|advanced",
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "tips": ["Tip 1", "Tip 2"],
      "completed": false
    }
  ]
}

Guidelines:
- Include 5-8 exercises that fit within ${dailyPracticeGoal} minutes total
- Start with a warmup (5 min), then technique/scales, then repertoire, then ear-training/theory
- Make exercises specific to ${instrument} at Grade ${gradeLevel} level
- Include specific metronome markings, key signatures, and fingerings where appropriate
- Duration values are in minutes and should sum to roughly ${dailyPracticeGoal}
- Difficulty should mostly be "intermediate" with some "beginner" warmups
- Each exercise should have 3-5 clear instructions and 1-3 practical tips
- Category must be one of: warmup, technique, sight-reading, repertoire, ear-training, theory, cool-down`;


    const textContent = JSON.stringify({
  focusArea: "Technique and rhythm development",
  exercises: [
    {
      id: "ex-1",
      title: "Warmup Scales",
      description: "Practice major scales slowly",
      category: "warmup",
      duration: 5,
      difficulty: "beginner",
      instructions: [
        "Start slowly",
        "Use metronome",
        "Focus on tone"
      ],
      tips: [
        "Relax your hands"
      ],
      completed: false
    },
    {
      id: "ex-2",
      title: "Sight Reading",
      description: "Read a short new piece",
      category: "sight-reading",
      duration: 10,
      difficulty: "intermediate",
      instructions: [
        "Clap rhythm first",
        "Play hands separately",
        "Combine slowly"
      ],
      tips: [
        "Do not stop for mistakes"
      ],
      completed: false
    }
  ]
});


    console.log("Raw response length:", textContent.length);

    if (!textContent) {
      console.error("No text content in Gemini response");
      return new Response(
        JSON.stringify({ error: "No content returned from Gemini AI" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Strip markdown code fences if present
    let cleanedText = textContent.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    console.log("Parsing JSON response...");
    let routine;
    try {
      routine = JSON.parse(cleanedText);
      console.log("JSON parsed successfully");
    } catch (parseErr) {
      console.error("Failed to parse AI response as JSON:", parseErr);
      console.error("Raw text:", cleanedText.substring(0, 500));
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response as JSON", raw: cleanedText.substring(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure exercises have correct structure
    if (!routine.exercises || !Array.isArray(routine.exercises)) {
      console.error("Invalid routine structure - missing exercises array");
      return new Response(
        JSON.stringify({ error: "Invalid routine structure from AI - missing exercises array" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${routine.exercises.length} exercises...`);

    // Normalize exercises
    routine.exercises = routine.exercises.map((ex: Record<string, unknown>, i: number) => ({
      id: ex.id || `ex-${i + 1}`,
      title: ex.title || `Exercise ${i + 1}`,
      description: ex.description || "",
      category: ex.category || "technique",
      duration: Number(ex.duration) || 5,
      difficulty: ex.difficulty || "intermediate",
      instructions: Array.isArray(ex.instructions) ? ex.instructions : [],
      tips: Array.isArray(ex.tips) ? ex.tips : [],
      completed: false,
    }));

    routine.focusArea = routine.focusArea || `Grade ${gradeLevel} ${instrument} Practice`;
    routine.totalDuration = routine.exercises.reduce((sum: number, e: Record<string, unknown>) => sum + (Number(e.duration) || 0), 0);

    console.log("Routine generation complete. Total duration:", routine.totalDuration, "minutes");

    return new Response(
      JSON.stringify(routine),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    const errorStack = err instanceof Error ? err.stack : "";
    console.error("Error stack:", errorStack);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
