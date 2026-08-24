"""
Aperio Health — Cardiac EKG Telemetry Waveform Generator & Animator
Uses NumPy and Matplotlib to model and animate realistic human cardiac cycles (P-Q-R-S-T waves)
at a calm resting rhythm (60-70 BPM).
"""

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

def generate_cardiac_cycle(num_samples=200):
    """
    Synthesizes a realistic single P-Q-R-S-T heartbeat wave.
    """
    t = np.linspace(0, 1, num_samples)
    y = np.zeros_like(t)

    # Isoelectric baseline before P wave
    # P wave (atrial depolarization): smooth gentle bump
    p_wave = 0.15 * np.exp(-((t - 0.2) ** 2) / (2 * (0.03 ** 2)))

    # Q wave: small downward deflection
    q_wave = -0.15 * np.exp(-((t - 0.35) ** 2) / (2 * (0.01 ** 2)))

    # R wave: tall, sharp ventricular depolarization spike
    r_wave = 1.2 * np.exp(-((t - 0.40) ** 2) / (2 * (0.015 ** 2)))

    # S wave: sharp downward dip
    s_wave = -0.35 * np.exp(-((t - 0.45) ** 2) / (2 * (0.012 ** 2)))

    # T wave: smooth ventricular repolarization wave
    t_wave = 0.25 * np.exp(-((t - 0.65) ** 2) / (2 * (0.05 ** 2)))

    # Combine waveform components
    y = p_wave + q_wave + r_wave + s_wave + t_wave
    return y

def animate_ekg(duration_sec=10, fps=30, bpm=60):
    """
    Animates a continuous real-time EKG monitor display using Matplotlib.
    """
    total_frames = int(duration_sec * fps)
    samples_per_beat = int((60.0 / bpm) * fps * 5)
    
    single_beat = generate_cardiac_cycle(samples_per_beat)
    full_signal = np.tile(single_beat, int(np.ceil((duration_sec * bpm) / 60.0) + 2))

    fig, ax = plt.subplots(figsize=(10, 3), facecolor='#020617')
    ax.set_facecolor('#020617')
    
    # EKG Grid styling
    ax.grid(True, color='#0f2935', linestyle='-', linewidth=0.6, alpha=0.7)
    ax.set_xlim(0, 300)
    ax.set_ylim(-0.6, 1.5)
    ax.axis('off')

    line, = ax.plot([], [], color='#2dd4bf', linewidth=2.0, alpha=0.9)
    glow_line, = ax.plot([], [], color='#14b8a6', linewidth=4.5, alpha=0.3)
    dot, = ax.plot([], [], 'o', color='#5eead4', markersize=6)

    window_size = 300
    y_data = []

    def init():
        line.set_data([], [])
        glow_line.set_data([], [])
        dot.set_data([], [])
        return line, glow_line, dot

    def update(frame):
        idx = int(frame * 6) % (len(full_signal) - window_size)
        segment = full_signal[idx : idx + window_size]
        x_data = np.arange(len(segment))
        
        line.set_data(x_data, segment)
        glow_line.set_data(x_data, segment)
        if len(segment) > 0:
            dot.set_data([x_data[-1]], [segment[-1]])
        return line, glow_line, dot

    anim = animation.FuncAnimation(
        fig, update, init_func=init, frames=total_frames, interval=1000/fps, blit=True
    )

    return fig, anim

if __name__ == "__main__":
    print("Generating calm EKG telemetry display...")
    fig, anim = animate_ekg(duration_sec=5, fps=30, bpm=60)
    plt.show()
