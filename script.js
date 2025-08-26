document.addEventListener('DOMContentLoaded', function() {
    const friendBtn = document.getElementById('friendBtn');
    const enemyBtn = document.getElementById('enemyBtn');
    const responseFrame = document.getElementById('responseFrame');
    const responseText = document.getElementById('responseText');
    const resetBtn = document.getElementById('resetBtn');
    const battleMusic = document.getElementById('battleMusic');
    
    // Create Web Audio API context for better battle music
    let audioContext;
    let oscillator;
    let gainNode;
    let isPlayingBattleMusic = false;

    // Initialize audio context on first user interaction
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Create epic battle music using Web Audio API
    function createBattleMusic() {
        if (audioContext && !isPlayingBattleMusic) {
            isPlayingBattleMusic = true;
            
            // Create oscillator for epic battle theme
            oscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Epic battle music sequence
            const notes = [
                { freq: 220, duration: 0.3 }, // A3
                { freq: 246.94, duration: 0.3 }, // B3
                { freq: 277.18, duration: 0.3 }, // C#4
                { freq: 311.13, duration: 0.3 }, // D#4
                { freq: 349.23, duration: 0.6 }, // F4
                { freq: 311.13, duration: 0.3 }, // D#4
                { freq: 277.18, duration: 0.3 }, // C#4
                { freq: 246.94, duration: 0.3 }, // B3
                { freq: 220, duration: 0.6 }, // A3
            ];
            
            let currentTime = audioContext.currentTime;
            
            function playSequence() {
                if (!isPlayingBattleMusic) return;
                
                notes.forEach((note, index) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.frequency.setValueAtTime(note.freq, currentTime);
                    osc.type = 'square'; // More aggressive sound
                    
                    gain.gain.setValueAtTime(0, currentTime);
                    gain.gain.linearRampToValueAtTime(0.1, currentTime + 0.01);
                    gain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
                    
                    osc.start(currentTime);
                    osc.stop(currentTime + note.duration);
                    
                    currentTime += note.duration;
                });
                
                // Loop the battle music
                setTimeout(() => {
                    if (isPlayingBattleMusic) {
                        currentTime = audioContext.currentTime;
                        playSequence();
                    }
                }, notes.reduce((sum, note) => sum + note.duration, 0) * 1000);
            }
            
            playSequence();
        }
    }

    function stopBattleMusic() {
        isPlayingBattleMusic = false;
        if (oscillator) {
            try {
                oscillator.stop();
            } catch (e) {
                // Oscillator might already be stopped
            }
        }
        if (battleMusic) {
            battleMusic.pause();
            battleMusic.currentTime = 0;
        }
    }

    function showResponse(message, type) {
        responseText.innerHTML = message;
        responseFrame.className = `response-frame show ${type}-response`;
        responseFrame.classList.remove('hidden');
        
        // Add entrance animation
        setTimeout(() => {
            responseFrame.style.transform = 'translateY(0)';
            responseFrame.style.opacity = '1';
        }, 50);
    }

    function hideResponse() {
        responseFrame.style.transform = 'translateY(20px)';
        responseFrame.style.opacity = '0';
        
        setTimeout(() => {
            responseFrame.classList.add('hidden');
            responseFrame.className = 'response-frame hidden';
        }, 300);
    }

    friendBtn.addEventListener('click', function() {
        initAudioContext();
        stopBattleMusic();
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        showResponse('🌟 I would love to be friends! 🌟', 'friend');
    });

    enemyBtn.addEventListener('click', function() {
        initAudioContext();
        
        // Add dramatic click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        showResponse(
            '⚔️ Fine, you wanted this.<br>' +
            'Here forth, we shall be enemies! ⚔️<br>' +
            '<em style="font-size: 0.9em; opacity: 0.8;">🎵 Epic battle music engaged! 🎵</em>',
            'enemy'
        );
        
        // Start epic battle music after a short delay
        setTimeout(() => {
            createBattleMusic();
            // Also try to play the audio file as backup
            if (battleMusic) {
                battleMusic.play().catch(e => {
                    console.log('Audio autoplay blocked, using Web Audio API instead');
                });
            }
        }, 500);
    });

    resetBtn.addEventListener('click', function() {
        stopBattleMusic();
        hideResponse();
        
        // Add reset animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });

    // Stop music if user navigates away
    window.addEventListener('beforeunload', function() {
        stopBattleMusic();
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopBattleMusic();
        }
    });
});