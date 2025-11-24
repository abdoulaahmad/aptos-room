/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { NetworkScene } from './components/QuantumScene';
import { DualKeyConsensus, ArchitectureGrid } from './components/Diagrams';
import { ArrowRight, Menu, X, Shield, Lock, Zap, Code, CheckCircle, AlertTriangle, Database, Cpu, RefreshCw, Send } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// --- UTILS ---
const useScrambleText = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState("");
  const iterations = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations.current) {
              return text[index];
            }
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iterations.current >= text.length) {
        clearInterval(interval);
      }
      iterations.current += 1 / 3; 
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
};

const GlitchText = ({ text, className }: { text: string, className?: string }) => {
  const scrambled = useScrambleText(text);
  return <span className={`font-mono ${className}`}>{scrambled}</span>;
};

const Logo = () => (
  <img src="/logo.jpg" alt="AptosRoom" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
);

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const DiscordLogo = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-12 md:mb-20 relative">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-4"
    >
      <div className="h-[2px] w-8 bg-aptos-cyan shadow-[0_0_10px_#00F0FF]"></div>
      <GlitchText text={subtitle} className="text-aptos-cyan text-sm tracking-widest uppercase" />
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl relative z-10"
    >
      {title}
    </motion.h2>
    <div className="absolute -top-10 -left-10 w-32 h-32 bg-aptos-cyan/10 blur-3xl rounded-full pointer-events-none"></div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-gray-800 hover:border-aptos-cyan/50 transition-all duration-500 group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-aptos-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-aptos-cyan/20 transition-colors border border-gray-800 group-hover:border-aptos-cyan/30">
      <Icon className="text-aptos-cyan group-hover:scale-110 transition-transform duration-300" size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-4 font-mono">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const WhitelistForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 border border-aptos-cyan/30 bg-aptos-cyan/5 rounded-lg backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-aptos-cyan/20 flex items-center justify-center mb-2">
                  <CheckCircle className="text-aptos-cyan" size={24} />
               </div>
               <h3 className="text-xl font-bold text-white font-mono tracking-wider">ACCESS_GRANTED</h3>
               <p className="text-gray-400 text-sm font-mono">You have been added to the priority queue.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="relative group"
          >
              <div className="absolute -inset-1 bg-gradient-to-r from-aptos-cyan to-blue-600 opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-500 rounded-lg"></div>
              <div className="relative flex flex-col sm:flex-row p-1 bg-black/80 border border-gray-800 backdrop-blur-xl rounded-lg overflow-hidden group-hover:border-gray-600 transition-colors">
                  <input 
                      type="email" 
                      placeholder="ENTER_EMAIL_PROTOCOL..." 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-grow px-6 py-4 bg-transparent text-white placeholder-gray-600 font-mono focus:outline-none text-sm"
                      disabled={status === 'loading'}
                  />
                  <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="px-8 py-4 bg-aptos-cyan text-black font-bold font-mono uppercase text-sm tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded whitespace-nowrap flex items-center justify-center gap-2"
                  >
                      {status === 'loading' ? (
                          <RefreshCw className="animate-spin" size={18} />
                      ) : (
                          <>
                              WHITELIST <ArrowRight size={16} />
                          </>
                      )}
                  </button>
              </div>
              <div className="flex justify-between items-center mt-3 px-2 opacity-50">
                  <span className="text-[10px] font-mono text-aptos-cyan flex items-center gap-1">
                      <Lock size={10} /> ENCRYPTED CONNECTION
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">V.1.0.4</span>
              </div>
              {status === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm font-mono"
                >
                  {errorMessage}
                </motion.div>
              )}
              <div className="flex justify-center gap-6 mt-8">
                <a href="https://x.com/AptosRoom?s=09" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-aptos-cyan transition-colors" aria-label="X (Twitter)">
                  <XLogo />
                </a>
                <a href="https://t.me/+nzOvO5pymwY2Zjhk" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-aptos-cyan transition-colors" aria-label="Telegram">
                  <Send size={28} />
                </a>
                <a href="https://discord.gg/CYVKTxyEvz" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-aptos-cyan transition-colors" aria-label="Discord">
                  <DiscordLogo />
                </a>
              </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-aptos-dark text-white selection:bg-aptos-cyan selection:text-black font-sans overflow-x-hidden">
      <NoiseOverlay />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-aptos-cyan origin-left z-[100] shadow-[0_0_10px_#00F0FF]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-aptos-dark/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="transition-transform duration-700 group-hover:rotate-180">
              <Logo />
            </div>
            <span className="font-bold text-xl tracking-tight text-white font-mono">
              APTOS<span className="text-aptos-cyan">ROOM</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold font-mono tracking-widest text-gray-400">
            {['Overview', 'Trust Gap', 'Architecture', 'Consensus', 'Why Aptos'].map((item, i) => (
                <a 
                    key={i}
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    onClick={scrollToSection(item.toLowerCase().replace(' ', '-'))} 
                    className="hover:text-aptos-cyan transition-colors uppercase relative group"
                >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-aptos-cyan transition-all duration-300 group-hover:w-full"></span>
                </a>
            ))}
          </div>

          <button className="md:hidden text-white p-2 hover:text-aptos-cyan transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-aptos-dark/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-xl font-bold font-mono">
            {['Overview', 'Trust Gap', 'Architecture', 'Consensus'].map((item) => (
                <a 
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    onClick={scrollToSection(item.toLowerCase().replace(' ', '-'))} 
                    className="hover:text-aptos-cyan"
                >
                    {item}
                </a>
            ))}
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <NetworkScene />
        
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-aptos-dark/30 to-aptos-dark pointer-events-none" />
        
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]"></div>

        <div className="relative z-10 container mx-auto px-6 pt-40 md:pt-32">
          <div className="max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 border border-aptos-cyan/30 rounded-sm bg-aptos-cyan/5 backdrop-blur-md mb-8"
            >
               <div className="w-1.5 h-1.5 rounded-full bg-aptos-cyan animate-pulse shadow-[0_0_8px_#00F0FF]"></div>
               <GlitchText text="DECENTRALIZED TALENT ECOSYSTEM" className="text-aptos-cyan text-[10px] uppercase tracking-[0.2em]" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-9xl font-bold leading-[0.9] mb-8 text-white tracking-tighter mix-blend-lighten"
            >
              REVEAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">TALENT</span>.<br/>
              VALUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">WORK</span>.<br/>
              <span className="text-aptos-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">REWARD.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-12 font-light border-l-2 border-gray-800 pl-6"
            >
              APTOS ROOM is more than just a platform—it's a thriving ecosystem where Web3 builders, developers, designers, and creators converge to contribute their talents to meaningful projects while earning rewards in a trustless environment.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
               <button className="px-8 py-4 bg-aptos-cyan text-black font-bold text-lg rounded hover:bg-white transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]">
                  <span className="font-mono uppercase tracking-wider">Read Whitepaper</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-gray-500 font-mono uppercase tracking-widest"
        >
            <span>Scroll to initialize</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-aptos-cyan to-transparent"></div>
        </motion.div>
      </header>

      <main>
        {/* Overview / Trust Gap */}
        <section id="problem" className="py-24 md:py-32 relative z-10">
          <div className="container mx-auto px-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                  <SectionHeader title="The Problem: The Trust Gap" subtitle="Current Inefficiencies" />
                  <p className="text-lg text-gray-400 leading-relaxed mb-10 font-light">
                    Current Web3 talent platforms still behave like Web2 marketplaces. They inherit the 
                    critical flaws of centralized intermediaries: <span className="text-white">bias, delay, and opacity.</span>
                  </p>
                  <div className="space-y-4">
                    <motion.div whileHover={{ x: 10 }} className="flex items-start gap-4 p-6 rounded-lg border border-gray-800 bg-black/50 backdrop-blur hover:border-red-500/50 transition-colors group">
                       <AlertTriangle className="text-gray-600 group-hover:text-red-500 mt-1 shrink-0 transition-colors" />
                       <div>
                         <h4 className="text-white font-bold text-lg mb-1 font-mono">Payment Risk</h4>
                         <p className="text-sm text-gray-500">Contributors face non-payment because funds depend on goodwill rather than code.</p>
                       </div>
                    </motion.div>
                    <motion.div whileHover={{ x: 10 }} className="flex items-start gap-4 p-6 rounded-lg border border-gray-800 bg-black/50 backdrop-blur hover:border-orange-500/50 transition-colors group">
                       <Lock className="text-gray-600 group-hover:text-orange-500 mt-1 shrink-0 transition-colors" />
                       <div>
                         <h4 className="text-white font-bold text-lg mb-1 font-mono">Centralized Gatekeeping</h4>
                         <p className="text-sm text-gray-500">Task verification is controlled by slow, biased, and opaque admin teams.</p>
                       </div>
                    </motion.div>
                    <motion.div whileHover={{ x: 10 }} className="flex items-start gap-4 p-6 rounded-lg border border-gray-800 bg-black/50 backdrop-blur hover:border-purple-500/50 transition-colors group">
                       <Database className="text-gray-600 group-hover:text-purple-500 mt-1 shrink-0 transition-colors" />
                       <div>
                         <h4 className="text-white font-bold text-lg mb-1 font-mono">Siloed Reputation</h4>
                         <p className="text-sm text-gray-500">Your "reputation" is locked where you worked. Credibility cannot move across platforms.</p>
                       </div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="relative mt-8 lg:mt-0">
                   <div className="absolute -inset-1 bg-gradient-to-r from-aptos-cyan to-purple-600 opacity-20 blur-2xl rounded-full"></div>
                   <div className="relative bg-black border border-gray-800 p-8 rounded-2xl shadow-2xl">
                      <h3 className="font-mono text-aptos-cyan mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={14} /> System Comparison Analysis
                      </h3>
                      
                      <div className="space-y-10">
                          <div>
                            <div className="flex justify-between mb-2 text-sm font-bold font-mono">
                               <span className="text-gray-500">LEGACY (WEB2)</span>
                               <span className="text-red-500">HIGH FRICTION</span>
                            </div>
                            <div className="h-1 bg-gray-900 w-full">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: "80%" }}
                                 transition={{ duration: 1, ease: "circOut" }}
                                 className="h-full bg-red-500/50"
                               />
                            </div>
                            <div className="mt-2 flex gap-4 text-[10px] text-gray-600 uppercase font-mono">
                               <span>Manual Review</span> • <span>Escrow Disputes</span> • <span>Platform Fees</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-2 text-sm font-bold font-mono">
                               <span className="text-white">APTOS ROOM</span>
                               <span className="text-aptos-cyan shadow-cyan">TRUSTLESS</span>
                            </div>
                            <div className="h-1 bg-gray-900 w-full">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: "15%" }}
                                 transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                                 className="h-full bg-aptos-cyan shadow-[0_0_10px_#00F0FF]"
                               />
                            </div>
                            <div className="mt-2 flex gap-4 text-[10px] text-gray-400 uppercase font-mono">
                               <span className="text-aptos-cyan">Instant Settlement</span> • <span>Code Governance</span> • <span>0% Fees</span>
                            </div>
                          </div>
                      </div>
                      
                      <div className="mt-12 p-4 bg-gray-900/50 rounded border-l-2 border-gray-700">
                         <p className="font-mono text-xs text-green-400 mb-2">&gt; analyzing_market_structure.exe</p>
                         <p className="text-gray-400 text-sm font-mono">
                           <span className="text-red-400">[ALERT]</span> Centralized intermediaries introduce <span className="text-white font-bold">30-50% efficiency loss</span>. 
                           <br/><span className="text-aptos-cyan">[OPTIMIZED]</span> AptosRoom removes the middleman completely.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* The Solution: Architecture */}
        <section id="solution" className="py-24 md:py-32 border-y border-gray-900 bg-black/40">
           <div className="container mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                 <GlitchText text="THE SOLUTION" className="text-sm text-aptos-cyan tracking-[0.3em] uppercase mb-4 block" />
                 <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">The "Room" Architecture</h3>
                 <p className="text-gray-400 text-lg font-light">
                    AptosRoom runs on three decentralized layers built with Move, replacing human managers with immutable smart contracts.
                 </p>
              </div>

              <ArchitectureGrid />
           </div>
        </section>

        {/* Consensus Engine */}
        <section id="consensus" className="py-24 md:py-32 relative overflow-hidden">
             {/* Background Elements */}
             <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-aptos-cyan/5 to-transparent pointer-events-none"></div>
             
             <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                   <div className="order-2 lg:order-1">
                      <DualKeyConsensus />
                   </div>
                   
                   <div className="order-1 lg:order-2">
                      <SectionHeader title="Dual-Key Consensus" subtitle="The Core Engine" />
                      <p className="text-lg text-gray-400 mb-10 font-light">
                        No task is completed based on only one opinion. The engine requires two keys to unlock the Vault, balancing client satisfaction with technical correctness.
                      </p>
                      
                      <div className="space-y-6 mb-8">
                         <div className="flex gap-6 p-4 border-l border-gray-800 hover:border-yellow-500 transition-colors">
                            <div className="text-4xl font-bold text-yellow-500 font-mono">60%</div>
                            <div>
                               <h4 className="text-xl font-bold text-white mb-1">Gold Key</h4>
                               <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 font-mono">Client Satisfaction</p>
                               <p className="text-sm text-gray-500">Represents whether the work meets expectations and product vision.</p>
                            </div>
                         </div>
                         
                         <div className="flex gap-6 p-4 border-l border-gray-800 hover:border-gray-400 transition-colors">
                            <div className="text-4xl font-bold text-gray-400 font-mono">40%</div>
                            <div>
                               <h4 className="text-xl font-bold text-white mb-1">Silver Key</h4>
                               <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 font-mono">Jury Technical Review</p>
                               <p className="text-sm text-gray-500">Ensures code quality, security, and correctness via decentralized peer review.</p>
                            </div>
                         </div>
                      </div>

                      <div className="p-4 border border-aptos-cyan/20 bg-aptos-cyan/5 rounded">
                         <p className="text-aptos-cyan text-sm font-mono">
                            "The highest Final Score is automatically the winner. This removes bias, favoritism, and human interference."
                         </p>
                      </div>
                   </div>
                </div>
             </div>
        </section>

        {/* Strategic Advantage */}
        <section id="why-aptos" className="py-24 relative">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
           <div className="container mx-auto px-6 relative z-10">
              <SectionHeader title="Strategic Advantage" subtitle="Infrastructure" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FeatureCard 
                    delay={0.1}
                    icon={Code}
                    title="Move's Resource Model"
                    description="Ensures funds cannot be duplicated, lost, or mishandled. Aptos assets are objects, perfect for trustless escrow."
                 />
                 <FeatureCard 
                    delay={0.2}
                    icon={Zap}
                    title="High Throughput"
                    description="Jury voting, Vault settlement, and Keycard minting happen nearly instantly. No waiting for confirmations."
                 />
                 <FeatureCard 
                    delay={0.3}
                    icon={Shield}
                    title="Developer-Friendly"
                    description="Move ABI + Aptos SDK support fast integration with dApps, wallets, or L2 identity layers."
                 />
              </div>
           </div>
        </section>

        {/* CTA / Footer */}
        <section className="py-32 relative overflow-hidden text-center border-t border-gray-900">
           <div className="absolute inset-0 bg-gradient-to-b from-aptos-dark to-black z-0"></div>
           
           <div className="container mx-auto px-6 relative z-10">
              <div className="inline-block mb-6">
                 <div className="w-16 h-16 mx-auto border border-aptos-cyan rounded-full flex items-center justify-center mb-6 animate-pulse-slow shadow-[0_0_20px_#00F0FF]">
                    <Logo />
                 </div>
              </div>
              <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tight">THE ROOM IS <span className="text-aptos-cyan">OPEN</span>.</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light">
                 We are building the transparent, trust-driven talent infrastructure for the Aptos ecosystem.
                 <br/>
                 <span className="text-sm text-gray-500 font-mono mt-2 block">Join the whitelist for early access.</span>
              </p>
              
              <WhitelistForm />
           </div>
        </section>

      </main>

      <footer className="bg-black text-gray-500 py-12 border-t border-gray-900 relative">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="scale-75"><Logo /></div>
               <div className="text-white font-bold text-lg font-mono tracking-tighter">APTOS<span className="text-aptos-cyan">ROOM</span></div>
            </div>
            <div className="text-xs font-mono uppercase tracking-widest opacity-50">
                &copy; 2025 AptosRoom. Built on Move.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;