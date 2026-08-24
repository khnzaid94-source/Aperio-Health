import React, { useEffect, useRef } from 'react';

interface EkgMonitorCanvasProps {
    className?: string;
    bpm?: number;
    color?: string;
}

export const EkgMonitorCanvas: React.FC<EkgMonitorCanvasProps> = ({
    className = '',
    bpm = 40,
    color = '#2dd4bf'
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.offsetWidth || 800);
        let height = (canvas.height = canvas.offsetHeight || 200);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth || 800;
            height = canvas.height = canvas.offsetHeight || 200;
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(canvas);

        // Generate synthetic cardiac waveform template (P-Q-R-S-T curve)
        const generateEkgPoint = (phase: number): number => {
            // phase in [0, 1)
            const p = phase % 1.0;

            // Baseline (0)
            if (p < 0.15) return 0;
            // P wave: small positive bump (atrial depolarization)
            if (p < 0.25) {
                const sub = (p - 0.2) / 0.05;
                return 0.12 * Math.exp(-sub * sub * 4);
            }
            // PR segment
            if (p < 0.35) return 0;
            // Q wave: small downward deflection
            if (p < 0.38) {
                return -0.15 * Math.sin(((p - 0.35) / 0.03) * Math.PI);
            }
            // R wave: tall, sharp positive spike (ventricular depolarization)
            if (p < 0.44) {
                const sub = (p - 0.41) / 0.03;
                return 1.15 * Math.exp(-sub * sub * 6);
            }
            // S wave: sharp negative deflection
            if (p < 0.48) {
                return -0.35 * Math.sin(((p - 0.44) / 0.04) * Math.PI);
            }
            // ST segment
            if (p < 0.58) return 0;
            // T wave: smooth ventricular repolarization bump
            if (p < 0.76) {
                const sub = (p - 0.67) / 0.09;
                return 0.28 * Math.exp(-sub * sub * 4);
            }
            // Isoelectric resting baseline before next beat (~60 BPM calm pause)
            return 0;
        };

        let scanX = 0;
        const scanSpeed = 0.9; // Calm scanning cursor sweep
        const history: number[] = new Array(Math.ceil(1200)).fill(0);
        let time = 0;
        const beatDuration = (60 / bpm) * 60; // frames per beat (~60 frames at 60fps)

        const render = () => {
            time++;
            scanX = (scanX + scanSpeed) % width;

            // Calculate new point value based on current cardiac cycle phase
            const phase = (time % beatDuration) / beatDuration;
            const currentVal = generateEkgPoint(phase);
            const index = Math.floor(scanX);
            history[index] = currentVal;

            ctx.clearRect(0, 0, width, height);

            const midY = height * 0.62;
            const amp = height * 0.33;

            // Draw subtle background medical grid lines
            ctx.strokeStyle = 'rgba(45, 212, 191, 0.04)';
            ctx.lineWidth = 1;
            const gridSpacing = 24;
            ctx.beginPath();
            for (let x = 0; x < width; x += gridSpacing) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            for (let y = 0; y < height; y += gridSpacing) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // Draw EKG waveform path
            ctx.lineWidth = 2.2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            // Segment 1: from scanX to 0 (fading trail)
            const gap = 30; // Clear gap ahead of scanning head

            ctx.beginPath();
            let first = true;
            for (let x = 0; x < width; x++) {
                // Skip the gap immediately ahead of scanX
                const distAhead = (x - scanX + width) % width;
                if (distAhead < gap) continue;

                const val = history[x] || 0;
                const y = midY - val * amp;

                if (first) {
                    ctx.moveTo(x, y);
                    first = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }

            // Glow trace
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.55;
            ctx.stroke();

            // Bright scan head dot
            const headY = midY - currentVal * amp;
            ctx.beginPath();
            ctx.arc(scanX, headY, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#5eead4';
            ctx.shadowBlur = 12;
            ctx.globalAlpha = 0.95;
            ctx.fill();

            // Reset shadows
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [bpm, color]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full block ${className}`}
            style={{ pointerEvents: 'none' }}
        />
    );
};
