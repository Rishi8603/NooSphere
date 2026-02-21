import api from './api';

export const summarizePost = async ({ headline, text, tags, fileUrl }) => {
  const response = await api.post('/ai/summarize', { headline, text, tags, fileUrl });
  return response.data.summary;
};
