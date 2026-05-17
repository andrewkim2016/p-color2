/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, AlertCircle, RefreshCcw } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import AnalysisLoader from './components/AnalysisLoader';
import ResultDisplay from './components/ResultDisplay';
import type { AnalysisResult } from './types';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      {/* Navigation */}
      <nav className="h-20 px-6 md:px-12 flex items-center justify-between border-bottom border-ink/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="serif text-xl font-bold tracking-widest uppercase text-ink">Aura</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-widest uppercase text-ink/40">
           <a href="#" className="hover:text-gold transition-colors">How it works</a>
           <a href="#" className="hover:text-gold transition-colors">Types</a>
           <a href="#" className="hover:text-gold transition-colors">About</a>
        </div>

        <div className="flex items-center">
           <div className="px-4 py-1.5 border border-gold/30 rounded-full text-[10px] font-bold tracking-widest uppercase text-gold">
             AI CONSULTANT
           </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pt-10 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && (
              <motion.section
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-6 max-w-2xl mx-auto pt-10">
                  <h2 className="serif text-5xl md:text-7xl leading-tight font-medium">
                    당신의 진정한 색을 <br />
                    찾아보세요.
                  </h2>
                  <p className="text-ink/60 font-light text-lg md:text-xl leading-relaxed">
                    AI가 당신의 피부 톤, 얼굴 명도, 채도를 분석하여 <br className="hidden md:block" />
                    가장 잘 어울리는 퍼스널 컬러와 스타일링을 제안합니다.
                  </p>
                </div>

                <div className="space-y-8">
                  <ImageUploader 
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                    onClear={() => setSelectedImage(null)}
                  />
                  
                  {selectedImage && (
                    <motion.div 
                      layoutId="analyze-btn"
                      className="flex justify-center"
                    >
                      <button
                        id="analyze-image-btn"
                        onClick={analyzeImage}
                        className="gold-gradient px-12 py-5 rounded-full text-white font-bold tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
                      >
                        <Camera className="w-5 h-5" />
                        분석 시작하기
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.section>
            )}

            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnalysisLoader />
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout
              >
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-ink/10">
                   <h3 className="serif text-2xl font-medium">분석 결과 리포트</h3>
                   <button 
                     onClick={handleReset}
                     className="flex items-center gap-2 text-gold font-bold text-xs tracking-widest uppercase hover:text-gold-dark transition-colors"
                   >
                     <RefreshCcw className="w-4 h-4" />
                     다른 사진 분석하기
                   </button>
                </div>
                <ResultDisplay result={result} image={selectedImage!} />
              </motion.div>
            )}

            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto mt-20 p-8 bg-red-50 border border-red-100 rounded-[32px] text-center space-y-6"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="serif text-2xl font-medium text-red-900">분석 중 오류 발생</h4>
                  <p className="text-red-600 font-light text-sm">{error}</p>
                </div>
                <button 
                  onClick={handleReset}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-colors"
                >
                  다시 시도하기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-12 px-12 border-t border-ink/5 mt-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-30 grayscale underline-offset-4">
              <Sparkles className="w-4 h-4" />
              <span className="serif text-lg font-bold tracking-tighter">Aura Lab.</span>
            </div>
            
            <div className="flex gap-8 text-[10px] font-bold tracking-widest uppercase text-ink/30">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Contact</a>
            </div>
            
            <p className="text-[10px] text-ink/20 font-medium">
              Made with Google Gemini AI
            </p>
         </div>
      </footer>
    </div>
  );
}

