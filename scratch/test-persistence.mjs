import fs from 'fs'

// Read the actual React context files to confirm the exact structure I wrote
const userContext = fs.readFileSync('C:/Users/LENOVO/5gpro/Apexnova/fitcompanion/lib/context/UserContext.tsx', 'utf-8')
console.log("USER CONTEXT logWeight implementation:")
const logWeightMatch = userContext.match(/const logWeight = React\.useCallback\([\s\S]*?toast\.success/m)
console.log(logWeightMatch ? logWeightMatch[0] : 'Not found')

const nutritionContext = fs.readFileSync('C:/Users/LENOVO/5gpro/Apexnova/fitcompanion/lib/context/NutritionContext.tsx', 'utf-8')
console.log("\nNUTRITION CONTEXT addSteps implementation:")
const addStepsMatch = nutritionContext.match(/const addSteps = React\.useCallback\([\s\S]*?}, \[saveToHistory\]\)/m)
console.log(addStepsMatch ? addStepsMatch[0] : 'Not found')
