/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserCheck, Key, Gavel, Lock, Check, RefreshCw, LockOpen, Server } from 'lucide-react';

// --- ARCHITECTURE GRID ---
export const ArchitectureGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vault' | 'jury' | 'keycard'>('vault');

  const data = {
    vault: {
      title: "The Vault",
      subtitle: "Financial Layer",
      icon: Lock,
      color: "text-aptos-cyan",
      bg: "bg-aptos-cyan/10",
      borderColor: "border-aptos-cyan",
      desc: "Funds are instantly locked in a Room-specific Move module once a task is opened. When verification is completed, the Vault releases payment instantly and automatically. Eliminates wage theft.",
      features: ["Trustless Escrow", "Instant Settlement", "No Chargebacks"]
    },
    jury: {
      title: "The Jury",
      subtitle: "Verification Layer",
      icon: Gavel,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      borderColor: "border-purple-400",
      desc: "A pool of token-staked community members are randomly selected to review submissions. Jurors are rewarded for accuracy and slashed for malicious behavior. A transparent, fair process.",
      features: ["Random Selection", "Stake Slashing", "Decentralized QC"]
    },
    keycard: {
      title: "The Keycard",
      subtitle: "Identity Layer",
      icon: UserCheck,
      color: "text-green-400",
      bg: "bg-green-400/10",
      borderColor: "border-green-400",
      desc: "Each successful task mints an immutable credential on the Aptos ledger. These credentials form the Keycard, a portable Proof-of-Work identity not tied to any specific UI.",
      features: ["Portable Reputation", "On-Chain Resume", "Skill Verification"]
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Navigation / Tabs */}
      <div className="md:col-span-4 flex flex-col gap-4 relative">
        {/* Animated Connecting Line (Desktop) */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gray-800 hidden md:block"></div>

        {(Object.keys(data) as Array<keyof typeof data>).map((key) => {
           const Icon = data[key].icon;
           const isActive = activeTab === key;
           return (
             <button 
               key={key}
               onClick={() => setActiveTab(key)}
               className={`relative flex items-center gap-4 p-6 rounded-xl border text-left transition-all duration-300 group overflow-hidden ${isActive ? `bg-black ${data[key].borderColor} border-l-4` : 'bg-transparent border-gray-800 hover:bg-white/5 border-l-transparent'}`}
               style={{ borderWidth: isActive ? '1px 1px 1px 4px' : '1px' }}
             >
                {isActive && (
                    <motion.div 
                        layoutId="activeGlow"
                        className={`absolute inset-0 ${data[key].bg} opacity-20`}
                    />
                )}
                
                <div className={`relative z-10 w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-black border border-gray-700' : 'bg-gray-900'}`}>
                   <Icon className={isActive ? data[key].color : 'text-gray-500'} size={24} />
                </div>
                <div className="relative z-10">
                   <div className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{data[key].title}</div>
                   <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">{data[key].subtitle}</div>
                </div>
                
                {/* Connector Beam */}
                {isActive && (
                   <motion.div 
                     layoutId="connector"
                     className="hidden md:block absolute -right-[33px] top-1/2 w-8 h-[1px] bg-aptos-cyan shadow-[0_0_10px_#00F0FF]"
                   />
                )}
             </button>
           )
        })}
      </div>

      {/* Content Display */}
      <div className="md:col-span-8">
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="h-full bg-black/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group"
            >
               {/* Grid Background */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none"></div>

               <div className={`absolute top-0 right-0 w-96 h-96 blur-[150px] rounded-full opacity-20 ${activeTab === 'vault' ? 'bg-aptos-cyan' : activeTab === 'jury' ? 'bg-purple-600' : 'bg-green-600'}`}></div>
               
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                     <div className="flex items-center gap-3">
                         <div className={`w-2 h-8 ${activeTab === 'vault' ? 'bg-aptos-cyan' : activeTab === 'jury' ? 'bg-purple-400' : 'bg-green-400'} rounded-sm`}></div>
                         <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{data[activeTab].title}</h3>
                     </div>
                     <Server className="text-gray-700" />
                  </div>
                  
                  <p className="text-xl text-gray-300 leading-relaxed mb-10 font-light">
                     {data[activeTab].desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     {data[activeTab].features.map((feat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                            className="flex items-center gap-3 text-sm font-mono text-gray-400 bg-black/60 p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
                        >
                           <div className={`p-1 rounded-full ${data[activeTab].bg}`}>
                                <Check size={12} className={data[activeTab].color} />
                           </div>
                           {feat}
                        </motion.div>
                     ))}
                  </div>
               </div>
            </motion.div>
         </AnimatePresence>
      </div>
    </div>
  );
};

// --- DUAL KEY CONSENSUS CALCULATOR ---
export const DualKeyConsensus: React.FC = () => {
    const [clientScore, setClientScore] = useState(80);
    const [juryScore, setJuryScore] = useState(50);
    const [isHovered, setIsHovered] = useState(false);
    
    // Weights
    const wClient = 0.6;
    const wJury = 0.4;
    
    const finalScore = (clientScore * wClient) + (juryScore * wJury);
    const isUnlocked = finalScore >= 60;

    return (
        <div 
            className="p-1 rounded-2xl bg-gradient-to-b from-gray-800 to-black shadow-2xl relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Outer Glow */}
            <div className={`absolute inset-0 blur-2xl transition-opacity duration-500 ${isUnlocked ? 'bg-aptos-cyan/20' : 'bg-red-500/10'} opacity-50 pointer-events-none`}></div>

            <div className="bg-black rounded-xl p-8 border border-gray-800 relative overflow-hidden h-full">
                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">System Status</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-aptos-cyan animate-pulse' : 'bg-red-500'}`}></div>
                            <span className={`font-mono font-bold ${isUnlocked ? 'text-aptos-cyan' : 'text-red-500'}`}>
                                {isUnlocked ? 'CONSENSUS_REACHED' : 'AWAITING_CONSENSUS'}
                            </span>
                        </div>
                    </div>
                    <div className="text-gray-600">
                        <RefreshCw size={16} className={isHovered ? "animate-spin" : ""} />
                    </div>
                </div>

                {/* Sliders */}
                <div className="space-y-10 relative z-10">
                    {/* Client Slider */}
                    <div className="group">
                        <div className="flex justify-between mb-3">
                            <label className="text-yellow-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2 font-mono">
                                <Key size={14} /> Client Satisfaction
                            </label>
                            <span className="text-yellow-500 font-mono bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">{clientScore}%</span>
                        </div>
                        <div className="h-4 bg-gray-900 rounded-full relative overflow-hidden border border-gray-800">
                            <div 
                                className="absolute top-0 left-0 h-full bg-yellow-500/20 w-full origin-left transition-transform duration-75" 
                                style={{ transform: `scaleX(${clientScore/100})` }}
                            ></div>
                             <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={clientScore} 
                                onChange={(e) => setClientScore(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent w-[2px] pointer-events-none" style={{ left: `${clientScore}%` }}></div>
                        </div>
                    </div>

                    {/* Jury Slider */}
                    <div className="group">
                        <div className="flex justify-between mb-3">
                            <label className="text-gray-300 font-bold uppercase tracking-wider text-xs flex items-center gap-2 font-mono">
                                <Shield size={14} /> Jury Review
                            </label>
                            <span className="text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded border border-gray-700">{juryScore}%</span>
                        </div>
                        <div className="h-4 bg-gray-900 rounded-full relative overflow-hidden border border-gray-800">
                            <div 
                                className="absolute top-0 left-0 h-full bg-gray-400/20 w-full origin-left transition-transform duration-75" 
                                style={{ transform: `scaleX(${juryScore/100})` }}
                            ></div>
                             <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={juryScore} 
                                onChange={(e) => setJuryScore(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent w-[2px] pointer-events-none" style={{ left: `${juryScore}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="my-8 border-t border-gray-800 border-dashed"></div>

                {/* Results HUD */}
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                         <div className="text-[10px] text-gray-500 uppercase font-mono">Result Protocol</div>
                         <div className="flex items-center gap-2 text-3xl font-mono text-gray-600">
                            <span className="text-yellow-600">{Math.round(clientScore * wClient)}</span>
                            <span className="text-gray-700">+</span>
                            <span className="text-gray-400">{Math.round(juryScore * wJury)}</span>
                         </div>
                    </div>

                    <div className="text-right">
                        <motion.div 
                            key={isUnlocked ? 'unlocked' : 'locked'}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="flex flex-col items-end"
                        >
                            <div className={`text-5xl font-bold font-mono tracking-tighter ${isUnlocked ? 'text-aptos-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'text-gray-500'}`}>
                                {finalScore.toFixed(1)}
                            </div>
                            <div className={`text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2 ${isUnlocked ? 'text-aptos-cyan' : 'text-gray-600'}`}>
                                {isUnlocked ? <LockOpen size={12} /> : <Lock size={12} />}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}