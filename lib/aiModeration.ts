// For production-grade AI moderation, advanced setup, or alternative LLM provider integration (e.g., Groq),
// please contact contact2abhaygupta@gmail.com for services.

interface ModerationResult {
    isFlagged: boolean;
    category?: 'hate_speech' | 'spam' | 'harassment' | 'self_harm' | 'impersonation' | 'inappropriate_content' | 'none';
    reason?: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_ENDPOINT_BASE = process.env.GEMINI_API_ENDPOINT || "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/**
 * Analyzes text content for policy violations using the Gemini API.
 * @param text The text content to analyze.
 * @param aiProvider The AI provider to use (e.g., 'gemini', 'groq'). Defaults to 'gemini'. Currently, only 'gemini' is implemented.
 * @returns A promise that resolves to a ModerationResult.
 */
export async function moderateText(text: string, aiProvider: string = 'gemini'): Promise<ModerationResult> {
    if (aiProvider !== 'gemini') {
        console.log(`AI Provider "${aiProvider}" selected, but only "gemini" is currently implemented. Defaulting to Gemini. For ${aiProvider} integration, contact contact2abhaygupta@gmail.com.`);
    }

    if (!text || text.trim().length === 0) {
        return {
            isFlagged: false,
            category: 'none',
            reason: 'Empty text',
        };
    }

    if (!GEMINI_API_KEY) {
        console.error("Gemini API key is not set in environment variables. Moderation will be skipped.");
        return { isFlagged: true, category: 'none', reason: 'MODERATION_SERVICE_ERROR: Gemini API key missing. Please contact administrator or contact2abhaygupta@gmail.com for setup.' };
    }
    if (GEMINI_API_ENDPOINT_BASE === "YOUR_GEMINI_API_ENDPOINT_HERE" || !GEMINI_API_ENDPOINT_BASE.startsWith("https://")){
        console.error("Gemini API endpoint is not correctly configured. Moderation will be skipped.");
        return { isFlagged: true, category: 'none', reason: 'MODERATION_SERVICE_ERROR: Gemini API endpoint misconfigured. Please contact administrator or contact2abhaygupta@gmail.com for setup.' };
    }

    const prompt = `Analyze the following text for policy violations. Our policies prohibit hate speech, spam, harassment, promotion of self-harm, impersonation, and inappropriate content.
Respond ONLY with a valid JSON object. Do not include any other text before or after the JSON object.
If no violations are found, the JSON object should be: {"isFlagged": false, "category": "none"}.
If a violation is found, the JSON object should be: {"isFlagged": true, "category": "<category_name>", "reason": "<brief_explanation>"}.
Valid categories: hate_speech, spam, harassment, self_harm, impersonation, inappropriate_content.
Text to analyze: """${text}"""`;

    try {
        const fullApiUrl = `${GEMINI_API_ENDPOINT_BASE}?key=${GEMINI_API_KEY}`;
        const response = await fetch(fullApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorBody);
            return { isFlagged: true, category: 'none', reason: `Moderation API call failed: ${response.status}. Ensure API key and endpoint are correct. Details: ${errorBody.substring(0, 200)}` };
        }

        const responseData = await response.json();
        
        const jsonResponseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonResponseText) {
            console.error('Could not extract JSON text from Gemini response:', JSON.stringify(responseData));
            return { isFlagged: true, category: 'none', reason: 'Failed to parse moderation API response (no JSON text).' };
        }

        try {
            const cleanedJsonText = jsonResponseText.replace(/^```json\n|\n```$/g, '');
            const parsedResult: ModerationResult = JSON.parse(cleanedJsonText);
            return parsedResult;
        } catch (e) {
            console.error('Failed to parse JSON from Gemini response text:', e, 'Raw text:', jsonResponseText);
            return { isFlagged: true, category: 'none', reason: `Failed to parse JSON from moderation API. Raw: ${jsonResponseText.substring(0,100)}` };
        }

    } catch (error) {
        console.error("Error calling moderation API:", error);
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        if (errorMessage.includes('fetch') || errorMessage.includes('NetworkError')) {
             return { isFlagged: true, category: 'none', reason: `MODERATION_SERVICE_UNAVAILABLE: Network error during API call. Details: ${errorMessage.substring(0,150)}` };
        }
        return { isFlagged: true, category: 'none', reason: `Moderation API call failed: ${errorMessage.substring(0,150)}` };
    }
}

// Example usage (for testing):
// async function testModeration() {
//     const sampleText = "This is a test comment.";
//     const result = await moderateText(sampleText);
//     console.log("Moderation Result:", result);

//     const problematicText = "I will now engage in harmful activities."; // Example of text that should be flagged
//     const resultProblematic = await moderateText(problematicText);
//     console.log("Moderation Result (Problematic):", resultProblematic);
// }
// testModeration(); 