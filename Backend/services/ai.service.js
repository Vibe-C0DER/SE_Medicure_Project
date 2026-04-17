import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API only if there's a key available (this will crash cleanly if not configured correctly).
// Actually better to have the service initialize dynamically inside the function, handling the lack of an API key gracefully.

export const extractSymptomsFromText = async (text) => {
  try {
    if (!text || text.trim() === '') {
      throw new Error('Text input cannot be empty');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('AI service unavailable: GEMINI_API_KEY is missing');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Fast and suitable for json extraction

    const prompt = `You are a medical assistant.

Extract symptoms from the given text.
Return ONLY JSON in this format:
{
  "symptoms": []
}

Rules:
- Extract only symptoms
- Normalize terms (e.g., "high temperature" -> "fever")
- Return STRICT JSON, nothing else block wrap allowed if strict JSON. 

Text: ${text}`;

    // Generate content
    const result = await model.generateContent(prompt);
    let outputText = result.response.text();
    
    // Clean up in case Gemini wraps it with markdown codeblocks
    if (outputText.startsWith('\`\`\`json')) {
      outputText = outputText.slice(7);
      if (outputText.endsWith('\`\`\`')) {
        outputText = outputText.slice(0, -3);
      }
    } else if (outputText.startsWith('\`\`\`')) {
        outputText = outputText.slice(3);
        if (outputText.endsWith('\`\`\`')) {
          outputText = outputText.slice(0, -3);
        }
    }

    try {
      const parsed = JSON.parse(outputText.trim());
      // Validate that it returns an array
      if (!parsed || !Array.isArray(parsed.symptoms)) {
          throw new Error('Invalid schema from AI model');
      }
      return parsed.symptoms;
    } catch (parseError) {
      // Retry once for invalid JSON if needed? The task says:
      // "Invalid JSON from AI -> retry once, else error"
      // Let's implement retry logic using recursion.
      throw new Error('INVALID_JSON');
    }

  } catch (error) {
     if (error.message === 'INVALID_JSON') {
         // Recursive retry once
         try {
            return await retryExtraction(text);
         } catch (retryErr) {
            throw new Error('Invalid JSON from AI after retry');
         }
     }
     console.error('AI Service Error:', error);
     throw new Error(error.message || 'AI service unavailable');
  }
};

const retryExtraction = async (text) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    const prompt = `You are a medical assistant.

Extract symptoms from the given text.
Return ONLY JSON in this format:
{
  "symptoms": []
}

Please make absolutely sure to output raw JSON only! Do not use markdown backticks!

Rules:
- Extract only symptoms
- Normalize terms (e.g., "high temperature" -> "fever")
- Return STRICT JSON

Text: ${text}`;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text();
    
    if (outputText.startsWith('\`\`\`json')) {
      outputText = outputText.slice(7);
      if (outputText.endsWith('\`\`\`')) {
        outputText = outputText.slice(0, -3);
      }
    } else if (outputText.startsWith('\`\`\`')) {
        outputText = outputText.slice(3);
        if (outputText.endsWith('\`\`\`')) {
          outputText = outputText.slice(0, -3);
        }
    }
    
    const parsed = JSON.parse(outputText.trim());
    if (!parsed || !Array.isArray(parsed.symptoms)) {
        throw new Error('Invalid schema from AI model');
    }
    return parsed.symptoms;
};

export const generateDiseaseArticle = async (diseaseName) => {
  try {
    if (!diseaseName || diseaseName.trim() === '') {
      throw new Error('Disease name input cannot be empty');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('AI service unavailable: GEMINI_API_KEY is missing');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a professional medical writer.

Generate a comprehensive educational medical article for the disease: "${diseaseName}". 
Return ONLY JSON in this exact format:
{
  "title": "String (Title of the article, e.g., 'Understanding ${diseaseName}')",
  "description": "String (A short 1-3 sentence summary/overview)",
  "content": "String (The full detailed, comprehensive article body, formatted with markdown for readability)",
  "symptoms": "String (A detailed markdown list or paragraph of symptoms)",
  "riskFactors": "String (A detailed markdown list or paragraph of risk factors)",
  "prevention": "String (A detailed markdown list or paragraph covering prevention methods)",
  "category": "String (A broad medical category, e.g., 'Infectious Disease', 'Cardiovascular', 'Neurological')"
}

Rules:
- The disease may be common or rare. Base it on known medical literature.
- Ensure the tone is empathetic, professional, and educational.
- Do NOT provide diagnostic advice or treatment recommendations as a replacement for doctors; add a disclaimer if appropriate within the content.
- Use markdown tags (like ##, **, -) inside the "content", "symptoms", "riskFactors", and "prevention" text strings to ensure they render beautifully on a frontend. 
- Return STRICT JSON. Do NOT wrap it in any other text.`;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text();
    
    // Clean up in case Gemini wraps it with markdown codeblocks
    if (outputText.startsWith('\`\`\`json')) {
      outputText = outputText.slice(7);
      if (outputText.endsWith('\`\`\`')) {
        outputText = outputText.slice(0, -3);
      }
    } else if (outputText.startsWith('\`\`\`')) {
        outputText = outputText.slice(3);
        if (outputText.endsWith('\`\`\`')) {
          outputText = outputText.slice(0, -3);
        }
    }

    try {
      const parsed = JSON.parse(outputText.trim());
      if (!parsed.title || !parsed.content) {
          throw new Error('Invalid schema from AI model: Missing required fields');
      }
      return parsed;
    } catch (parseError) {
      throw new Error('INVALID_JSON');
    }

  } catch (error) {
     if (error.message === 'INVALID_JSON') {
         // Recursive retry once
         try {
            return await retryGenerateArticle(diseaseName);
         } catch (retryErr) {
            throw new Error('Invalid JSON from AI after retry');
         }
     }
     console.error('AI Service Error:', error);
     throw new Error(error.message || 'AI service unavailable');
  }
};

const retryGenerateArticle = async (diseaseName) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    const prompt = `You are a professional medical writer.

Generate a medical article for the disease: "${diseaseName}". 
Return ONLY JSON in this exact format:
{
  "title": "",
  "description": "",
  "content": "",
  "symptoms": "",
  "riskFactors": "",
  "prevention": "",
  "category": ""
}

Please make absolutely sure to output raw JSON only! Do not use markdown backticks!

Rules:
- Include comprehensive information.
- Return STRICT JSON ONLY.`;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text();
    
    if (outputText.startsWith('\`\`\`json')) {
      outputText = outputText.slice(7);
      if (outputText.endsWith('\`\`\`')) {
        outputText = outputText.slice(0, -3);
      }
    } else if (outputText.startsWith('\`\`\`')) {
        outputText = outputText.slice(3);
        if (outputText.endsWith('\`\`\`')) {
          outputText = outputText.slice(0, -3);
        }
    }
    
    const parsed = JSON.parse(outputText.trim());
    if (!parsed.title || !parsed.content) {
        throw new Error('Invalid schema from AI model');
    }
    return parsed;
};
