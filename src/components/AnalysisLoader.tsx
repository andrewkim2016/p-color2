import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function AnalysisLoader() {
  const messages = [
    "피부 톤의 밝기를 측정하고 있습니다...",
    "얼굴의 명도와 채도를 분석 중입니다...",
    "조명 상태를 보정하고 있습니다...",
    "어울리는 색상 팔레트를 구성하고 있습니다...",
    "컨설턴트의 최종 의견을 정리 중입니다..."
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative mb-12">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-32 h-32 rounded-full border border-gold/20"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 w-32 h-32 rounded-full border border-gold/40 border-dashed"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-gold animate-pulse" />
        </div>
      </div>
      
      <h3 className="serif text-3xl font-medium mb-4">당신의 오라(Aura)를 분석 중입니다</h3>
      
      <div className="h-6 overflow-hidden max-w-xs mx-auto">
        <motion.div
          animate={{ y: [0, -24, -48, -72, -96] }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            times: [0, 0.25, 0.5, 0.75, 1],
            ease: "easeInOut"
          }}
        >
          {messages.map((msg, i) => (
            <p key={i} className="text-ink/50 text-sm font-light h-6">
              {msg}
            </p>
          ))}
        </motion.div>
      </div>
      
      <div className="mt-12 w-64 h-1 bg-ink/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-full h-full bg-gold"
        />
      </div>
    </div>
  );
}
