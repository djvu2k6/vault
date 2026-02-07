const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sequelize = require('./config/database');
const Financials = require('./models/Financials');

const app = express();
const PORT = 5000;

// --- 1. MIDDLEWARE ---
app.use(cors({ origin: '*' }));
app.use(express.json());

// --- 2. MATH LOGIC ---
const calculateFinancials = (inputs) => {
  const selling_price = parseFloat(inputs.selling_price) || 0;
  const variable_cost_unit = parseFloat(inputs.variable_cost_unit) || 0;
  const units_sold = parseInt(inputs.units_sold) || 0;
  const fixed_costs = parseFloat(inputs.fixed_costs) || 0;

  const revenue = selling_price * units_sold;
  const cm1_margin = selling_price - variable_cost_unit;
  const cm1_total = cm1_margin * units_sold;
  const cm2_margin = cm1_total - fixed_costs;

  return { revenue, cm1_margin, cm1_total, cm2_margin };
};

// --- 3. ROUTES ---

// ROUTE A: GET ALL DATA
app.get('/api/all', async (req, res) => {
  try {
    const allData = await Financials.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: allData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE B: GET LATEST
app.get('/api/latest', async (req, res) => {
  try {
    const latestData = await Financials.findOne({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: latestData });
  } catch (error) {
    res.status(500).json({ error: "DB Error" });
  }
});

// ROUTE C: COMPUTE & SAVE
app.post('/api/compute', async (req, res) => {
  console.log("🔵 Compute Request:", req.body);
  try {
    const inputs = req.body;
    const results = calculateFinancials(inputs); // Do Math

    // Save to DB (Create New Record)
    const savedRecord = await Financials.create({ ...inputs, ...results });
    console.log("💾 Saved to DB");

    res.json({ success: true, data: savedRecord });
  } catch (error) {
    console.error("❌ Save Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ROUTE D: DELETE
app.delete('/api/delete/:id', async (req, res) => {
  try {
    await Financials.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: "Delete failed" }); }
});

// ROUTE E: UPDATE
app.put('/api/update/:id', async (req, res) => {
  try {
    const inputs = req.body;
    const results = calculateFinancials(inputs);
    await Financials.update({ ...inputs, ...results }, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: "Update failed" }); }
});

// --- ROUTE F: CONTEXT-AWARE CHAT (The Brain 🧠) ---
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // 1. FETCH HISTORY: Get the last 5 records from DB
    const history = await Financials.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      // We select only important fields to keep the AI focused
      attributes: ['id', 'selling_price', 'variable_cost_unit', 'units_sold', 'revenue', 'cm2_margin', 'createdAt']
    });

    // 2. FORMAT AS JSON STRING
    // We reverse it so it looks like: [Oldest, ..., Newest]
    const historyJSON = JSON.stringify(history.reverse(), null, 2);

    // 3. CONSTRUCT THE SUPER-PROMPT
    const systemPrompt = `
      You are an expert Industry 5.0 Business Analyst.
      
      BELOW IS THE DATABASE HISTORY (Last 5 Simulation Runs):
      ${historyJSON}
      
      INSTRUCTIONS:
      - The user is asking: "${message}"
      - Use the JSON data above to answer.
      - If the user asks for comparisons (e.g., "is it better?"), compare the latest record (last in list) vs the previous ones.
      - 'cm2_margin' is the Net Profit.
      - Keep answers concise and professional.
    `;

    console.log("🧠 Sending Context to Llama 3...");

    // 4. SEND TO OLLAMA
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "llama3:8b",
      prompt: systemPrompt,
      stream: false
    });

    res.json({ reply: response.data.response });

  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({ error: "AI Error" });
  }
});

// ROUTE G: KPI ANALYZER
app.post('/api/analyze', async (req, res) => {
  try {
    const { kpi_name, kpi_value, business_data } = req.body;
    const prompt = `Analyze KPI: ${kpi_name} = ${kpi_value}. Context: ${JSON.stringify(business_data)}. Give 1 strategic tip.`;
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "llama3:8b", prompt, stream: false
    });
    res.json({ success: true, analysis: response.data.response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 4. START SERVER ---
sequelize.sync({ force: false }).then(() => {
  console.log('✅ INTELLIGENT BACKEND READY on Port 5000');
  app.listen(PORT);
});