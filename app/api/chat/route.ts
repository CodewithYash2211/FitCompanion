import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_INSTRUCTION = `You are FitCompanion AI, a practical, knowledgeable fitness and nutrition coach.

Your primary rule is: ANSWER THE USER'S ACTUAL QUESTION DIRECTLY.

Never replace a requested answer with a generic status update, clarification request, motivational statement, or unrelated recommendation.

If the user asks for a workout, provide the workout.
If the user asks for nutrition advice, provide nutrition advice.
If the user asks about an exercise, explain the exercise.
If the user asks about pain during an exercise, provide conservative fitness guidance and appropriate safety escalation.
If the user asks a general fitness question, answer it directly.

Use the user's supplied context when relevant, but never let context override intent.

Do not diagnose medical conditions or prescribe medication. For potentially serious symptoms, recommend professional medical evaluation while still providing safe general guidance.

Do not invent user data.

Answer first. Personalize second.

Be practical, specific, structured, concise, and supportive.`

function generateMockResponse(prompt: string, ctx: any) {
  const p = prompt.toLowerCase();
  
  // Extract user context safely
  const profile = ctx?.user || {};
  const weight = profile.weight || 70;
  
  const nut = ctx?.nutrition || {};
  const consumedP = nut.proteinConsumed || 0;
  const targetP = nut.proteinTarget || 120;
  const remainingP = Math.max(0, targetP - consumedP);
  
  const consumedC = nut.caloriesConsumed || 0;
  const targetC = nut.calorieTarget || 2500;
  const remainingC = Math.max(0, targetC - consumedC);

  // Intent Matchers
  const isPain = p.match(/pain|hurt|injury|aching|sore/);
  const isKneePain = p.match(/knee|squat/);
  const isBackPain = p.match(/back.*deadlift|deadlift.*back|back pain/);
  
  const isWeightGain = p.match(/gain weight|bulking|surplus|not gaining|muscle gain/);
  const isWeightLoss = p.match(/lose weight|cutting|deficit|fat loss|not losing/);
  
  const isPreWorkout = p.match(/before.*workout|pre-workout/);
  const isPostWorkout = p.match(/after.*workout|post-workout/);
  const isMealIdea = p.match(/meal|dinner|lunch|breakfast|food|eat/);
  
  const isProtein = p.match(/protein/);
  const isProgression = p.match(/progress|overload|stronger|increase|plateau/);
  const isSets = p.match(/how many sets|volume/);
  const isFrequency = p.match(/how many days|twice a week|enough/);
  
  const isWorkout = p.match(/workout|routine|training|gym/);
  const isChestTriceps = p.match(/chest.*tricep|push/);
  const isBackBiceps = p.match(/back.*bicep|pull/);

  // 1. PAIN / INJURY
  if (isPain) {
    if (isKneePain) {
      return `If squats are causing knee pain, don't push through sharp or worsening pain.\n\nFor now, try lower-stress alternatives:\n- Leg press (comfortable ROM)\n- Glute bridges\n- Hamstring curls\n- Step-ups\n\nReduce the load and check your form. If pain is severe, persistent, or involves swelling, see a physiotherapist.`;
    }
    if (isBackPain) {
      return `1. Stop deadlifting for today if the movement is causing pain.\n2. Don't try to push through sharp/radiating pain.\n3. For today's session, use pain-free alternatives such as:\n   - Chest-supported row\n   - Lat pulldown\n   - Seated cable row\n   depending on what is comfortable.\n4. Review load, bracing, setup and technique before returning to deadlifts.\n5. If pain is severe, radiates into the leg, causes numbness/weakness, follows an injury, or persists, get evaluated by a healthcare professional.`;
    }
    return `If you are experiencing pain, stop the exercise causing it immediately. Don't push through sharp pain.\n\nSwitch to alternative exercises that train the same muscles but are completely pain-free. If the pain is severe, persistent, or worsening, please consult a medical professional or physiotherapist.`;
  }
  
  // 2. WEIGHT GAIN
  if (isWeightGain) {
    return `Most likely you're not consistently eating enough calories to stay in a surplus. \n\nIf you're training and your weight isn't increasing for 2–3 weeks, increase your daily intake by around 200–300 kcal. Keep protein around 1.6–2.2 g/kg bodyweight and track your morning weight 3–4 times per week.\n\n(Your current daily target is ${targetC} kcal).`;
  }

  // 3. WEIGHT LOSS
  if (isWeightLoss) {
    return `If you're not losing weight, you are likely not in a calorie deficit. \n\nEnsure you are accurately tracking all food, oils, and liquids. If your weight hasn't dropped in 2 weeks, reduce your daily intake by 200–300 calories or increase your daily activity (e.g., add 2,000 steps).\n\n(Your current daily target is ${targetC} kcal).`;
  }

  // 4. PRE/POST WORKOUT NUTRITION
  if (isPreWorkout) {
    return `For a workout in 60–90 minutes, have a meal containing 30–60g carbs and 15–25g protein. \n\nIndian options:\n- Banana + Curd\n- Poha + Curd\n- 2 Rotis + Paneer\n- Oats + Milk + Banana\n\nKeep fats and fiber low so it digests quickly.`;
  }
  
  if (isPostWorkout) {
    return `After your workout, consume 25–40g of high-quality protein to support recovery, along with some carbs.\n\nOptions:\n- 1 scoop Whey Protein + Banana\n- 150g Chicken Breast + Rice\n- 150g Paneer + 2 Rotis\n- Soya Chunk Pulao + Curd\n\nTry to eat within 1-2 hours of finishing your session.`;
  }
  
  // 5. MEAL IDEAS
  if (isMealIdea && (p.includes('indian') || p.includes('veg'))) {
    return `Here are 3 high-protein Indian vegetarian meals:\n\n1. Paneer bhurji + 3 rotis + curd — ~35–40g protein\n2. Dal + rice + 100g paneer — ~35–40g protein\n3. Soya chunk pulao + curd — ~40–45g protein\n\nYou have ${remainingC} kcal and ${remainingP}g protein left today, so adjust portions to fit your targets.`;
  }
  
  if (isMealIdea) {
    return `Here are some great high-protein meal options:\n\n1. 150g Chicken breast + 1 cup rice + veggies\n2. 150g Paneer bhurji + 2 rotis\n3. 4 Whole eggs + 2 slices whole wheat toast\n\nYou have ${remainingC} kcal and ${remainingP}g protein left today.`;
  }

  // 6. PROTEIN
  if (isProtein) {
    const minP = Math.round(weight * 1.6);
    const maxP = Math.round(weight * 2.2);
    return `For muscle growth and maintenance, aim for 1.6–2.2g of protein per kg of bodyweight.\n\nFor your weight (${weight}kg), this is approximately **${minP}g – ${maxP}g of protein per day.**\n\n(Your current daily target is ${targetP}g).`;
  }

  // 7. PROGRESSION / GETTING STRONGER
  if (isProgression) {
    return `To increase your strength, apply Progressive Overload:\n\n1. **Micro-load:** Add just 1–2.5kg to the bar each week.\n2. **Rep Progression:** If you did 3x8 last week, aim for 3x9 this week before adding weight.\n3. **Improve Technique:** Dial in your form and bracing.\n4. **Eat/Sleep:** Ensure you are eating enough calories and sleeping 7-8 hours.`;
  }

  // 8. SETS & FREQUENCY
  if (isSets) {
    return `For muscle growth, aim for 10–20 working sets per muscle group per week.\n\nStart at the lower end (10-12 sets) and gradually increase if you are recovering well. Focus on pushing each set close to failure rather than just doing more volume.`;
  }
  
  if (isFrequency) {
    return `Training a muscle group twice a week is generally optimal for hypertrophy. \n\nYes, you can train chest (or any muscle) twice a week, provided you recover adequately between sessions. 4-5 days in the gym per week is more than enough for excellent muscle growth if you follow a well-structured split (like Push/Pull/Legs).`;
  }

  // 9. WORKOUTS
  if (isWorkout || isChestTriceps || isBackBiceps) {
    if (isChestTriceps || p.includes('chest')) {
      return `### Chest + Triceps Workout\n\n## Warm-up\n5–8 minutes light cardio & dynamic stretching\n\n## Chest\n1. Bench Press — 3 × 8–10\n   Rest: 2 min\n2. Incline Dumbbell Press — 3 × 10–12\n   Rest: 90 sec\n3. Cable Crossovers — 3 × 12–15\n   Rest: 60 sec\n\n## Triceps\n4. Tricep Pushdowns — 3 × 10–12\n   Rest: 60 sec\n5. Overhead Tricep Extension — 3 × 10–12\n   Rest: 60 sec\n\n## Progression\nTry to add 1-2 reps or a small amount of weight compared to your last session.`;
    }
    
    if (isBackBiceps || p.includes('back')) {
      return `### Back + Biceps Workout\n\n## Warm-up\n5–8 minutes\n\n## Back\n1. Lat Pulldown — 3 × 10–12\n   Rest: 90 sec\n   Cue: Drive elbows down.\n2. Barbell Row — 3 × 8–10\n   Rest: 2 min\n   Cue: Keep torso controlled.\n3. Seated Cable Row — 3 × 10–12\n   Rest: 90 sec\n\n## Biceps\n4. Barbell Curl — 3 × 8–10\n   Rest: 90 sec\n5. Hammer Curl — 3 × 10–12\n   Rest: 60 sec\n\n## Progression\nTry to add 1-2 reps or a small amount of weight compared to your last session.`;
    }
    
    return `### Full Body Workout\n\n## Warm-up\n5–8 minutes\n\n## Routine\n1. Goblet Squats — 3 × 8-10\n   Rest: 2 min\n2. Flat Dumbbell Press — 3 × 8-10\n   Rest: 90 sec\n3. Lat Pulldowns — 3 × 10-12\n   Rest: 90 sec\n4. Romanian Deadlifts — 3 × 10-12\n   Rest: 90 sec\n5. Dumbbell Lateral Raises — 3 × 12-15\n   Rest: 60 sec\n\n## Progression\nTry to add 1-2 reps or a small amount of weight compared to your last session.`;
  }

  // 10. GENERAL FALLBACK (Still useful, direct answer)
  return `To achieve your fitness goals, focus on the fundamentals:\n\n1. **Nutrition:** Hit your calorie and protein targets consistently.\n2. **Training:** Follow a structured routine and apply progressive overload.\n3. **Recovery:** Get 7-9 hours of sleep and manage stress.\n\nCould you specify if you need help with a particular workout, a meal idea, or troubleshooting a plateau?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, context } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const latestMessage = messages[messages.length - 1].parts[0].text
    const apiKey = process.env.GEMINI_API_KEY

    const contextString = `\n\n--- INTERNAL SYSTEM DATA (DO NOT EXPOSE DIRECTLY) ---\nUser Context JSON:\n${JSON.stringify(context, null, 2)}\n\nINSTRUCTION: Answer the user's latest question directly and practically. Use the context JSON above to personalize the answer if relevant, but NEVER refuse to answer the actual question just because their status says they already worked out or hit their goals.`
    
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_INSTRUCTION
        })

        let history = messages.slice(0, -1).map((m: any) => ({
          role: m.role,
          parts: [{ text: m.parts[0].text }]
        }))

        // Gemini requires the first history message to be from the user.
        if (history.length > 0 && history[0].role !== 'user') {
          history = history.slice(1)
        }

        const chat = model.startChat({ history })
        const result = await chat.sendMessage(latestMessage + contextString)
        const response = await result.response

        return NextResponse.json({ text: response.text() })
      } catch (geminiError) {
        // Fallback
        const mockResponse = generateMockResponse(latestMessage, context)
        return NextResponse.json({ text: mockResponse })
      }
    } else {
      const mockResponse = generateMockResponse(latestMessage, context)
      return NextResponse.json({ text: mockResponse })
    }

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
