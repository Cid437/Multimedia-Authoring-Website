import './style.css';

function attachClickById(id, href) {
    const el = document.getElementById(id);

    if (!el) return;

    el.style.cursor = 'pointer';

    el.addEventListener('click', () => {
        window.location.href = href;
    });
}

attachClickById('roto', './Portfolio/rotoscope.html');
attachClickById('solar', './Portfolio/solarsystem.html');