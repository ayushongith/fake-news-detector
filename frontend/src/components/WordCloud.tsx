import { motion } from 'framer-motion';

interface WordCloudItem {
  text: string;
  value: number;
}

interface WordCloudProps {
  words: WordCloudItem[];
  maxWords?: number;
}

const colors = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#f97316', '#6366f1', '#14b8a6', '#e11d48',
];

export default function WordCloud({ words, maxWords = 60 }: WordCloudProps) {
  const sorted = [...(words || [])].sort((a, b) => b.value - a.value).slice(0, maxWords);
  const maxVal = sorted.length > 0 ? sorted[0].value : 1;

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-500 text-sm">
        No terms available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-wrap items-center justify-center gap-2 p-4"
    >
      {sorted.map((word, i) => {
        const ratio = word.value / maxVal;
        const fontSize = 10 + ratio * 28;
        const color = colors[i % colors.length];
        const opacity = 0.4 + ratio * 0.6;

        return (
          <motion.span
            key={word.text + i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity, scale: 1 }}
            transition={{ delay: i * 0.02, type: 'spring', stiffness: 100 }}
            style={{
              fontSize: `${fontSize}px`,
              color,
              opacity,
            }}
            className="cursor-default hover:opacity-100 transition-opacity duration-200 inline-block leading-tight"
            title={`${word.text}: ${word.value}`}
          >
            {word.text}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
