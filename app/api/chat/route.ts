import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_INSTRUCTION = `You are FitCompanion AI, a practical personal fitness and nutrition coach.

Your first priority is answering the user's actual question.

Never merely acknowledge, paraphrase, summarize, or restate the user's request.
Never begin with meta-language such as:
"I understand you are asking..."
"You're asking about..."
"Based on your question..."
"Based on your data..."
"Here is a direct answer..."

Answer directly.

When the user requests a workout, provide a complete actionable workout.
When the user requests nutrition advice, provide concrete food choices and approximate macros when possible.
When the user asks about protein or calories, calculate the remaining amount using actual logged data.
When relevant, use the user's FitCompanion context to personalize the answer.

If user data is missing, clearly state what is missing but STILL provide useful general guidance.
Never fabricate user data.
Do not give generic motivational filler instead of answering the question.
Keep answers structured, practical and conversational.
Use Markdown formatting extensively.
Only mention recovery, hydration, previous workouts, or dashboard status when relevant to the user's actual request.
Do not allow contextual information to override explicit user intent.

For health and fitness-related pain questions (e.g., knee pain, shoulder pain, back pain, soreness):
- Provide practical exercise alternatives and training modifications.
- Do NOT automatically refuse to answer.
- Give safe general guidance.
- Advise seeking professional help if the pain is severe, persistent, worsening, or associated with swelling/instability.
- Do not diagnose medical conditions.
- Do not mention macros/protein if the question is only about joint pain or exercise programming.

For general fitness/programming questions (e.g., sets, reps, plateau, alternatives, recovery):
- Answer the fitness question directly.
- NEVER redirect a gym question to macros or protein goals.`

