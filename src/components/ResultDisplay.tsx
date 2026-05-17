import { CheckCircle2, ChevronRight, Info, Palette, Shirt, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  image: string;
}

export default function ResultDisplay({ result, image }: ResultDisplayProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-8 gap-4 pb-20"
    >
      {/* 1. Hero Section (Season & Image) */}
      <motion.div 
        variants={itemVariants} 
        className="md:col-span-4 md:row-span-4 flex flex-col items-center text-center p-8 luxury-card gold-gradient"
      >
        <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden mb-6 bg-white flex items-center justify-center">
          <img src={image} alt="User" className="w-full h-full object-cover" />
        </div>
        <span className="label-bento">Analysis Result</span>
        <h2 className="serif text-4xl font-extrabold text-slate-700 mt-2">
          {result.season_type}
        </h2>
        <p className="text-slate-500 font-medium tracking-wide">
          {result.sub_type}
        </p>
      </motion.div>

      {/* 2. Skin Tone Analysis */}
      <motion.div variants={itemVariants} className="md:col-span-4 md:row-span-2 p-6 luxury-card flex flex-col justify-center">
        <span className="label-bento">Skin Tone Analysis</span>
        <div className="space-y-4 pt-2">
          <p className="text-ink/60 text-sm leading-relaxed">{result.analysis.skin_tone}</p>
        </div>
      </motion.div>

      {/* 3. Overall Impression */}
      <motion.div variants={itemVariants} className="md:col-span-4 md:row-span-2 p-6 luxury-card flex flex-col justify-center">
        <span className="label-bento">Overall Impression</span>
        <div className="space-y-4 pt-2">
          <p className="text-ink/60 text-sm leading-relaxed">{result.analysis.overall_impression}</p>
        </div>
      </motion.div>

      {/* 4. Consultant Summary */}
      <motion.div 
        variants={itemVariants} 
        className="md:col-span-8 md:row-span-1 p-6 luxury-card flex items-center gap-6"
      >
        <span className="text-3xl">✨</span>
        <div className="flex-1">
          <span className="label-bento">Consultant's Note</span>
          <p className="text-ink/80 text-sm font-medium leading-relaxed">
            {result.summary}
          </p>
        </div>
      </motion.div>

      {/* 5. Recommended Palette */}
      <motion.div variants={itemVariants} className="md:col-span-5 md:row-span-3 p-6 luxury-card">
        <span className="label-bento">Best Recommendations</span>
        <div className="grid grid-cols-4 gap-3 mt-4">
          {result.recommended_colors.map((color, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <div 
                className="aspect-square rounded-xl shadow-sm border border-black/5" 
                style={{ backgroundColor: color.hex }} 
                title={color.name}
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center p-2 text-center pointer-events-none">
                <p className="text-white text-[8px] leading-tight">{color.reason}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 6. Worst Colors to Avoid */}
      <motion.div variants={itemVariants} className="md:col-span-3 md:row-span-3 p-6 luxury-card">
        <span className="label-bento">Worst to Avoid</span>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {result.avoid_colors.slice(0, 5).map((color, idx) => (
            <div key={idx} className="group relative">
              <div 
                className="aspect-square rounded-full border-2 border-white shadow-sm" 
                style={{ backgroundColor: color.hex }} 
                title={color.name}
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center p-1 text-center pointer-events-none">
                <p className="text-white text-[7px] leading-tight">{color.name}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 7. Beauty & Styling Guide */}
      <motion.div variants={itemVariants} className="md:col-span-4 md:row-span-3 p-6 luxury-card flex flex-col justify-between">
        <span className="label-bento">Beauty Guide</span>
        <div className="space-y-4">
          <div className="flex gap-3">
             <div className="w-10 h-10 rounded-full shrink-0 border border-black/5" style={{ backgroundColor: '#E5989B' }} />
             <div className="text-xs">
                <div className="font-bold">Lip Color</div>
                <div className="text-ink/50">{result.makeup_recommendations.lip[0]}</div>
             </div>
          </div>
          <div className="flex gap-3">
             <div className="w-10 h-10 rounded-full shrink-0 border border-black/5" style={{ backgroundColor: '#F2D5D5' }} />
             <div className="text-xs">
                <div className="font-bold">Blush</div>
                <div className="text-ink/50">{result.makeup_recommendations.blush[0]}</div>
             </div>
          </div>
          <div className="flex gap-3">
             <div className="w-10 h-10 rounded-full shrink-0 border border-black/5 bg-slate-800" />
             <div className="text-xs">
                <div className="font-bold">Hair Color</div>
                <div className="text-ink/50">{result.hair_recommendations[0]}</div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* 8. Disclaimer */}
      <motion.div variants={itemVariants} className="md:col-span-12 p-4 text-center text-[10px] text-ink/40 font-light">
        {result.disclaimer} • 전문적인 오프라인 진단과 차이가 있을 수 있습니다.
      </motion.div>
    </motion.div>
  );
}
