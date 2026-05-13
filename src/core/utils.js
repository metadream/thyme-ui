export const ripple = (container, event) => {
    const el = document.createElement('span');
    el.className = 'th-ripple';
    el.setAttribute('aria-hidden', 'true');

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    let cx = event.clientX;
    let cy = event.clientY;
    if (event.touches) {
        cx = event.touches[0].clientX;
        cy = event.touches[0].clientY;
    }

    const x = cx - rect.left - size / 2;
    const y = cy - rect.top - size / 2;

    el.style.width = el.style.height = `${size}px`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    container.appendChild(el);

    el.addEventListener('animationend', () => el.remove());
};