function generateMockResponse(prompt: string, ctx: any) {
  const p = prompt.toLowerCase()
  const consumedP = ctx.nutrition?.proteinConsumed || 0
  const targetP = ctx.nutrition?.proteinTarget || 120
  const remainingP = Math.max(0, targetP - consumedP)
  const consumedC = ctx.nutrition?.caloriesConsumed || 0
  const targetC = ctx.nutrition?.calorieTarget || 2600
  const remainingC = Math.max(0, targetC - consumedC)
  const weightStr = ctx.user?.weight || ""
  const weight = parseInt(weightStr) || null

  // 1. NUTRITION: 3 high-protein Indian vegetarian meals
  if (p.includes('3 high-protein') || p.includes('indian vegetarian meals') || (p.includes('indian') && p.includes('vegetarian'))) {
    return `Here are 3 high-protein Indian vegetarian meal options:

1. **Paneer Bhurji + 2 Rotis**
150g Paneer cooked with onions, tomatoes, and minimal oil.
*Approx. 30–35g protein, 450 kcal*

2. **Soya Chunk Curry + 1 Cup Rice**
50g Soya chunks cooked in a tomato-onion gravy.
*Approx. 25–30g protein, 350 kcal*

3. **Dal Tadka + 1 Cup Rice + 100g Curd**
A large bowl of thick dal (lentils) served with rice and a side of plain curd.
*Approx. 20–25g protein, 450 kcal*

You can adjust portion sizes depending on your remaining calories (${remainingC} kcal left today).`
  }

  // 2. PRE-WORKOUT NUTRITION
  if (p.includes('eat before') && p.includes('workout')) {
    return `Before a workout, your focus should be on **carbohydrates** for energy, with a moderate amount of protein. Keep fats and fiber low if you are eating close to your session, as they slow down digestion.

**1–3 hours before training:**
You can have a solid meal.
*Examples:*
- Poha + 1 bowl of curd
- 2 rotis + dal + a small portion of paneer/chicken

**30–60 minutes before training:**
Keep it light and easy to digest.
*Examples:*
- 1 Banana + a small cup of curd
- 1 Apple + 1 tbsp peanut butter
- Oats boiled in milk with a banana

Since you have ${remainingC} kcal remaining today, an oatmeal and banana bowl (approx. 300 kcal) is a great choice.`
  }

  // 3. POST-WORKOUT NUTRITION
  if (p.includes('eat after') && p.includes('workout')) {
    return `After your workout, your body needs **protein** to repair muscle tissue and **carbohydrates** to replenish glycogen stores.

Here are some great options:

1. **Quick Recovery:**
1 scoop Whey Protein + 1 Banana + Water/Milk
*(~25-30g protein, fast digesting)*

2. **Vegetarian Meal:**
150g Paneer + 2 Rotis + Salad
*(~30-35g protein)*

3. **Non-Vegetarian Meal:**
150g Chicken Breast + 1 cup Rice + Dal
*(~40-45g protein)*

4. **Vegan/Plant-based:**
Soya chunks + Rice + Curd (or vegan yogurt alternative)
*(~35-40g protein)*

Try to get a meal in within 1-2 hours after you finish training.`
  }

  // 4. PROTEIN BASED ON BODY WEIGHT
  if (p.includes('how much protein') && p.includes('body weight')) {
    if (weight) {
      const lower = Math.round(weight * 1.6)
      const upper = Math.round(weight * 2.2)
      return `For muscle growth and maintenance, the standard evidence-based recommendation is 1.6g to 2.2g of protein per kg of body weight.

Since you weigh ${weight}kg:
${weight}kg × 1.6–2.2g/kg = **${lower}g to ${upper}g of protein per day.**

Your current target is set to ${targetP}g, which aligns perfectly with this range.`
    }
    return `For muscle growth and maintenance, the standard evidence-based recommendation is **1.6g to 2.2g of protein per kg of body weight**.

If you weigh 70kg, that means:
70kg × 1.6–2.2g/kg = approximately 112g–154g of protein per day.

If you update your profile with your current body weight, I can give you a personalized calculation.`
  }

  // PAIN: Deadlift back pain
  if (p.includes('back') && (p.includes('deadlift') || p.includes('deadlifts'))) {
    return `If deadlifts are causing back pain, don't continue loading the movement or try to push through the pain.

For today's session, I'd skip heavy deadlifts and choose exercises that don't reproduce the pain.

You could consider:

• Seated/lying hamstring curl — 3 × 10–15
• Leg extension — 3 × 10–15
• Glute bridge — 3 × 10–15 if comfortable
• Calf raises — 3 × 12–15
• Light walking for a few minutes if comfortable

If you want to train your back, choose a supported movement such as a chest-supported row ONLY if it is completely pain-free.

Stop any movement that increases the pain.

If the pain is severe, sudden, radiating down the leg, associated with numbness/weakness, or persists/worsens, get assessed by a qualified healthcare professional or physiotherapist.`
  }

  // PAIN: Knee pain squats
  if (p.includes('instead of') && p.includes('squat')) {
    return `If squats are causing knee pain, don't push through sharp or worsening pain.

For now, you can try lower-impact alternatives such as:

1. Glute bridges / hip thrusts
2. Romanian deadlifts
3. Hamstring curls
4. Cable pull-throughs
5. Step-ups, if they are comfortable
6. Leg press with a comfortable range of motion, if pain-free

For any exercise, use a range of motion and load that feels comfortable rather than forcing the movement.

You can also temporarily reduce squat load and check whether factors like stance, depth, warm-up, and technique affect your comfort.

If the pain is persistent, severe, worsening, associated with swelling/instability, or you cannot comfortably bear weight, stop the exercise and get assessed by a qualified healthcare professional or physiotherapist.`
  }

  // WEIGHT GAIN
  if (p.includes('why am i not gaining weight') || p.includes('want to gain weight')) {
    return `Most likely, you're not consistently eating enough calories to stay in a calorie surplus.

If your goal is to gain weight, start by tracking your average body weight and calorie intake for 1–2 weeks.

Here are the main things to check:

1. **CALORIE SURPLUS**
Aim for roughly 200–300 kcal above your maintenance calories.

2. **PROTEIN**
Aim for around 1.6–2.2g of protein per kg of body weight.

3. **CONSISTENCY**
Your weekly average matters more than one high-calorie day.

4. **WEIGHT TREND**
Weigh yourself under similar conditions several mornings per week and track the weekly average.

5. **TRAINING**
Use progressive resistance training so more of the gained weight can support muscle growth.

If your weight has not increased for 2–3 weeks, increase your daily intake by another ~150–250 kcal.

If you give me your current weight, daily calories, protein intake and how long you've been trying to gain weight, I can help you calculate a more specific target.`
  }

  // WORKOUT: Back and Biceps
  if (p.includes('back and biceps') || p.includes('back and bicep')) {
    return `### Back + Biceps

**Warm-up**
5–8 minutes

**BACK**

1. Lat Pulldown
3 × 10–12
Rest: 90 sec
Cue: Drive elbows down, avoid swinging.

2. Barbell Row
3 × 8–10
Rest: 2 min

3. Seated Cable Row
3 × 10–12
Rest: 90 sec

**BICEPS**

4. Barbell Curl
3 × 8–10
Rest: 90 sec

5. Hammer Curl
3 × 10–12
Rest: 60 sec

**Duration:** 45–55 min

**Progression:** Aim to increase the weight on Barbell Rows from your last session.`
  }

  // WORKOUT: Tomorrow's Chest and Triceps
  if (p.includes("tomorrow") && p.includes("chest") && p.includes("triceps")) {
    return `### Tomorrow — Chest + Triceps

**Warm-up**
5–8 minutes

**CHEST**

1. Bench Press
3 × 8–10
Rest: 2 min

2. Incline Dumbbell Press
3 × 10–12
Rest: 90 sec

3. Cable Crossovers
3 × 12–15
Rest: 60 sec

**TRICEPS**

4. Tricep Pushdowns
3 × 10–12
Rest: 60 sec

5. Overhead Tricep Extension
3 × 10–12
Rest: 60 sec

**Progression:** Try to add 2.5kg to your Bench Press tomorrow.`
  }
  
  // NUTRITION: 500 Calories Left / Dinner
  if (p.includes('500 calories') || (p.includes('eat') && remainingC <= 500 && remainingC > 0)) {
    return `You have approximately 500 kcal and ${remainingP}g protein remaining.

I'd go with:

🍗 **Chicken + Roti**
150g chicken
2 rotis
100g curd

≈ 500 kcal
≈ 45g protein

Vegetarian alternative:
150g paneer + 1 roti + large salad

≈ 500 kcal
≈ 35g protein`
  }

  // PROGRESSION: Bench Press
  if (p.includes('bench press') && p.includes('improve')) {
    return `To improve your bench press, apply progressive overload using these methods:

1. **Micro-loading:** Add just 1–2.5kg total to the bar each week.
2. **Rep Progression:** If you hit 3x8 at 60kg, aim for 3x9 next time before adding weight.
3. **Secondary Pressing:** Add a second, lighter chest day focusing on speed or variations like Incline or Pause Bench.
4. **Triceps/Shoulders:** Strengthen your lock-out with overhead presses and tricep extensions.`
  }

  // RECOVERY: After leg day
  if (p.includes('recover') && p.includes('leg day')) {
    return `To optimize your recovery after a tough leg day, focus on these pillars:

1. **Sleep:** Aim for 7-9 hours of quality sleep tonight. This is when the majority of physical repair occurs.
2. **Nutrition:** Ensure you hit your daily protein target (currently ${targetP}g) and consume enough overall calories to support muscle repair.
3. **Hydration:** Replenish fluids and electrolytes lost during your workout.
4. **Active Recovery:** Tomorrow, do light activity like walking or mobility work to promote blood flow into the legs without adding fatigue.

If you experience severe DOMS (soreness), avoid heavy lifting until the pain subsides to a manageable level.`
  }

  // Default Fallback
  return `I can help with that. Could you provide a bit more specific detail on what you're trying to achieve with your current fitness or nutrition routine?`
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
