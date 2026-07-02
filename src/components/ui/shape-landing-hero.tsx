import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "../../lib/utils";
import { QRCodeSVG } from 'qrcode.react';

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

export function HeroGeometric({
    badge = "Canteen Rush",
    title1 = "Skip the Line.",
    title2 = "Savor the Moment.",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1] as const,
            },
        }),
    };

    return (
        <div className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] via-transparent to-orange-500/[0.05] blur-3xl pointer-events-none" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-amber-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-orange-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-yellow-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-amber-400/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-orange-400/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-16 mt-20">
                <div className="flex-1 text-center md:text-left">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8"
                    >
                        <Circle className="h-2.5 w-2.5 fill-amber-500/80 text-amber-500" />
                        <span className="text-sm text-white/70 font-medium tracking-wide uppercase">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-6xl sm:text-7xl md:text-[90px] leading-[0.9] font-black tracking-tighter mb-8">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 drop-shadow-sm"
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-lg md:text-2xl text-white/50 mb-10 leading-relaxed font-medium max-w-xl mx-auto md:mx-0">
                            Order ahead, track live wait times, and pay instantly with your digital campus wallet.
                        </p>
                    </motion.div>

                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
                    >
                        <a href="#pulse" className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-500 text-slate-950 font-black text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                            Explore Now
                        </a>
                        <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md font-bold text-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                            See How
                        </a>
                    </motion.div>
                </div>

                {/* Floating Scan UI */}
                <motion.div 
                    custom={4}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 w-full max-w-sm hidden lg:block"
                >
                    <div className="relative p-[1px] rounded-[3rem] overflow-hidden bg-gradient-to-br from-amber-500/30 to-orange-500/10 shadow-2xl">
                        <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[3rem] p-10 flex flex-col items-center text-center">
                            <h3 className="text-white text-2xl font-black mb-3">Scan & Launch</h3>
                            <p className="text-white/50 font-medium mb-8">No App Store required.</p>
                            <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                                <QRCodeSVG value={window.location.origin} size={160} level="H" fgColor="#020617" bgColor="#ffffff" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>
    );
}
