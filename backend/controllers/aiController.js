const axios = require('axios');
const pdfParse = require('pdf-parse');

const GROQ_MODEL = 'llama-3.3-70b-versatile'; 

const generateWithGroq = async (messages, model = GROQ_MODEL) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is missing from .env');

  const { data } = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model, messages, max_tokens: 600 },
    {
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Groq returned an empty response');
  return text;
};

const getFileType = (url) => {
  const cleanUrl = url.split('?')[0].toLowerCase();
  const ext = cleanUrl.split('.').pop();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (cleanUrl.includes('/image/upload/')) return 'image';
  if (cleanUrl.includes('/raw/upload/')) return 'other';
  return 'other';
};

const buildBasePrompt = (headline, text, tagsLine) =>
  `You are an expert study assistant. Your task is to summarize the following study material post.

CRITICAL INSTRUCTIONS:
1. If the post content is extremely short, gibberish, clearly for testing purposes (e.g., "test", "asdf", "hello"), or lacks any substantive educational content, do NOT attempt to summarize it. Instead, reply EXACTLY with: "This appears to be a test post or lacks enough substantive content to generate a meaningful summary."
2. If a PDF/image was provided but the extracted text says "[Could not extract PDF text]" or similar, state that you could not read the attachment, and only summarize the text provided.
3. If there is valid content, summarize it in 3-5 concise bullet points, focusing on key concepts.

Post Title: ${headline}
${tagsLine}Post Content:
${text}`;

const generateSummaryForPost = async ({ headline, text, tags, fileUrl }) => {
  if (!headline || !text) {
    throw new Error('headline and text are required');
  }

  const tagsLine = tags?.length > 0 ? `Tags: ${tags.join(', ')}\n` : '';
  const basePrompt = buildBasePrompt(headline, text, tagsLine);
  let userMessage = basePrompt;

  if (fileUrl) {
    const fileType = getFileType(fileUrl);

    if (fileType === 'image') {
      // Groq vision model
      const messages = [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: fileUrl } },
            {
              type: 'text',
              text: basePrompt +
                '\n\nAn image is attached above. Incorporate relevant content from the image into your bullet-point summary. If the image is unrelated to the post text, briefly describe what it shows.' +
                '\n\nProvide the summary as bullet points starting with •',
            },
          ],
        },
      ];

      try {
        const summary = await generateWithGroq(messages, 'llama-3.2-11b-vision-preview');
        return summary;
      } catch {
        // Fall back to text-only if vision fails
        userMessage = basePrompt +
          '\n\n(An image was attached but could not be processed.)' +
          '\n\nProvide the summary as bullet points starting with •';
      }

    } else if (fileType === 'pdf') {
      let pdfText = '';
      try {
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer', timeout: 20000 });
        const parsed = await pdfParse(Buffer.from(response.data));
        pdfText = parsed.text.replace(/\s+/g, ' ').trim().slice(0, 4000);
      } catch {
        pdfText = '[Could not extract PDF text]';
      }

      userMessage = basePrompt +
        `\n\nAttached PDF content:\n${pdfText}\n\n` +
        'Incorporate key points from the PDF. If the PDF is unrelated to the post text, briefly mention what it is.' +
        '\n\nProvide the summary as bullet points starting with •';

    } else {
      const fileName = fileUrl.split('/').pop().split('?')[0] || 'attached file';
      userMessage = basePrompt +
        `\n\nAn additional file is attached: "${fileName}" (content could not be extracted). Mention it if relevant.` +
        '\n\nProvide the summary as bullet points starting with •';
    }
  } else {
    userMessage = basePrompt + '\n\nProvide the summary as bullet points starting with •';
  }

  const summary = await generateWithGroq([{ role: 'user', content: userMessage }]);
  return summary;
};

const summarizePost = async (req, res) => {
  try {
    const { headline, text, tags, fileUrl } = req.body;
    const summary = await generateSummaryForPost({ headline, text, tags, fileUrl });
    res.json({ summary });

  } catch (error) {
    const detail = error?.response?.data ? JSON.stringify(error.response.data) : error.message;
    console.error('AI summarize error:', detail);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

const rankPostsWithGroq = async (postsArray, interests) => {
  if (!postsArray || postsArray.length === 0) return [];

  const prompt = `You are a strict feed-ranking API for an academic study platform.
The user is specifically focusing on these subjects/interests: "${interests}".

Your ONLY job is to rank the following posts from most relevant to least relevant to the user's interests.
You must return your answer strictly as a JSON array of post IDs strings. Do NOT include markdown code blocks, do NOT add explanations.
Example output: ["id1", "id2", "id3"]

Posts:
${JSON.stringify(postsArray, null, 2)}`;

  try {
    const response = await generateWithGroq([{ role: 'user', content: prompt }]);
    const cleaned = response.replace(/```json/gi, '').replace(/```/g, '').trim();
    const rankedIds = JSON.parse(cleaned);
    
    if (Array.isArray(rankedIds)) {
      return rankedIds;
    }
    return [];
  } catch (err) {
    console.error("AI Ranking Error:", err.message);
    return [];
  }
};

module.exports = { summarizePost, generateSummaryForPost, rankPostsWithGroq };