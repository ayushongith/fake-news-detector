import { motion } from 'framer-motion';
import {
  Shield,
  Brain,
  GitBranch,
  Database,
  Server,
  Code2,
  Github,
  ArrowRight,
  FileSearch,
  BarChart3,
  Zap,
  CheckCircle2,
  Target,
} from 'lucide-react';

const steps = [
  {
    icon: FileSearch,
    title: 'Input Text',
    description: 'Paste a news article or upload a .txt file for analysis.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Brain,
    title: 'ML Processing',
    description: 'Our model analyzes the text using advanced NLP techniques and TF-IDF vectorization.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: BarChart3,
    title: 'Feature Analysis',
    description: 'SHAP values identify the most influential words and patterns in the article.',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Zap,
    title: 'Instant Result',
    description: 'Get a prediction with confidence score and detailed explanation within seconds.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
];

const techStack = [
  { name: 'React 18', icon: Code2, desc: 'Frontend framework' },
  { name: 'TypeScript', icon: Code2, desc: 'Type-safe code' },
  { name: 'FastAPI', icon: Server, desc: 'Backend API' },
  { name: 'scikit-learn', icon: Brain, desc: 'ML pipeline' },
  { name: 'Tailwind CSS', icon: Code2, desc: 'Styling' },
  { name: 'PostgreSQL', icon: Database, desc: 'Database' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex p-3 rounded-2xl gradient-bg mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About <span className="gradient-text">Fake News Detector</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            An advanced machine learning system designed to help identify and combat misinformation
            by analyzing news articles with state-of-the-art NLP techniques.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary-500" />
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              In an era where misinformation spreads faster than ever, our mission is to provide
              journalists, researchers, and the general public with a powerful tool to verify the
              authenticity of news articles. By leveraging machine learning and natural language
              processing, we aim to promote media literacy and critical thinking in the digital age.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-accent-500" />
              Architecture
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              The system uses a multi-layered approach combining TF-IDF vectorization, logistic
              regression classification, and SHAP explainability to provide transparent and
              interpretable predictions.
            </p>
            <div className="flex flex-wrap gap-2">
              {['TF-IDF', 'Logistic Regression', 'SHAP', 'NLP Pipeline', 'REST API', 'JWT Auth'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="glass-card p-6 text-center relative"
              >
                <div className={`inline-flex p-3 rounded-xl ${step.bg} mb-4`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div className="absolute top-6 right-6 text-gray-300 dark:text-gray-600 text-sm font-bold">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary-500" />
              Technology Stack
            </h2>
            <div className="space-y-4">
              {techStack.map((tech) => (
                <div key={tech.name} className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <tech.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{tech.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Key Features
            </h2>
            <ul className="space-y-4">
              {[
                'Real-time news article analysis',
                'Confidence scoring with visual indicators',
                'Explainable AI with SHAP value visualization',
                'Drag-and-drop file upload support',
                'Prediction history tracking',
                'Comprehensive analytics dashboard',
                'Dark mode support',
                'Responsive mobile-first design',
              ].map((feat, i) => (
                <motion.li
                  key={feat}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feat}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 text-center"
        >
          <Github className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Open Source Project
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            This project is open source. Contributions, issues, and feature requests are welcome!
          </p>
          <motion.a
            whileHover={{ scale: 1.02 }}
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:shadow-lg transition-shadow"
          >
            View on GitHub
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
