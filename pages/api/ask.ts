import type { NextApiRequest, NextApiResponse } from 'next';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

if (!OPENAI_API_KEY || !SERPAPI_API_KEY) {
  throw new Error('API keys are missing in environment variables.');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    // 1. Fetch search results from SerpAPI
    const serpRes = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERPAPI_API_KEY}`);
    const serpData = await serpRes.json();
    interface OrganicResult {
      title: string;
      snippet: string;
      link: string;
    }
    const organicResults: OrganicResult[] = (serpData.organic_results?.slice(0, 12) || []).map((r: unknown) => {
      const result = r as Partial<OrganicResult>;
      return {
        title: result.title || '',
        snippet: result.snippet || '',
        link: result.link || '',
      };
    });

    // 1b. Get up to 12 image URLs from SerpAPI Google Images API
    let images: string[] = [];
    try {
      const imagesRes = await fetch(`https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${SERPAPI_API_KEY}`);
      const imagesData = await imagesRes.json();
      if (Array.isArray(imagesData.images_results)) {
        images = imagesData.images_results.slice(0, 12).map((img: unknown) => {
          const imageObj = img as { thumbnail?: string; original?: string; image?: string };
          return imageObj.thumbnail || imageObj.original || imageObj.image || '';
        });
        images = images.filter(Boolean);
      }
    } catch {
      // Ignore image fetch errors, fallback below
    }
    // Fallback: use images_results from main search if images API returns nothing
    if (images.length === 0 && Array.isArray(serpData.images_results)) {
      images = serpData.images_results.slice(0, 12).map((img: unknown) => {
        const imageObj = img as { thumbnail?: string; original?: string; image?: string };
        return imageObj.thumbnail || imageObj.original || imageObj.image || '';
      });
      images = images.filter(Boolean);
    }

    // 2. Prepare context for OpenAI
    const context = organicResults.map((r, i) => `Source [${i+1}]: ${r.title} - ${r.snippet} (${r.link})`).join('\n');
    const prompt = `Answer the following question using the sources below. Be detailed and comprehensive, and provide a multi-paragraph answer. Cite sources as [number] in your answer.\n\nQuestion: ${query}\n\nSources:\n${context}\n\nAnswer:`;

    // 3. Call OpenAI API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.2,
      }),
    });
    const openaiData = await openaiRes.json();
    const aiAnswer = openaiData.choices?.[0]?.message?.content || 'No answer generated.';

    res.status(200).json({ answer: aiAnswer, sources: organicResults, images });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}