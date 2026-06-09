import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
  suspicious_words: string[];
}

export default function ResultCard({ prediction, confidence, probabilities, suspicious_words }: ResultCardProps) {
  const isReal = prediction?.toLowerCase() === 'real';
  const confidencePct = (confidence * 100).toFixed(1);

  const probData = Object.entries(probabilities || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: +(value * 100).toFixed(1),
    fill: name.toLowerCase() === 'real' ? '#22c55e' : '#ef4444',
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8"
              className="text-gray-200 dark:text-gray-700" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke={isReal ? '#22c55e' : '#ef4444'} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - confidence) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{confidencePct}%</span>
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
              isReal
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {isReal ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {isReal ? 'Real News' : 'Fake News'}
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">
            Analysis complete with {confidencePct}% confidence
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Probability Distribution</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={probData} layout="vertical" barSize={24}>
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" width={60} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {suspicious_words && suspicious_words.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Key Indicators
          </h4>
          <div className="flex flex-wrap gap-2">
            {suspicious_words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
