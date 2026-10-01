import React from 'react';
import { X, Award, CheckCircle, ShieldCheck, Heart, Sparkles, Layers, Cpu, Users } from 'lucide-react';
import { HARSHU_ACRONYM } from '../../utils/translations';

interface JudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeModal: React.FC<JudgeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf8f5] text-harshu-950 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-earth-300 my-8 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-earth-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-harshu-950">
                  HARSHU Product Architecture
                </span>
                <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  Judge Overview
                </span>
              </div>
              <p className="text-xs text-earth-700">
                Voice-First Digital Companion for First-Time Women Internet Users
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-earth-600 hover:text-earth-950 hover:bg-earth-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Core Product Identity & Acronym */}
        <div className="mb-6 p-4 bg-white rounded-2xl border border-earth-200 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-harshu-800 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-harshu-600" />
            <span>HARSHU Acronym & Brand Identity</span>
          </h3>
          <p className="text-xs text-earth-700 mb-3">
            The name <strong>HARSHU</strong> is an intentional product identity designed for empathy and trust:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {HARSHU_ACRONYM.map((item) => (
              <div key={item.word} className="bg-harshu-50/80 p-2 rounded-xl border border-harshu-200/70 text-xs">
                <span className="font-extrabold text-harshu-900">{item.letter}</span> —{' '}
                <span className="font-bold text-harshu-800">{item.word}</span>
                <span className="text-[10px] text-earth-600 block">({item.meaning.ta} / {item.meaning.hi})</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-harshu-900 font-semibold bg-earth-50 p-2 rounded-xl">
            Tagline: <em>"Just speak. HARSHU will guide you."</em>
          </div>
        </div>

        {/* 2. Problem vs Solution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800 block mb-1">
              The Digital Divide
            </span>
            <p className="text-xs text-red-950 leading-relaxed">
              Traditional government and digital portals expect users to know English, complex scheme names, and navigation paths. A rural woman who says <em>"எனக்கு தையல் கற்றுக்கணும்"</em> gets lost immediately.
            </p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              HARSHU's Solution
            </span>
            <p className="text-xs text-emerald-950 leading-relaxed">
              HARSHU understands colloquial voice intent, explains eligibility in 2 plain sentences, and walks step-by-step through execution without fear or shame.
            </p>
          </div>
        </div>

        {/* 3. The Core Innovation: DO IT WITH ME */}
        <div className="mb-6 p-4 bg-gradient-to-r from-harshu-900 to-harshu-800 text-white rounded-2xl shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-harshu-300 block mb-1">
            Core Innovation
          </span>
          <h4 className="text-base font-bold text-white mb-1.5">
            "DO IT WITH ME" vs Generic Chatbots
          </h4>
          <p className="text-xs text-harshu-100/90 leading-relaxed mb-3">
            Generic chatbots output walls of markdown text or dump external URLs. HARSHU breaks tasks into manageable micro-steps with an integrated <strong>"I Don't Understand" (எனக்கு புரியவில்லை)</strong> simplification engine and emotional safety guardrails.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-harshu-200">
            <span className="bg-harshu-700/80 px-2 py-0.5 rounded">SAY</span>
            <span>➔</span>
            <span className="bg-harshu-700/80 px-2 py-0.5 rounded">UNDERSTAND</span>
            <span>➔</span>
            <span className="bg-harshu-700/80 px-2 py-0.5 rounded">GUIDE</span>
            <span>➔</span>
            <span className="bg-harshu-700/80 px-2 py-0.5 rounded">DO (With Me)</span>
            <span>➔</span>
            <span className="bg-harshu-700/80 px-2 py-0.5 rounded">COMPLETE</span>
          </div>
        </div>

        {/* 4. Simulated Demo Metrics (Transparently Labeled) */}
        <div className="mb-6 p-4 bg-white rounded-2xl border border-earth-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-earth-700">
              Simulated Demonstration Metrics
            </span>
            <span className="text-[10px] bg-earth-100 text-earth-700 font-semibold px-2 py-0.5 rounded">
              Prototype Pilot Projection
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-harshu-50 p-2.5 rounded-xl border border-harshu-100">
              <span className="text-lg font-black text-harshu-900">4.2x</span>
              <span className="text-[10px] text-earth-700 block mt-0.5 leading-tight">
                Higher Completion vs Portals
              </span>
            </div>
            <div className="bg-harshu-50 p-2.5 rounded-xl border border-harshu-100">
              <span className="text-lg font-black text-harshu-900">100%</span>
              <span className="text-[10px] text-earth-700 block mt-0.5 leading-tight">
                Voice-First Offline Resilience
              </span>
            </div>
            <div className="bg-harshu-50 p-2.5 rounded-xl border border-harshu-100">
              <span className="text-lg font-black text-harshu-900">0</span>
              <span className="text-[10px] text-earth-700 block mt-0.5 leading-tight">
                Passwords / Sensitive Data Taken
              </span>
            </div>
          </div>
        </div>

        {/* 5. Privacy & Trust Architecture */}
        <div className="p-4 bg-earth-100/70 rounded-2xl border border-earth-200 text-xs text-earth-800 space-y-1.5 mb-6">
          <div className="flex items-center gap-1.5 font-bold text-harshu-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-harshu-700" />
            <span>Strict Privacy & Transparency Architecture:</span>
          </div>
          <p>• Never asks for real Aadhaar numbers, OTPs, or bank passwords.</p>
          <p>• Verified official government source badges clearly separated from AI simplified explanations.</p>
          <p>• No fake government affiliation claims; transparent handoff to authorized portals and e-Sevai centres.</p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-harshu-800 hover:bg-harshu-900 text-white rounded-xl font-bold text-sm shadow-xs"
        >
          Return to HARSHU Companion
        </button>
      </div>
    </div>
  );
};
