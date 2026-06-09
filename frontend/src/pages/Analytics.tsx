import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Target,
  Activity,
  PieChart,
  LineChart,
  Hash,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  getMetrics,
  getModelInfo,
  getTrends,
  getDistribution,
  getCommonTerms,
  Metrics,
  ModelInfo,
  TrendPoint,
  DistributionItem,
  CommonTerm,
} from '@/services/api';
import WordCloud from '@/components/WordCloud';
import LoadingSpinner from '@/components/LoadingSpinner';

const statCards = [
  { key: 'accuracy', label: 'Accuracy', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'precision', label: 'Precision', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { key: 'recall', label: 'Recall', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { key: 'f1_score', label: 'F1 Score', icon: Layers, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
];

const PIE_COLORS = ['#22c55e', '#ef4444'];

export default function Analytics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [distribution, setDistribution] = useState<DistributionItem[]>([]);
  const [commonTerms, setCommonTerms] = useState<CommonTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [m, mi, t, d, ct] = await Promise.all([
          getMetrics(),
          getModelInfo(),
          getTrends(),
          getDistribution(),
          getCommonTerms(),
        ]);
        setMetrics(m);
        setModelInfo(mi);
        setTrends(t);
        setDistribution(d);
        setCommonTerms(ct);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size={50} />
      </div>
    );
  }

  const mockConfusionMatrix = metrics?.confusion_matrix || [
    [85, 15],
    [10, 90],
  ];

  const confusionData = [
    { name: 'True Real', value: mockConfusionMatrix[0][0], row: 0, col: 0 },
    { name: 'False Fake', value: mockConfusionMatrix[0][1], row: 0, col: 1 },
    { name: 'False Real', value: mockConfusionMatrix[1][0], row: 1, col: 0 },
    { name: 'True Fake', value: mockConfusionMatrix[1][1], row: 1, col: 1 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary-500" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Model performance metrics and prediction insights
          </p>
        </motion.div>

        {modelInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4 text-sm"
          >
            <span className="text-gray-500 dark:text-gray-400">Model:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{modelInfo.model_name}</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500 dark:text-gray-400">Version:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{modelInfo.version}</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500 dark:text-gray-400">Features:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {modelInfo.features.toLocaleString()} n-grams
            </span>
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, i) => {
            const value = metrics ? metrics[card.key as keyof Metrics] as number : 0;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${card.bg}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {(value * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-500" />
              Confusion Matrix
            </h3>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {confusionData.map((item) => (
                <div
                  key={item.name}
                  className={`p-4 rounded-xl text-center ${
                    (item.row === 0 && item.col === 0) || (item.row === 1 && item.col === 1)
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'
                  }`}
                >
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.name}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Class Distribution
            </h3>
            {distribution.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {distribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <PieChart className="w-8 h-8 mr-2" />
                No data available
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-500" />
              Prediction Trends
            </h3>
            {trends.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="real_count" stroke="#22c55e" name="Real" strokeWidth={2} />
                    <Line type="monotone" dataKey="fake_count" stroke="#ef4444" name="Fake" strokeWidth={2} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <LineChart className="w-8 h-8 mr-2" />
                No trend data available
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              ROC AUC
            </h3>
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold gradient-text mb-2">
                {metrics ? ((metrics.roc_auc || 0) * 100).toFixed(1) : 'N/A'}%
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">ROC AUC Score</p>
              <div className="mt-4 w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((metrics?.roc_auc || 0) * 100)}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-2.5 rounded-full gradient-bg"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary-500" />
            Most Common Terms
          </h3>
          {commonTerms.length > 0 ? (
            <WordCloud words={commonTerms} />
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 dark:text-gray-500">
              No term data available
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Model Performance Summary
          </h3>
          {metrics ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Accuracy', value: metrics.accuracy },
                    { name: 'Precision', value: metrics.precision },
                    { name: 'Recall', value: metrics.recall },
                    { name: 'F1 Score', value: metrics.f1_score },
                  ]}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {[metrics.accuracy, metrics.precision, metrics.recall, metrics.f1_score].map(function(v, i) {
                      var fill = v >= 0.9 ? '#22c55e' : v >= 0.8 ? '#3b82f6' : v >= 0.7 ? '#f59e0b' : '#ef4444';
                      return <Cell key={i} fill={fill} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
              No metrics available
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
