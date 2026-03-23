'use strict';

require('dotenv').config();
require('@babel/register');

const groqFetch = require('../js/server/schema/mutations/fns/groqFetch').default;

const title = 'The Matrix';
const ragContext = `The Matrix is a 1999 science fiction action film written and directed by the Wachowskis. It is the first installment in The Matrix film series, starring Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano. It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, which intelligent machines have created to distract humans while using their bodies as an energy source. When computer programmer Thomas Anderson, under the hacker alias "Neo", uncovers the truth, he is drawn into a rebellion against the machines along with other people who have been freed from the Matrix.`;

const prompt = `You are a cynical movie critic who hates everything and finds every plot point ridiculous. For the movie "${title}", provide the main cast and a devastatingly funny roast of the plot.

Here are some absurd plot points and critical feedback from Wikipedia to use as fodder for your roast:
---
${ragContext}
---

Style Guide for your Roast:
1. Be brutally honest about how silly the premise is.
2. Use creative, unexpected metaphors involving mundane, annoying modern life frustrations (e.g. bureaucracy, bad tech, awkward social situations).
3. Frame character motivations as incredibly poor life choices or professional incompetence.
4. Treat epic tropes (like "the prophecy" or "the mission") as if they are low-stakes office politics or retail shift drama.
5. Use deadpan sarcasm and dry humor.
6. VARIETY MANDATE: Never repeat the same joke or metaphor across different movies. Each roast must be uniquely tailored to the specific context provided.

MANDATORY ROLE TAGGING:
- You MUST identify exactly ONE "hero", exactly ONE "heroine", and exactly ONE "villain".
- The "hero" must be the primary male protagonist.
- The "heroine" must be the primary female lead.
- The "villain" must be the primary antagonist.
- In the JSON "sentences" array, the object representing their name MUST have the "role" property set to "hero", "heroine", or "villain".
- All other characters mentioned MUST have the "role": "other".

Return JSON:
{
  "cast": [
    { "actor": "Leonardo DiCaprio", "character": "Dom Cobb" }
  ],
  "sentences": [
    [{"text": "CharacterName", "role": "hero"}, {"text": " makes a series of questionable life choices."}]
  ]
}

Cast rules:
- Include the main cast members (up to 15)
- "actor" is the real actor's full name
- "character" is the character's full name
- Order by billing/importance

Token rules:
- Each sentence is an array of tokens (objects with "text" and optionally "role")
- Character name tokens MUST have "role": exactly one of "hero", "heroine", "villain", or "other"
- CRITICAL CONSTRAINT — role uniqueness:
  * Pick exactly ONE character as "hero" (the main male protagonist)
  * Pick exactly ONE character as "heroine" (the main female lead)
  * Pick exactly ONE character as "villain" (the main antagonist)
  * Every single other character MUST use "other" — no exceptions
- Non-character tokens only have "text" and MUST include leading/trailing spaces for proper spacing

Sentence rules:
- Exactly 5 sentences, chronological order
- Max 75 characters per sentence
- Every sentence must mention at least one character by name
- Be cynical, sarcastic, and genuinely funny
- Never apologize for the movie; just roast it based on the facts provided in the context.`;

const run = async () => {
  console.log(`=== Testing Groq Direct for "${title}" ===`);
  console.log('Sending request to Groq...');
  
  const start = Date.now();
  try {
    const result = await groqFetch(prompt);
    const duration = (Date.now() - start) / 1000;
    
    if (result) {
      console.log(`\nSUCCESS (${duration}s):`);
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`\nFAILED (${duration}s): Received null result.`);
    }
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    console.error(`\nCRASHED (${duration}s):`, error.message);
  }
};

run();
