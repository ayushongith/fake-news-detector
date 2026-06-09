import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ShapValue {
  word: string;
  shap_value: number;
}

interface ShapChartProps {
  shap_values: ShapValue[];
}

export default function ShapChart({ shap_values }: ShapChartProps) {
  const entries = (shap_values || [])
    .map((s) => ({ text: s.word, value: s.shap_value }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 15);

  if (entries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Feature Impact (SHAP Values)
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={entries} layout="vertical" barSize={20} margin={{ left: 20, right: 20 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="text" width={120} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number) => [v.toFixed(4), 'SHAP Value']}
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {entries.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.value >= 0 ? '#3b82f6' : '#ef4444'}
                  fillOpacity={Math.min(Math.abs(entry.value) * 5, 1)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Blue bars indicate positive impact (real), red bars indicate negative impact (fake)
      </p>
    </motion.div>
  );
}
