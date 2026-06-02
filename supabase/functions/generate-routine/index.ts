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

function generateFallbackRoutine(instrument: string, gradeLevel: number, dailyPracticeGoal: number) {
  const instrumentName = instrument.charAt(0).toUpperCase() + instrument.slice(1);

  const exercises = [
    {
      id: "ex-1",
      title: `${instrumentName} Warm-Up`,
      description: `Essential warm-up exercises for ${instrument} - finger stretches and basic movements.`,
      category: "warmup",
      duration: Math.round(dailyPracticeGoal * 0.12),
      difficulty: "beginner",
      instructions: [
        "Start with gentle finger stretches",
        "Play basic scales at moderate tempo",
        "Focus on relaxed hand position",
        "Breathe deeply and stay relaxed"
      ],
      tips: ["Keep shoulders relaxed", "Use a mirror to check posture"],
      completed: false
    },
    {
      id: "ex-2",
      title: "Technical Exercises",
      description: `Grade ${gradeLevel} ${instrument} technique - scales and arpeggios.`,
      category: "technique",
      duration: Math.round(dailyPracticeGoal * 0.25),
      difficulty: "intermediate",
      instructions: [
        `Practice Grade ${gradeLevel} scales hands together`,
        "Use metronome at 72 BPM",
        "Focus on even tone and timing",
        "Practice ascending and descending"
      ],
      tips: ["Start slow and accurate", "Gradually increase tempo when comfortable"],
      completed: false
    },
    {
      id: "ex-3",
      title: "Sight-Reading Practice",
      description: `Develop sight-reading skills with Grade ${gradeLevel} appropriate material.`,
      category: "sight-reading",
      duration: Math.round(dailyPracticeGoal * 0.18),
      difficulty: "intermediate",
      instructions: [
        "Scan the piece for 30 seconds",
        "Identify key and time signatures",
        "Play through without stopping",
        "Note difficult passages for review"
      ],
      tips: ["Count one bar in before starting", "Keep going even if you make mistakes"],
      completed: false
    },
    {
      id: "ex-4",
      title: "Repertoire Study",
      description: `Work on your main piece - focus on expression and dynamics.`,
      category: "repertoire",
      duration: Math.round(dailyPracticeGoal * 0.28),
      difficulty: "intermediate",
      instructions: [
        "Practice challenging sections separately",
        "Add dynamics and expression",
        "Play through the entire piece",
        "Record yourself for feedback"
      ],
      tips: ["Practice problem areas slowly first", "Listen to professional recordings for interpretation"],
      completed: false
    },
    {
      id: "ex-5",
      title: "Ear Training",
      description: "Interval recognition and rhythmic exercises.",
      category: "ear-training",
      duration: Math.round(dailyPracticeGoal * 0.12),
      difficulty: "beginner",
      instructions: [
        "Identify intervals by ear",
        "Clap back rhythmic patterns",
        "Practice melody playback",
        "Work on chord progression recognition"
      ],
      tips: ["Use familiar songs as interval references", "Practice daily for best results"],
      completed: false
    },
    {
      id: "ex-6",
      title: "Cool Down & Review",
      description: "End your session with relaxed playing and goal reflection.",
      category: "cool-down",
      duration: Math.round(dailyPracticeGoal * 0.05),
      difficulty: "beginner",
      instructions: [
        "Play something you enjoy",
        "Review what you practiced today",
        "Note areas for tomorrow's session",
        "Stretch and relax your hands"
      ],
      tips: ["This is for enjoyment and reflection", "Keep a practice journal"],
      completed: false
    }
  ];

  // Adjust durations to match dailyPracticeGoal
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const ratio = dailyPracticeGoal / totalDuration;
  exercises.forEach(ex => {
    ex.duration = Math.max(3, Math.round(ex.duration * ratio));
  });

  return {
    focusArea: `Grade ${gradeLevel} ${instrumentName} Practice - Building Core Skills`,
    exercises,
    totalDuration: exercises.reduce((sum, ex) => sum + ex.duration, 0),
    generatedBy: "fallback"
  };
}

async function getGeminiApiKey(): Promise<string | null> {
  const envKey = Deno.env.get("GEMINI_API_KEY");
  if (envKey) {
    console.log("Using GEMINI_API_KEY from environment variable");
    return envKey;
  }

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

  let requestBody: RoutineRequest;
  let instrument: string;
  let gradeLevel: number;
  let dailyPracticeGoal: number;

  try {
    requestBody = await req.json();
    instrument = requestBody.instrument;
    gradeLevel = requestBody.gradeLevel;
    dailyPracticeGoal = requestBody.dailyPracticeGoal;

    console.log("Request received:", { instrument, gradeLevel, dailyPracticeGoal });

    if (!instrument || !gradeLevel || !dailyPracticeGoal) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: instrument, gradeLevel, dailyPracticeGoal" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (parseError) {
    console.error("Failed to parse request body:", parseError);
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const GEMINI_API_KEY = await getGeminiApiKey();
  if (!GEMINI_API_KEY) {
    console.log("Gemini API key not configured, using fallback routine");
    const fallback = generateFallbackRoutine(instrument, gradeLevel, dailyPracticeGoal);
    return new Response(
      JSON.stringify(fallback),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
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

    console.log("Initializing Gemini SDK...");
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    console.log("Getting model: gemini-2.0-flash");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    console.log("Gemini API response received");

    const response = result.response;
    const textContent = response.text();

    console.log("Raw response length:", textContent.length);

    if (!textContent) {
      console.log("No text content in Gemini response, using fallback");
      const fallback = generateFallbackRoutine(instrument, gradeLevel, dailyPracticeGoal);
      return new Response(
        JSON.stringify(fallback),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
      console.error("Failed to parse AI response as JSON, using fallback:", parseErr);
      const fallback = generateFallbackRoutine(instrument, gradeLevel, dailyPracticeGoal);
      return new Response(
        JSON.stringify(fallback),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!routine.exercises || !Array.isArray(routine.exercises)) {
      console.error("Invalid routine structure, using fallback");
      const fallback = generateFallbackRoutine(instrument, gradeLevel, dailyPracticeGoal);
      return new Response(
        JSON.stringify(fallback),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${routine.exercises.length} exercises...`);

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
    routine.generatedBy = "ai";

    console.log("Routine generation complete. Total duration:", routine.totalDuration, "minutes");

    return new Response(
      JSON.stringify(routine),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error, using fallback:", err);
    const fallback = generateFallbackRoutine(instrument, gradeLevel, dailyPracticeGoal);
    return new Response(
      JSON.stringify(fallback),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
