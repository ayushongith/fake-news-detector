import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Zap,
  AlertCircle,
  Clock,
  History,
  Shield,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { predictArticle, uploadFile, getHistory, PredictionResult, HistoryItem } from '@/services/api';
import ResultCard from '@/components/ResultCard';
import ShapChart from '@/components/ShapChart';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch {
      // silently fail
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handlePredict = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error('Please enter a news article to analyze');
      return;
    }
    if (trimmed.length < 20) {
      toast.error('Please enter at least 20 characters');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await predictArticle(trimmed);
      setResult(data);
      loadHistory();
      toast.success('Analysis complete!');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Analysis failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      toast.error('Please upload a .txt file');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await uploadFile(file);
      setResult(data);
      loadHistory();
      toast.success('File analyzed successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'File analysis failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex p-3 rounded-2xl gradient-bg mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Fake News <span className="gradient-text">Detector</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Paste a news article or upload a text file to instantly analyze its authenticity using advanced machine learning.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                News Article Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the news article content here..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <p className="text-xs text-gray-400 mt-2">{text.length} characters</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`glass-card p-6 border-2 border-dashed transition-colors ${
                dragOver
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <div className="text-center cursor-pointer">
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {dragOver ? 'Drop your file here' : 'Drag & drop a .txt file, or click to browse'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Supports .txt files only</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <button
                onClick={handlePredict}
                disabled={loading || !text.trim()}
                className="w-full py-4 rounded-xl gradient-bg text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze Article
                  </>
                )}
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-12 flex flex-col items-center justify-center"
                >
                  <LoadingSpinner size={60} className="mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Analyzing article...</p>
                </motion.div>
              )}

              {!loading && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ResultCard
                    prediction={result.prediction}
                    confidence={result.confidence}
                    probabilities={result.probability_distribution}
                    suspicious_words={result.suspicious_words}
                  />
                  <ShapChart shap_values={result.shap_values || []} />
                </motion.div>
              )}

              {!loading && !result && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-8 flex flex-col items-center justify-center text-center h-full"
                >
                  <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter a news article or upload a file to see results here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <History className="w-5 h-5 text-primary-500" />
              Prediction History
            </h2>
          </div>
          <div className="overflow-x-auto">
            {historyLoading ? (
              <div className="p-8 flex justify-center">
                <LoadingSpinner size={30} />
              </div>
            ) : history.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No predictions yet. Analyze your first article!</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-6 py-4 font-medium text-gray-600 dark:text-gray-400">Text</th>
                    <th className="text-left px-6 py-4 font-medium text-gray-600 dark:text-gray-400">Prediction</th>
                    <th className="text-left px-6 py-4 font-medium text-gray-600 dark:text-gray-400">Confidence</th>
                    <th className="text-left px-6 py-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 max-w-xs truncate text-gray-700 dark:text-gray-300">
                        {item.article_text}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.prediction?.toLowerCase() === 'real'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {item.prediction?.toLowerCase() === 'real' ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {item.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {(item.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
