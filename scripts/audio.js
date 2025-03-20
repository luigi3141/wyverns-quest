// Audio system
class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.context = null;
        this.sounds = {};
        this.music = null;
        this.currentMusic = null;

        // Initialize Web Audio API
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    init() {
        if (!this.enabled) return;

        // Create gain node for volume control
        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.context.destination);
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }
    }

    async loadSound(name, url) {
        if (!this.enabled) return;

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds[name] = audioBuffer;
        } catch (e) {
            console.error(`Error loading sound ${name}:`, e);
        }
    }

    playSound(name) {
        if (!this.enabled || !this.sounds[name]) return;

        const source = this.context.createBufferSource();
        source.buffer = this.sounds[name];
        source.connect(this.gainNode);
        source.start(0);
    }

    async loadMusic(url) {
        if (!this.enabled) return;

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.music = await this.context.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error('Error loading music:', e);
        }
    }

    playMusic(loop = true) {
        if (!this.enabled || !this.music) return;

        // Stop current music if playing
        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        const source = this.context.createBufferSource();
        source.buffer = this.music;
        source.loop = loop;
        source.connect(this.gainNode);
        source.start(0);
        this.currentMusic = source;
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopMusic();
        }
    }
}

// Initialize audio manager
const audioManager = new AudioManager();

// Example sound effects (to be implemented later)
const soundEffects = {
    attack: 'sounds/attack.mp3',
    hit: 'sounds/hit.mp3',
    levelUp: 'sounds/level-up.mp3',
    collect: 'sounds/collect.mp3',
    death: 'sounds/death.mp3'
};

// Initialize audio when document is ready
document.addEventListener('DOMContentLoaded', () => {
    audioManager.init();
    
    // Load sound effects when assets are ready
    // Object.entries(soundEffects).forEach(([name, url]) => {
    //     audioManager.loadSound(name, url);
    // });
});
