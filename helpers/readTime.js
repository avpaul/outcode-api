const countWords = (text) => {
  const reg = new RegExp(/(\w{1})+/, 'g');
  return (text.match(reg) || []).length;
};

const calculateReadTime = (text) => {
  const wordsPerMinute = 230;
  const wordCount = countWords(text);
  return Math.round(wordCount / wordsPerMinute);
};

export default calculateReadTime;
