/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * APP.TSX - Divyesh Panwar for IT Head Campaign App
 * Styled in high-contrast Neo-Brutalism (Cyan, Yellow, Pink, Black, White).
 * Pure monospace font, solid border-4 border-black, thick offset shadows.
 * Features 4 explicit states: WARNING, BOOTLOADER, CONFIGURATOR, CHAOS.
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal as TerminalIcon, 
  Cpu, 
  AlertTriangle, 
  Check, 
  RotateCcw, 
  Wifi, 
  Tv, 
  Cable, 
  ShieldAlert, 
  Wrench, 
  Volume2,
  VolumeX,
  ExternalLink
} from "lucide-react";

// --- Game/Flow States ---
type AppState = "WARNING" | "BOOTLOADER" | "CONFIGURATOR" | "CHAOS";

// --- Types ---
interface Toast {
  id: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
}

interface LogLine {
  time: string;
  module: string;
  message: string;
}

export default function App() {
  const [gameState, setGameState] = useState<AppState>("WARNING");
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [bootStatus, setBootStatus] = useState<string>("Initializing kernels...");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // --- Checkbox state (STATE_CONFIGURATOR) ---
  const [selections, setSelections] = useState({
    knowsTech: true,
    cableCrimping: true,
    zeroLatency: true,
    nonJudgmentalSysadmin: true,
  });

  // --- Campaign Stats ---
  const [divyeshVotes, setDivyeshVotes] = useState<number>(45);
  const [statusQuo, setStatusQuo] = useState<number>(13);
  const [isSudoVoted, setIsSudoVoted] = useState<boolean>(false);

  // --- Terminal Emulator ---
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Welcome to DIVYESH_OS v2.1 Terminal Console.",
    "Type 'help' to list available maintenance scripts.",
    "------------------------------------------------"
  ]);
  const [terminalInput, setTerminalInput] = useState<string>("");
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // --- Floating Toasts ---
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Confetti / Chaos Overlay ---
  const [confettiPieces, setConfettiPieces] = useState<Array<{ x: number; y: number; color: string; size: number; delay: number }>>([]);
  const [telemetrySaving, setTelemetrySaving] = useState<boolean>(false);
  const [telemetryResult, setTelemetryResult] = useState<any>(null);

  // --- Retro Sound Synthesizer (Web Audio API) ---
  const playSound = (type: "click" | "success" | "alarm" | "error" | "coin") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "coin") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "success") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === "alarm") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("Web Audio API not permitted by browser sandbox policies.");
    }
  };

  // --- Push Sarcastic Toast Alert ---
  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- Scroll elements ---
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // --- Bootloader Sequence ---
  useEffect(() => {
    if (gameState !== "BOOTLOADER") return;

    setBootProgress(0);
    playSound("click");

    const bootLogs = [
      { p: 25, msg: "Loading Divyesh.exe..." },
      { p: 50, msg: "> Bypassing Vardhman International School firewall..." },
      { p: 75, msg: "Injecting satirical payload into student mainframe..." },
      { p: 100, msg: "DIVYESH_OS loaded successfully in safe mode." }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < bootLogs.length) {
        const step = bootLogs[currentStepIndex];
        setBootProgress(step.p);
        setBootStatus(step.msg);
        playSound("click");
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setGameState("CONFIGURATOR");
          addToast("Sysadmin control panel initialized.", "success");
          playSound("success");
        }, 100);
      }
    }, 375);

    return () => clearInterval(interval);
  }, [gameState]);

  // --- Sarcastic Override for Checkboxes (Illusion of Choice) ---
  const handleCheckboxChange = (key: keyof typeof selections) => {
    playSound("alarm");
    addToast(`Critical override triggered. Re-enabling optimal preset...`, "warning");
    
    // Temporarily uncheck
    setSelections((prev) => ({ ...prev, [key]: false }));

    // Automatically check it back immediately via setTimeout
    setTimeout(() => {
      setSelections((prev) => ({ ...prev, [key]: true }));
      playSound("success");
      addToast(`Checked: ${(key as string).replace(/([A-Z])/g, " $1")} locked in for stability.`, "info");
    }, 300);
  };

  // --- CLI Terminal Input Execution ---
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, `> ${terminalInput}`];
    playSound("click");

    switch (cmd) {
      case "help":
        newHistory.push(
          "Available terminal tasks:",
          "  whoami       - Probe running IT Head payload identities.",
          "  ping         - Test current router latency in millisecond arrays.",
          "  sudo_vote    - Grant immediate administrative root-access vote.",
          "  vga_fix      - Diagnose smartboard red/green/blue alignment matrix.",
          "  clear        - Flush standard out buffers."
        );
        break;
      case "whoami":
        newHistory.push("DIVYESH_PANWAR (candidate_it_head.exe). Standard local shell interface.");
        break;
      case "ping":
        newHistory.push(
          "PING campaign.divyesh (127.0.0.1) 56(84) bytes of data.",
          "64 bytes from 127.0.0.1: icmp_seq=1 ttl=128 time=0.032ms",
          "64 bytes from 127.0.0.1: icmp_seq=2 ttl=128 time=0.041ms",
          "--- campaign.divyesh ping statistics ---",
          "2 packets transmitted, 2 received, 0% packet loss, time 1001ms",
          "rtt min/avg/max/mdev = 0.032/0.036/0.041/0.005 ms (STABLE LATENCY)"
        );
        break;
      case "vga_fix":
        newHistory.push(
          "[SYS] Initiating physical projector correction matrix...",
          "  [STEP 1] Adjusting pin-12 bent copper core... FIXED.",
          "  [STEP 2] Correcting chromatic green shift... COMPLETE.",
          "  [STEP 3] aspect_ratio forced from 4:3 to optimal 16:9 widescreen.",
          "[SYS] Display buffer restored. Room 302 projector color inversion neutralized."
        );
        break;
      case "sudo_vote":
        if (isSudoVoted) {
          newHistory.push("Error: User already has administrative root state logged. Double voting blocked by checksum.");
          addToast("Double voting denied by network checksum.", "error");
          playSound("error");
        } else {
          setIsSudoVoted(true);
          setDivyeshVotes((prev) => prev + 1);
          newHistory.push("SUCCESS: Divyesh vote state modified. Index updated to " + (divyeshVotes + 1) + ".");
          addToast("Vote incremented with administrative privilege (sudo_vote.sh).", "success");
          playSound("coin");
        }
        break;
      case "clear":
        setTerminalHistory(["Terminal buffer cleared. Divyesh is ready."]);
        setTerminalInput("");
        return;
      default:
        newHistory.push(`Command not found: '${cmd}'. Type 'help' to review manual configurations.`);
        playSound("error");
    }

    setTerminalHistory(newHistory);
    setTerminalInput("");
  };

  // --- Subnet Spoofer Widget ---
  const [spoofedIPs, setSpoofedIPs] = useState<string[]>([]);
  const [spooferSpeed, setSpooferSpeed] = useState<number>(2000);
  const [isSpooferOverclocked, setIsSpooferOverclocked] = useState<boolean>(false);
  const spooferBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const generateIP = () => `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const newIP = generateIP();
      setSpoofedIPs((prev) => {
        const next = [...prev, `${newIP} - Vardhman Mainframe Reroute: Active`];
        return next.slice(-8); // Keep the last 8 entries
      });
    }, spooferSpeed);
    return () => clearInterval(interval);
  }, [spooferSpeed]);

  const handleSpooferClick = () => {
    setSpooferSpeed((prev) => Math.max(prev / 2, 100));
    setIsSpooferOverclocked(true);
    playSound("click");
    setTimeout(() => {
      setIsSpooferOverclocked(false);
    }, 500);
  };

  // --- Final Trigger Payload (STATE_CHAOS) ---
  const [deployClickCount, setDeployClickCount] = useState<number>(0);
  const deployTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDeployCampaign = async () => {
    const newCount = deployClickCount + 1;
    setDeployClickCount(newCount);

    if (newCount > 3) {
      if (deployTimeoutRef.current) {
        clearTimeout(deployTimeoutRef.current);
      }
      window.alert("CRITICAL ERROR: You can only vote once. Stop clicking and go to class.");
      setDeployClickCount(0); // reset
      return;
    }

    if (newCount === 1) {
      playSound("click");
      deployTimeoutRef.current = setTimeout(() => {
        // Proceed with deploy
        playSound("success");
        setGameState("CHAOS");
        setTelemetrySaving(true);
        setDeployClickCount(0);

        // Simulated payload injection
        setTimeout(() => {
          console.log("[SYS_SUCCESS] Telemetry successfully injected via setTimeout handshake.");
          addToast("Local DB overridden! Storing telemetry in safe offline RAM.", "success");
          setTelemetryResult({ meta: { savedIn: "RAM_Buffer (Bypassed)" } });
          setTelemetrySaving(false);
          
          // Generate confetti details
          const colors = ["#22d3ee", "#fbbf24", "#ec4899", "#ffffff", "#000000"];
          const pieces = Array.from({ length: 80 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * -50,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 15 + 8,
            delay: Math.random() * 2,
          }));
          setConfettiPieces(pieces);

          // Continuous funny alarms/sounds during victory payload
          const sequence = ["coin", "success", "coin"];
          sequence.forEach((sound, index) => {
            setTimeout(() => {
              playSound(sound as any);
              addToast(`[PAYLOAD] Executing system override sequence...`, "info");
            }, index * 800);
          });
        }, 1500);
      }, 500);
    }
  };

  const resetCycle = () => {
    playSound("success");
    setGameState("WARNING");
    setIsSudoVoted(false);
    setDivyeshVotes(45);
    setConfettiPieces([]);
    setTelemetryResult(null);
    setTerminalHistory([
      "Welcome to DIVYESH_OS v2.1 Terminal Console.",
      "Type 'help' to list available maintenance scripts.",
      "------------------------------------------------"
    ]);
  };

  return (
    <div className="min-h-screen scanlines bg-[#22d3ee] flex flex-col justify-between select-none relative overflow-x-hidden p-4 md:p-8 border-4 md:border-[12px] border-black max-w-[100vw]">
      
      {/* Toast Alert Drawer */}
      <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`p-3 border-4 border-black font-mono text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                toast.type === "success" ? "bg-cyan-300" :
                toast.type === "warning" ? "bg-yellow-300" :
                toast.type === "error" ? "bg-pink-400 text-white" :
                "bg-white"
              }`}
            >
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{toast.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header Bar */}
      <header id="app-header" className="w-full max-w-6xl mx-auto bg-yellow-400 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-black text-yellow-300 p-2 font-bold border-2 border-black flex items-center justify-center">
            <Cpu className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter">DIVYESH_PANWAR.EXE // IT_HEAD_V2.1</h1>
            <p className="text-xs uppercase font-bold text-neutral-800">Student Council IT Head Run-time Target</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button 
            id="sound-toggle-btn"
            onClick={() => { setSoundEnabled(!soundEnabled); playSound("click"); }}
            className="p-2 border-2 border-black bg-white hover:bg-neutral-100 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            title="Toggle Retro Synthesized Bleeps"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-black" /> : <VolumeX className="h-4 w-4 text-neutral-500" />}
          </button>

          <span className="bg-black text-white px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-black">
            STATE: CONFIGURATOR_V2.1
          </span>
        </div>
      </header>

      {/* Main Campaign Layout (Varying on States) */}
      <main className="flex-grow w-full max-w-6xl mx-auto flex flex-col justify-center items-center">
        
        {/* ========================================================
            STATE_WARNING: The Gateway Security Alert
            ======================================================== */}
        {gameState === "WARNING" && (
          <motion.div 
            id="state-warning-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl bg-pink-400 border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black"
          >
            <div className="flex justify-center mb-6 text-yellow-300">
              <ShieldAlert className="h-20 w-20 stroke-[2] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-bounce" />
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold uppercase text-center tracking-tight mb-4 border-b-4 border-black pb-4">
              ⚠️ SYSTEM ALERT ⚠️
            </h2>

            <div className="space-y-4 font-mono text-sm md:text-base leading-relaxed bg-white border-2 border-black p-4 mb-6">
              <p className="font-bold text-red-600">
                [ALERT] You scanned this QR voluntarily. No system coercion detected.
              </p>
              <p>
                We have detected that your student device is running on an unoptimized IT environment. By interacting with this political binary, you consent to downloading:
              </p>
              <div className="bg-neutral-100 p-2 border border-dashed border-black font-mono text-xs space-y-1">
                <div>&gt; Name: Divyesh_Panwar_Campaign_Daemon</div>
                <div>&gt; Target: Student Council IT Head Office</div>
                <div>&gt; Scope: Fixed Projectors, 40ms Low Latency, Printer Restorations</div>
                <div>&gt; License: Apache-2.0 Sarcastic Sublicense</div>
              </div>
              <p className="text-xs text-neutral-600">
                Warning: Continuing will subject you to hyper-specific network architecture jokes, actual working terminal interfaces, and uncompromised election transparency.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <button
                id="btn-warning-enter"
                onClick={() => { playSound("success"); setGameState("BOOTLOADER"); }}
                className="w-full py-4 bg-yellow-300 hover:bg-yellow-400 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono font-bold text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider"
              >
                ENTER AT YOUR OWN RISK
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            STATE_BOOTLOADER: Terminal Load Screens
            ======================================================== */}
        {gameState === "BOOTLOADER" && (
          <motion.div 
            id="state-bootloader-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl bg-black text-cyan-300 border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] font-mono"
          >
            <div className="flex justify-between items-center border-b-2 border-neutral-800 pb-2 mb-4 text-xs text-neutral-500">
              <span>DIVYESH_BOOT_MATRIX.SH</span>
              <span className="animate-pulse">BOOTING...</span>
            </div>

            <div className="h-48 overflow-y-auto mb-6 text-xs md:text-sm space-y-2">
              <div className="text-neutral-400">[SYSTEM BIOS] ACPI: Core ACPI support initialized.</div>
              <div className="text-neutral-400">[SYSTEM BIOS] CPU: 4x Divyesh Intelligence Solder-Cores detected.</div>
              <div className="text-yellow-400">Loading Divyesh.exe...</div>
              <div className="text-cyan-400 font-bold">{bootStatus}</div>
            </div>

            {/* Neo-brutalist Progress Bar */}
            <div className="w-full border-4 border-black bg-neutral-900 h-8 p-1 relative flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div 
                className="bg-cyan-300 h-full border-2 border-black transition-all duration-300"
                style={{ width: `${bootProgress}%` }}
              />
              <span className="absolute right-3 text-xs font-black text-white mix-blend-difference">
                {bootProgress}%
              </span>
            </div>
          </motion.div>
        )}

        {/* ========================================================
            STATE_CONFIGURATOR: The Campaign Bento Hub
            ======================================================== */}
        {gameState === "CONFIGURATOR" && (
          <div id="state-configurator-grid" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
            
            {/* Left Bento: Stats and Platform Checklist */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Campaign State Box */}
              <div id="panel-stats" className="bg-yellow-400 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-0.5 border-2 border-black uppercase font-bold">
                  Telemetry ID v2.1
                </div>
                <h3 className="text-lg font-black uppercase mb-3 text-black">POLL DATABASE ENGINE // TELEMETRY</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border-4 border-black p-3 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-xs uppercase font-bold text-neutral-500">DIVYESH.EXE</div>
                    <div className="text-3xl font-black text-black">{divyeshVotes}</div>
                    <div className="text-[10px] uppercase font-bold text-cyan-600">Solder votes</div>
                  </div>
                  <div className="bg-neutral-100 border-4 border-black p-3 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-xs uppercase font-bold text-neutral-500">STATUS QUO</div>
                    <div className="text-3xl font-black text-neutral-500">{statusQuo}</div>
                    <div className="text-[10px] uppercase font-bold text-neutral-500">High Latency</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    id="btn-sudo-vote"
                    onClick={() => {
                      if (!isSudoVoted) {
                        setIsSudoVoted(true);
                        setDivyeshVotes((prev) => prev + 1);
                        addToast("Sudo authorization validated. Vote successfully written.", "success");
                        playSound("coin");
                      } else {
                        addToast("Security warning: You already voted.", "error");
                        playSound("error");
                      }
                    }}
                    className={`flex-1 py-2 font-mono font-bold border-4 border-black text-sm uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                      isSudoVoted ? "bg-neutral-300 text-neutral-500 cursor-not-allowed" : "bg-white hover:bg-neutral-50"
                    }`}
                  >
                    {isSudoVoted ? "✓ SUDO VOTE COMPLETED" : "⚡ SUDO VOTE DIVYESH"}
                  </button>
                </div>
              </div>

              {/* platform / Platform Checkboxes */}
              <div id="panel-checklist" className="bg-white border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                  <Wrench className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-black uppercase tracking-wide">BUILD YOUR IDEAL IT HEAD</h3>
                </div>
                <p className="text-xs text-neutral-500 mb-4 font-semibold uppercase">
                  NOTE: Selection is mandatory. Deselection is forbidden by the campaign kernel.
                </p>

                <div className="space-y-4">
                  
                  {/* Checkbox 1 */}
                  <div 
                    onClick={() => handleCheckboxChange("knowsTech")}
                    className={`flex items-center gap-4 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none transition-all ${selections.knowsTech ? 'bg-pink-100' : 'bg-white'}`}
                  >
                    <div className="w-8 h-8 shrink-0 border-4 border-black bg-black flex items-center justify-center">
                      {selections.knowsTech ? (
                        <div className="w-4 h-4 bg-yellow-400"></div>
                      ) : (
                        <div className="w-4 h-4 bg-transparent"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase">Tech competent candidate</div>
                      <div className="text-[11px] text-neutral-800 leading-normal font-semibold">
                        Not someone who asks where the power button is on the desktop.
                      </div>
                    </div>
                  </div>

                  {/* Checkbox 2 */}
                  <div 
                    onClick={() => handleCheckboxChange("cableCrimping")}
                    className={`flex items-center gap-4 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none transition-all ${selections.cableCrimping ? 'bg-pink-100' : 'bg-white'}`}
                  >
                    <div className="w-8 h-8 shrink-0 border-4 border-black bg-black flex items-center justify-center">
                      {selections.cableCrimping ? (
                        <div className="w-4 h-4 bg-yellow-400"></div>
                      ) : (
                        <div className="w-4 h-4 bg-transparent"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase">Widescreen Projector Wizard</div>
                      <div className="text-[11px] text-neutral-800 leading-normal font-semibold">
                        Identifies room 302 HDMI and VGA cable twist metrics on the first iteration.
                      </div>
                    </div>
                  </div>

                  {/* Checkbox 3 */}
                  <div 
                    onClick={() => handleCheckboxChange("zeroLatency")}
                    className={`flex items-center gap-4 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none transition-all ${selections.zeroLatency ? 'bg-pink-100' : 'bg-white'}`}
                  >
                    <div className="w-8 h-8 shrink-0 border-4 border-black bg-black flex items-center justify-center">
                      {selections.zeroLatency ? (
                        <div className="w-4 h-4 bg-yellow-400"></div>
                      ) : (
                        <div className="w-4 h-4 bg-transparent"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase">Zero Latency Campaign</div>
                      <div className="text-[11px] text-neutral-800 leading-normal font-semibold">
                        Switches local routers to prioritize network packet rates over study hall scrolling.
                      </div>
                    </div>
                  </div>

                  {/* Checkbox 4 */}
                  <div 
                    onClick={() => handleCheckboxChange("nonJudgmentalSysadmin")}
                    className={`flex items-center gap-4 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none transition-all ${selections.nonJudgmentalSysadmin ? 'bg-pink-100' : 'bg-white'}`}
                  >
                    <div className="w-8 h-8 shrink-0 border-4 border-black bg-black flex items-center justify-center">
                      {selections.nonJudgmentalSysadmin ? (
                        <div className="w-4 h-4 bg-yellow-400"></div>
                      ) : (
                        <div className="w-4 h-4 bg-transparent"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase">Privacy Preserving Sysadmin</div>
                      <div className="text-[11px] text-neutral-800 leading-normal font-semibold">
                        Will not look at, judge, or export your search history records.
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-6">
                  <button
                    id="btn-generate-it-head"
                    onClick={handleDeployCampaign}
                    className="w-full bg-pink-500 text-white text-3xl font-black py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-tighter"
                  >
                    GENERATE_LEADER.SH
                  </button>
                </div>
              </div>

            </div>

            {/* Right Bento: Local Subnet Spoofer & Custom Terminal Emulator */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Local Subnet Spoofer Widget */}
              <div 
                id="panel-subnet-spoofer" 
                onClick={handleSpooferClick}
                className="bg-black border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[350px] cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3 border-b-2 border-neutral-800 pb-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase text-cyan-400">LOCAL SUBNET SPOOFER</span>
                  </div>
                  <span className={`text-[10px] px-1.5 font-bold uppercase border ${isSpooferOverclocked ? 'bg-pink-600 text-white border-pink-500 animate-pulse' : 'bg-cyan-900 text-cyan-300 border-cyan-700'}`}>
                    {isSpooferOverclocked ? 'OVERCLOCKING REROUTE...' : 'STATUS: ACTIVE'}
                  </span>
                </div>

                {/* Spoofer Output */}
                <div className="flex-grow overflow-y-auto font-mono text-[10px] p-2 space-y-2 mb-2">
                  {spoofedIPs.map((ip, index) => (
                    <div key={index} className="text-green-400 flex gap-2">
                      <span className="text-pink-500 shrink-0">&gt;&gt;</span>
                      <span className="break-all">{ip}</span>
                    </div>
                  ))}
                  <div ref={spooferBottomRef} />
                </div>

                <div className="border-t-2 border-neutral-800 pt-2 text-center text-[10px] text-neutral-500 uppercase font-bold">
                  {isSpooferOverclocked ? (
                    <span className="text-pink-500 animate-pulse">[OVERCLOCKING REROUTE...]</span>
                  ) : (
                    "Bypassing local school firewalls... (Click to Overclock)"
                  )}
                </div>
              </div>

              {/* Neo-brutalist Interactive CLI Shell Terminal */}
              <div id="panel-cli-terminal" className="bg-black text-yellow-300 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[300px]">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <TerminalIcon className="h-3 w-3" />
                    <span>SHELL: DIVYESH_OS_DASHBOARD</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-black" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black" />
                  </div>
                </div>

                {/* History */}
                <div className="flex-grow overflow-y-auto text-[10px] space-y-1.5 p-1 font-mono max-h-[190px]">
                  {terminalHistory.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap leading-normal">
                      {line}
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>

                {/* Inline shortcuts to let users easily interact */}
                <div className="mt-2 flex flex-wrap gap-1.5 border-t border-neutral-800 pt-2">
                  <button
                    onClick={() => { setTerminalInput("whoami"); }}
                    className="px-1.5 py-0.5 bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-700 text-[10px] uppercase"
                  >
                    whoami
                  </button>
                  <button
                    onClick={() => { setTerminalInput("ping"); }}
                    className="px-1.5 py-0.5 bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-700 text-[10px] uppercase"
                  >
                    ping
                  </button>
                  <button
                    onClick={() => { setTerminalInput("sudo_vote"); }}
                    className="px-1.5 py-0.5 bg-neutral-900 text-yellow-400 hover:text-white border border-neutral-700 text-[10px] uppercase"
                  >
                    sudo_vote
                  </button>
                  <button
                    onClick={() => { setTerminalInput("vga_fix"); }}
                    className="px-1.5 py-0.5 bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-700 text-[10px] uppercase"
                  >
                    fix vga
                  </button>
                </div>

                {/* Console Command Input */}
                <form onSubmit={handleTerminalSubmit} className="mt-2 flex items-center">
                  <span className="text-yellow-400 font-bold mr-1.5">&gt;</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type command ('help')..."
                    className="flex-grow bg-transparent text-yellow-300 border-none outline-none font-mono text-[11px] focus:ring-0"
                  />
                  <button type="submit" className="hidden" />
                </form>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            STATE_CHAOS: The Payload Victory Screen
            ======================================================== */}
        {gameState === "CHAOS" && (
          <motion.div 
            id="state-chaos-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-yellow-300 border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black relative"
          >
            {/* Custom Confetti Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiPieces.map((piece, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${piece.x}%`,
                    top: `${piece.y}%`,
                    width: `${piece.size}px`,
                    height: `${piece.size}px`,
                    backgroundColor: piece.color,
                    border: "2px solid black",
                    animation: `fall 3s linear infinite`,
                    animationDelay: `${piece.delay}s`,
                    transform: "rotate(45deg)",
                  }}
                />
              ))}
            </div>

            <div className="flex justify-center mb-6 text-black">
              <Cpu className="h-20 w-20 stroke-[2] drop-shadow-[4px_4px_0px_rgba(255,255,255,1)] animate-spin" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-center uppercase tracking-tighter mb-4 glitch-header select-text">
              DIVYESH FOUND.
            </h2>

            <div className="bg-white border-4 border-black p-4 mb-6 font-mono text-xs md:text-sm space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold uppercase text-pink-600">
                [SYSTEM] Payload: DIVYESH.EXE successfully injected into Student Council candidate array.
              </p>
              
              <div className="bg-neutral-50 p-2 border border-black space-y-1.5">
                <div className="font-bold border-b pb-1 text-black">TELEMETRY REGISTRY REPORT:</div>
                <div>Status Code: <span className="font-bold text-cyan-600">200 OK</span></div>
                <div>Candidate: <span className="font-bold text-cyan-600">DIVYESH.EXE</span></div>
                <div>Config Preset: <span className="text-green-600">OPTIMAL</span></div>
                {telemetrySaving ? (
                  <div className="animate-pulse">Dispatching packet stream to cluster...</div>
                ) : (
                  <div>Database sync: <span className="font-bold text-green-600">{telemetryResult?.meta?.savedIn || "Saved in RAM"}</span></div>
                )}
                <div>IP telemetry: <span className="text-xs text-neutral-500">Captured and logged into campaign logs.</span></div>
              </div>

              <div className="border-t border-black pt-2 space-y-2 text-[11px] text-neutral-600">
                <p>✓ Status: Campaign payload active in background loop.</p>
                <p>✓ Active Platform: Sarcastic copyscripts compiled on host successfully.</p>
                <p>✓ Current Latency: 0.04ms loopback latency maintained.</p>
              </div>
            </div>

            {/* floating absolute style labels */}
            <div className="absolute -top-3 -left-3 bg-pink-500 text-white font-mono font-black text-xs px-2 py-1 border-2 border-black rotate-[-4deg]">
              VIBE CHECK: PASSED
            </div>
            <div className="absolute -bottom-3 -right-3 bg-cyan-400 text-black font-mono font-black text-xs px-2 py-1 border-2 border-black rotate-[3deg]">
              ROUTER STABILITY: 100%
            </div>

            <div className="flex gap-4">
              <button
                id="btn-restart-lifecycle"
                onClick={resetCycle}
                className="flex-1 py-3 bg-white hover:bg-neutral-100 active:translate-y-0.5 transition-all font-mono font-bold text-sm border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase"
              >
                RESTART POLITICAL LIFECYCLE
              </button>
            </div>
          </motion.div>
        )}

      </main>

      {/* Footer System Syslog Feed */}
      <footer id="app-footer" className="w-full max-w-6xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-stretch gap-4 bg-black text-green-400 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex-grow font-mono text-[10px] md:text-[11px]">
          <div className="flex items-center gap-2 mb-2 border-b border-neutral-800 pb-1 justify-between">
            <span className="text-neutral-500 uppercase font-black">Campaign Syslog Server (stdout) // BUILD: 2026.06.28</span>
            <span className="text-neutral-500 uppercase font-bold bg-white text-black px-1.5 py-0.5 border border-black text-[9px] md:text-[10px]">NO SLAY DETECTED // ONLY STACK TRACES</span>
          </div>
          <div className="space-y-1 select-text">
            <div>[09:24:12] [PRINTER_SPOOLER] Teachers room printer jammed with 400 pages of 'Test Page'. Divyesh unblocked it using a custom bash script. Status: RESTORED.</div>
            <div>[10:15:32] [DHCP_POOL] Classroom 302 IP exhaustion solved. Switched DNS resolver to 1.1.1.1. Classroom now loading YouTube 4% faster.</div>
            <div>[11:00:00] [VGA_DIAGNOSTICS] Smartboard display was magenta. Adjusted cable pin 12. Normal color spectrum restored.</div>
          </div>
        </div>
        
        {/* Decorative blocks from the High Density theme! */}
        <div className="flex md:flex-col justify-center gap-3 shrink-0 self-center">
          <div className="w-10 h-10 bg-[#22d3ee] border-4 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
          <div className="w-10 h-10 bg-pink-500 border-4 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
          <div className="w-10 h-10 bg-yellow-400 border-4 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
        </div>
      </footer>

      {/* CSS Keyframe Animation inject */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
