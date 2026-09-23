import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  CheckCircle2, 
  Award, 
  FileText, 
  Cpu, 
  TrendingUp, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Sparkles,
  Database,
  ExternalLink,
  Activity,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  Download
} from 'lucide-react';

export const Expt10DossierModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('assignment');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/70 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-white/60 dark:border-slate-700/80 shadow-2xl backdrop-blur-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-500/30">
                  Group G-20 • Roll 58 – 60
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Final PS IV Expt 10
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                Supply Chain Delay &amp; Inventory Risk Forecaster
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Download Bar */}
        <div className="flex items-center gap-2 px-6 py-2 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800/80">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1">Download Notebooks:</span>
          <a
            href="http://127.0.0.1:8000/api/notebooks/exp05"
            download="G20_Experiment_05_Baseline_Heuristics_vs_Complex_ML.ipynb"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
          >
            <Download className="w-3 h-3" /> Exp 05 .ipynb
          </a>
          <a
            href="http://127.0.0.1:8000/api/notebooks/exp07"
            download="G20_Experiment_07_Model_Performance_Monitoring_and_Drift.ipynb"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30 hover:bg-purple-500/25 transition-all"
          >
            <Download className="w-3 h-3" /> Exp 07 .ipynb
          </a>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-6 pt-3 border-b border-slate-200/60 dark:border-slate-800/80 gap-1.5 overflow-x-auto text-xs font-mono">
          {[
            { id: 'assignment', label: 'G-20 Table', icon: Award },
            { id: 'exp05', label: 'Exp 05: Baseline Heuristics', icon: TrendingUp },
            { id: 'exp07', label: 'Exp 07: Drift Monitoring', icon: Activity },
            { id: 'lifecycle', label: 'Exp 10: 5-Step Pipeline', icon: Layers },
            { id: 'viva', label: 'Viva Voce & Answers', icon: HelpCircle },
            { id: 'rubric', label: 'Evaluation Rubric', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/10' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          
          {/* TAB 1: G-20 Official Table Assignment */}
          {activeTab === 'assignment' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Official Assignment Allocation from Docx
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Extracted verbatim from <code className="font-mono bg-white/40 dark:bg-slate-800 px-1.5 py-0.5 rounded">Final PS IV Expt 10 Mini Project (1).docx</code> for <strong>Group 20</strong>.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Group ID</th>
                      <th className="p-4">Roll Numbers</th>
                      <th className="p-4">Project Title</th>
                      <th className="p-4">Key Modules Covered</th>
                      <th className="p-4">Relevant Experiments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white/40 dark:bg-slate-900/40">
                    <tr className="bg-orange-500/10 font-bold">
                      <td className="p-4 text-orange-600 dark:text-orange-400">G-20</td>
                      <td className="p-4 text-slate-800 dark:text-slate-200">Roll 58 – 60</td>
                      <td className="p-4 text-slate-900 dark:text-white font-black">
                        Supply Chain Delay &amp; Inventory Risk Forecaster
                      </td>
                      <td className="p-4 text-slate-800 dark:text-slate-200">
                        Time-series regression, simple heuristic baseline comparison
                      </td>
                      <td className="p-4 text-orange-600 dark:text-orange-400 font-bold">
                        Exp 5, Exp 7
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Module Alignment Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-orange-600 dark:text-orange-400 mb-1">
                    <Cpu className="w-4 h-4" /> Experiment 07 Module: Time-Series Regression &amp; Monitoring
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Iterative multi-step future demand prediction with <strong>GradientBoostingRegressor</strong> ($R^2 = 95.48\%$, MAE $11.12$). Features real-time KS-test distribution drift detection, prior shift, and concept drift error tracking.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400 mb-1">
                    <TrendingUp className="w-4 h-4" /> Experiment 05 Module: Simple Heuristic Baseline Comparison
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Benchmarking the ML model directly against the <strong>7-Day Moving Average Heuristic</strong> ($R^2 = 79.38\%$, MAE $25.88$). Proves an empirical <strong>+57.0% error reduction</strong> achieved by machine learning.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Experiment 05 Detailed Steps */}
          {activeTab === 'exp05' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Experiment 05: Heuristic Baseline vs. Complex ML Models
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Step-by-step implementation mapping to Experiment 05 syllabus theory.
                </p>
              </div>

              {[
                {
                  step: "Step 1: Define the Predictive Task",
                  content: "Task: Continuous multi-step time-series regression forecasting daily unit demand for 15 catalog SKUs across multi-echelon warehouse distribution networks."
                },
                {
                  step: "Step 2: Collect & Prepare Data",
                  content: "10,995 daily records across 15 SKUs. Handled missing values (forward-fill/median), outlier capping, categorical encoding, and strict 70% Train (7,696 rows) vs. 30% Test/Holdout (3,299 rows) chronological split."
                },
                {
                  step: "Step 3: Establish Baseline Performance",
                  content: "Implemented simple heuristic models: (1) Mean/Median Prediction (MAE 31.4 units, R² 68.2%) and (2) 7-Day Moving Average Heuristic (MAE 25.88 units, RMSE 33.27, R² 79.4%)."
                },
                {
                  step: "Step 4: Train and Evaluate Baseline Models",
                  content: "Baseline models evaluated on holdout test set using MAE, RMSE, and R² to establish reference performance before training complex models."
                },
                {
                  step: "Step 5: Train Complex Machine Learning Models",
                  content: "Trained Random Forest Regressor (100 trees, depth 12) and Gradient Boosting Regressor (100 estimators, depth 6) with TimeSeriesSplit (3 splits) and RandomizedSearchCV for hyperparameter tuning."
                },
                {
                  step: "Step 6: Evaluate Complex Models",
                  content: "Random Forest achieved MAE 11.41, RMSE 15.90, R² 95.29%. Gradient Boosting Champion achieved MAE 11.12, RMSE 15.58, R² 95.48% on unseen holdout test data."
                },
                {
                  step: "Step 7: Analyze Results and Draw Conclusions",
                  content: "Gradient Boosting reduced Mean Absolute Error by 57.0% compared to the 7-day Moving Average baseline, successfully capturing lead times and supply chain spikes that simple heuristics fail to model."
                }
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-mono font-bold text-xs text-orange-600 dark:text-orange-400">{s.step}</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{s.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Experiment 07 Detailed Sections */}
          {activeTab === 'exp07' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Experiment 07: Continuous Performance Monitoring &amp; Drift Handling
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Full framework covering statistical drift detection, automated alerts, response retraining, and governance.
                </p>
              </div>

              {[
                {
                  section: "1. Model Performance Monitoring",
                  desc: "Continuous tracking of production predictions against ground-truth feedback. MAE, RMSE, and R² are computed across rolling chronological windows and compared against the established 7-day MA baseline."
                },
                {
                  section: "2. Model Drift Types & Handling",
                  desc: "Analyzes all 3 core drift mechanisms: (a) Covariate Shift: changes in feature distributions P(X); (b) Prior Probability Shift: changes in target demand distribution P(y); and (c) Concept Drift: decay in P(y|X) relationships over time."
                },
                {
                  section: "3. Detection Techniques (Statistical KS-Tests)",
                  desc: "Automated two-sample Kolmogorov-Smirnov (KS) tests comparing baseline distributions against production telemetry at α=0.05. Displays p-values and maximum vertical distance (KS-statistic) for each feature."
                },
                {
                  section: "4. Response Strategies & Retraining",
                  desc: "Automated Retraining Trigger in production when MAE degrades past 15.0 units or >=3 covariates drift. Model version registry tracks v1.0.0 (Baseline), v2.1.0 (Random Forest), and v2.2.0 (Champion GBR)."
                },
                {
                  section: "5. Governance & Documentation",
                  desc: "Audit logs record all statistical tests, data quality metrics, and retrain timestamps to ensure regulatory compliance, transparency, and stakeholder communication."
                }
              ].map((sec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400">{sec.section}</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{sec.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: 5-Step Pipeline Lifecycle (Exp 10) */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                The application strictly implements all five phases defined under Experiment 10 Theory:
              </p>

              {[
                {
                  step: 'Step 1',
                  title: 'Problem Definition & Scope Assessment',
                  desc: 'Mapped to G-20: Supply Chain Delay & Inventory Risk Forecaster. Targets time-series demand, stockout risk thresholds, and vendor lead-time delay variance.',
                  impl: 'Implemented in backend models, inventory coverage days, and delay index services.'
                },
                {
                  step: 'Step 2',
                  title: 'Data Acquisition & Preprocessing',
                  desc: 'Exploratory data analysis on 10,995 multi-echelon records across 15 SKUs. Categorical encoding, outlier audits, and chronological train/validation/test split (70% Train, 15% Val, 15% Test).',
                  impl: 'Executed by DataPreprocessor and FeatureEngineer in ml/preprocessing/.'
                },
                {
                  step: 'Step 3',
                  title: 'Machine Learning Model Development',
                  desc: 'Trained candidate algorithms: 7-day Moving Average Heuristic baseline, Random Forest Regressor, and Gradient Boosting Regressor with TimeSeriesSplit and RandomizedSearchCV.',
                  impl: 'Executed in ml/training/train.py yielding Champion model with 100 estimators.'
                },
                {
                  step: 'Step 4',
                  title: 'Model Evaluation & Validation Tracking',
                  desc: 'Evaluated holdout predictions using MAE, RMSE, and R² scores. Visualized actual vs predicted trajectories and residual error distributions.',
                  impl: 'Interactive holdout charts rendered in Model Benchmarks (/dashboard/models).'
                },
                {
                  step: 'Step 5',
                  title: 'Web Integration & Application Deployment',
                  desc: 'Serialized champion model to demand_model.joblib. Deployed high-throughput FastAPI REST API with React liquid glassmorphism interface for live parameter inference.',
                  impl: 'FastAPI :8000 + React :3000 with sub-100ms real-time inference latency.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-black uppercase">
                      {item.step}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{item.desc}</p>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {item.impl}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: Viva Voce Questions & Model Answers */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> Comprehensive Viva Voce Questions &amp; Answers
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Complete academic answers to the viva questions for Experiment 05, Experiment 07, and Experiment 10.
                </p>
              </div>

              {[
                {
                  q: "What are the key stages involved in building an end-to-end Machine Learning mini-project pipeline? (Exp 10)",
                  a: "The pipeline consists of 5 core stages: (1) Problem Formulation & Scope Assessment (defining regression vs classification targets); (2) Data Acquisition & Preprocessing (EDA, handling missing data, categorical encoding, chronological train/test splitting); (3) Model Selection & Hyperparameter Tuning (training candidate algorithms using cross-validation); (4) Validation & Benchmarking (evaluating MAE, RMSE, R² against naive heuristic baselines); and (5) Model Serialization & Web Deployment (saving model weights with joblib/pickle and building a responsive web interface via FastAPI/React)."
                },
                {
                  q: "Why is model serialization (e.g., using pickle or joblib) necessary for mini-project deployment? (Exp 10)",
                  a: "Model training is computationally expensive and requires full historical datasets. Serialization freezes the trained model structure, learned tree splits, and preprocessing parameters into a compact binary artifact (e.g., demand_model.joblib). In production, the web server loads this artifact into memory once during startup, enabling sub-second real-time inference without requiring re-training for every user request."
                },
                {
                  q: "How do you select the appropriate evaluation metric for your specific mini-project domain? (Exp 10)",
                  a: "For Supply Chain Demand Forecasting (Regression), metric selection is driven by operational impact: (1) MAE (Mean Absolute Error) measures direct unit error in physical inventory; (2) RMSE (Root Mean Squared Error) penalizes large unexpected prediction errors that could cause catastrophic stockouts; and (3) R² (Coefficient of Determination) quantifies the percentage of demand variance explained by the model relative to a naive moving-average baseline."
                },
                {
                  q: "What is the purpose of establishing a simple heuristic baseline before training ML models? (Exp 05)",
                  a: "A baseline (such as a 7-day moving average or historical mean) provides an empirical floor. If a complex machine learning model cannot significantly outperform this simple heuristic on unseen test data, the added computational overhead and operational complexity are not justified. In our project, Gradient Boosting demonstrated a +57.0% error reduction over the baseline, justifying its deployment."
                },
                {
                  q: "What is the difference between Covariate Shift and Concept Drift? How do you detect them? (Exp 07)",
                  a: "Covariate Shift occurs when the distribution of input features P(X) changes while the relationship P(y|X) stays stable (detected using two-sample Kolmogorov-Smirnov statistical tests on feature distributions). Concept Drift occurs when the underlying relationship between inputs and the target variable P(y|X) changes (detected by tracking rolling error metrics like MAE over time against an alert threshold)."
                }
              ].map((v, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-mono font-black text-xs">Q{i+1}:</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{v.q}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-5 leading-relaxed border-l-2 border-orange-500/40">
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">Answer: </strong>
                    {v.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: Evaluation Rubric & Outcomes */}
          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Course Outcomes &amp; Faculty Evaluation Rubric
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Target criteria for scoring full 100% practical marks based on the faculty assessment table.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono">40%</span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">Formative Assessment</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Full marks for conceptual understanding of Exp 5 baseline heuristics and Exp 7 drift monitoring.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">40%</span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">Timely Completion</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">On-schedule practical execution and deployment without delay penalties.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">20%</span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">Attendance &amp; Attitude</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Active live demonstration of the deployed web application on the scheduled date.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/30 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 font-bold">Course Outcome:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">CO6 — Design, implement, and deploy ML mini-projects using web frameworks.</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 font-bold">Learning Outcome 10.1:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Develop end-to-end ML pipeline with preprocessing, feature engineering &amp; training.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Learning Outcome 10.2:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Evaluate model with standardized metrics and deploy as interactive web app.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            Assigned: Final PS IV Expt 10 • Group G-20 (Roll 58–60)
          </span>
          <button
            onClick={onClose}
            className="btn-glass-primary px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expt10DossierModal;
