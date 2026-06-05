import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { answers } = req.body;

  const prompt = `You are a world-class personal stylist with expertise in fashion, hair, and personal branding.

A client completed a style quiz:
- Desired vibe: ${answers.vibe}
- Body type: ${answers.body}
- Budget per item: ${answers.budget}
- Things they want to avoid: ${answers.avoid}
- Hair situation: ${answers.hair}

Give them a personalized style guide with these sections:
1. STYLE IDENTITY: A 2-3 word archetype name + 2 sentences about their aesthetic
2. OUTFIT FORMULA: Their go-to outfit blueprint with specific items and colors
3. KEY PIECES: 5 wardrobe essentials tailored to them
4. COLOR PALETTE: 4-5 signature colors with reasons
5. HAIR DIRECTION: Specific haircut/style recommendations
6. GOLDEN RULE: One style rule they must always follow

Be specific, confident, and inspiring.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({ result: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
