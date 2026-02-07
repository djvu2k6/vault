const express = require('express');
const router = express.Router();
const Financials = require('../models/Financials');
const { calculateFinancials } = require('../logic/formulas');
const { analyzeKPI } = require('../logic/ai_analyst');
const axios = require('axios'); // Needed for the chat route

// ROUTE 1: COMPUTE (The Math)
// server/routes/analytics.js

// ... keep imports at the top ...

// ROUTE 1: COMPUTE (Math Only - DB Bypassed)
router.post('/compute', async (req, res) => {
    try {
        console.log("🟢 1. Request Received from React!"); // This will show in your terminal
        const inputs = req.body;

        // 1. Run Math Logic
        const results = calculateFinancials(inputs);
        console.log("🟢 2. Math Calculated:", results.revenue);

        // 2. SKIP DATABASE FOR NOW (To stop the crash)
        /* const savedRecord = await Financials.create({
          ...inputs,
          ...results
        });
        */

        // 3. Send results back directly
        console.log("🟢 3. Sending Data back to React");
        res.json({
            success: true,
            data: { ...inputs, ...results } // Send combined data back
        });

    } catch (error) {
        console.error("❌ CRASH:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ... keep the analyze and chat routes same ...
// ROUTE 2: AI ANALYST (Specific KPI Analysis)
router.post('/analyze', async (req, res) => {
    try {
        const { kpi_name, kpi_value, business_data } = req.body;
        const analysis = await analyzeKPI(kpi_name, kpi_value, business_data);
        res.json({ success: true, analysis: analysis });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ROUTE 3: GENERAL CHAT (For the Blue Button Widget)
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        // Connect to Local Ollama
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "llama3:8b",
            prompt: `You are a helpful business assistant. User says: "${message}". Reply concisely.`,
            stream: false
        });
        res.json({ reply: response.data.response });
    } catch (error) {
        console.error("Chat Error:", error.message);
        res.status(500).json({ error: "Is Ollama running?" });
    }
});

module.exports = router;