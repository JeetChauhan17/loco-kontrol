import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, ArrowRight, ArrowUpRight, ArrowLeft, ArrowDown, Activity, ShieldAlert, Check } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: 'Kontrol Center',
    content: 'Welcome to the Resilient Logistics Decision Engine. This platform simulates live supply chain risks, tracking shipments across global lanes and dynamically assessing threat levels.',
    icon: <Network className="w-8 h-8 text-indigo-500" />,
    pointer: null
  },
  {
    title: 'Live Risk Tiers',
    content: 'Shipments drift between NOMINAL, AT_RISK, and HIGH_RISK based on localized events.',
    icon: <ArrowLeft className="w-8 h-8 text-amber-500" />,
    pointer: { top: '50%', left: '80px', rotate: 180, label: 'Risk Board is on the left' }
  },
  {
    title: 'Escalations & SLA',
    content: 'When a shipment hits critical risk, it is pushed to the Manual Review Queue. Review it before an SLA Breach creates financial loss.',
    icon: <ArrowUpRight className="w-8 h-8 text-red-500" />,
    pointer: { top: '24px', right: '180px', rotate: 45, label: 'Review Queue button' }
  },
  {
    title: 'Chaos Mode',
    content: 'Try turning on "Chaos Mode" once you learn the ropes. It increases the frequency and severity of risk spikes, forcing faster decision-making.',
    icon: <Activity className="w-8 h-8 text-emerald-500" />,
    pointer: { top: '80px', right: '120px', rotate: -45, label: 'Chaos Mode toggle' }
  }
];

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('ssc_has_seen_tour_v2');
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 500); // little delay
    }
  }, []);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem('ssc_has_seen_tour_v2', 'true');
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('ssc_has_seen_tour_v2', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm pointer-events-auto">
      
      {currentStep.pointer && (
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="absolute z-50 flex flex-col items-center pointer-events-none"
           style={{
             top: currentStep.pointer.top,
             left: currentStep.pointer.left,
             right: currentStep.pointer.right,
             bottom: (currentStep.pointer as any).bottom
           }}
         >
            <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded mb-2 shadow-lg tracking-wide uppercase">
              {currentStep.pointer.label}
            </div>
         </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full flex flex-col relative z-[101]"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 flex">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-full transition-colors duration-500 ${i <= step ? 'bg-indigo-600' : 'bg-transparent'}`}
              />
            ))}
          </div>

          <div className="p-8 pb-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
               {currentStep.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{currentStep.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {currentStep.content}
            </p>

            <div className="flex items-center justify-between w-full space-x-4">
               <button 
                  onClick={handleSkip}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-700 transition"
                >
                  Skip Tour
               </button>
               <button 
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded shadow-sm hover:bg-gray-800 transition flex items-center"
                >
                  {step === TOUR_STEPS.length - 1 ? 'Start Engine' : 'Next'}
                  {step < TOUR_STEPS.length - 1 && <ArrowRight className="w-3.5 h-3.5 ml-2" />}
               </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
