import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, ClipboardList, Stethoscope, Heart, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';

export default function Diagnosis() {
  const { t } = useLanguage();
  const { setActiveTab } = useAppData();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({});

  const questions = [
    {
      id: 1,
      title: "Primary Concern",
      subtitle: "What brings you to The Seoul Private today?",
      options: [
        { id: 'general', label: 'General Check-up', icon: ClipboardList },
        { id: 'plastic', label: 'Cosmetic Enhancement', icon: Shield },
        { id: 'antiaging', label: 'Anti-Aging Therapy', icon: Heart },
        { id: 'chronic', label: 'Specialized Treatment', icon: Stethoscope },
      ]
    },
    {
      id: 2,
      title: "Target Area",
      subtitle: "Please specify the area of interest.",
      options: [
        { id: 'face', label: 'Facial Harmony' },
        { id: 'body', label: 'Body Rejuvenation' },
        { id: 'skin', label: 'Skin Vitality' },
        { id: 'internal', label: 'Internal Wellness' },
      ]
    },
    {
      id: 3,
      title: "Preferred Schedule",
      subtitle: "When would you like to visit Korea?",
      options: [
        { id: 'urgent', label: 'Within 2 Weeks' },
        { id: 'month', label: 'Next Month' },
        { id: 'flexible', label: 'Flexible / Consultation' },
      ]
    }
  ];

  const handleSelect = (questionId, optionId) => {
    setSelections({ ...selections, [questionId]: optionId });
    if (step < questions.length) {
      setTimeout(() => setStep(step + 1), 400);
    }
  };

  const currentQuestion = questions.find(q => q.id === step);

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] text-gold-500 font-bold uppercase">Step {step} / {questions.length}</span>
        </div>
        <button 
          onClick={() => setActiveTab('artisans')}
          className="text-[10px] tracking-[0.2em] text-gray-500 hover:text-gold-500 uppercase"
        >
          Exit
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step <= questions.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl font-serif text-gray-100 mb-2 tracking-wide">{currentQuestion.title}</h1>
            <p className="text-sm text-gray-500 mb-10 tracking-widest uppercase">{currentQuestion.subtitle}</p>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(step, opt.id)}
                  className={`group relative p-6 rounded-2xl border transition-all flex items-center justify-between ${
                    selections[step] === opt.id 
                      ? 'bg-gold-500 border-gold-500 text-obsidian-900 shadow-xl shadow-gold-500/20' 
                      : 'bg-obsidian-800/50 border-gold-500/10 text-gray-300 hover:border-gold-500/30'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    {opt.icon && <opt.icon className={`w-6 h-6 ${selections[step] === opt.id ? 'text-obsidian-900' : 'text-gold-500'}`} />}
                    <span className="text-lg font-medium tracking-wide">{opt.label}</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${selections[step] === opt.id ? 'text-obsidian-900' : 'text-gray-500'}`} />
                </button>
              ))}
            </div>

            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="mt-12 flex items-center gap-2 text-gray-500 hover:text-gold-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[10px] tracking-[0.2em] uppercase">Previous Step</span>
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-10"
          >
            <div className="w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8">
              <CheckCircle2 className="w-10 h-10 text-gold-500" />
            </div>
            <h1 className="text-3xl font-serif text-gray-100 mb-4">Request Complete</h1>
            <p className="text-sm text-gray-500 mb-12 tracking-widest uppercase leading-relaxed">
              Your VVIP consultation request has been securely transmitted. A Private Concierge will contact you shortly.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-10 py-4 bg-gold-500 text-obsidian-900 font-bold rounded-xl tracking-widest uppercase text-xs"
            >
              Return Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
