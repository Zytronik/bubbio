export function triggerConfettiAnimation(confettiContainerClass: string): void {
    const container = document.querySelector(confettiContainerClass);
    if (!container) return;

    const createConfetti = (): HTMLElement => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti'; // General class for styling
        confetti.classList.add('confetti-instance'); // Specific class for targeting removal
        confetti.style.setProperty('--confetti-color', `#${Math.floor(Math.random() * 16777215).toString(16)}`);
        confetti.style.setProperty('--confetti-position', Math.random().toString());
        confetti.style.setProperty('--confetti-duration', Math.random().toString());
        confetti.style.setProperty('--confetti-delay', (Math.random() - 0.5).toString());
        return confetti;
    };

    for (let i = 0; i < 100; i++) {
        container.appendChild(createConfetti());
    }

    setTimeout(() => {
        document.querySelectorAll('.confetti-instance').forEach(confetti => {
            confetti.parentNode?.removeChild(confetti);
        });
    }, 3000);
}
