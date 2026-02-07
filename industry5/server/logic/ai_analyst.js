const axios = require('axios');

const analyzeKPI = async (kpiName, kpiValue, fullBusinessData) => {

    // 1. Construct the Prompt
    // We feed the AI the WHOLE business context, but ask about ONE specific KPI.
    const prompt = `
    You are a Senior Business Analyst. 
    
    CONTEXT:
    The user runs a business in the "${fullBusinessData.industry_type}" industry.
    - Selling Price: $${fullBusinessData.selling_price}
    - Variable Cost: $${fullBusinessData.variable_cost_unit}
    - Fixed Costs: $${fullBusinessData.fixed_costs}
    - Units Sold: ${fullBusinessData.units_sold}
    
    CURRENT SITUATION:
    Their ${kpiName} is currently ${kpiValue}.
    
    TASK:
    Analyze why the ${kpiName} is at this level based on the context above. 
    Is this healthy for this specific industry? 
    Give 2 specific actionable tips to improve it.
    Keep the answer concise (under 100 words).
  `;

    try {
        // 2. Call Ollama
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "llama3:8b",
            prompt: prompt,
            stream: false
        });

        return response.data.response;
    } catch (error) {
        console.error("AI Error:", error.message);
        return "Error: Could not connect to local AI.";
    }
};

module.exports = { analyzeKPI };