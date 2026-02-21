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
        Authorization: `Bearer ${apiKey}`,
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
  `You are a helpful study assistant. Summarize the following study material post in 3-5 concise bullet points. Focus on the key concepts and takeaways a student should remember.\n\nPost Title: ${headline}\n${tagsLine}Post Content:\n${text}`;

const summarizePost = async (req, res) => {
  try {
    const { headline, text, tags, fileUrl } = req.body;

    if (!headline || !text) {
      return res.status(400).json({ error: 'headline and text are required' });
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
          return res.json({ summary });
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
    res.json({ summary });

  } catch (error) {
    const detail = error?.response?.data ? JSON.stringify(error.response.data) : error.message;
    console.error('AI summarize error:', detail);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

module.exports = { summarizePost };