// for calculting planets age, sample
document.addEventListener('DOMContentLoaded', () => {
    const ageInput = document.getElementById('age-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const planets = [
        { name: 'Sun', orbitalPeriod: 1, video: 'sun.mp4' },
        { name: 'Mercury', orbitalPeriod: 0.24, video: 'mercury.mp4' },
        { name: 'Venus', orbitalPeriod: 0.62, video: 'venus.mp4' },
        { name: 'Earth', orbitalPeriod: 1, video: 'earth.mp4' },
        { name: 'Mars', orbitalPeriod: 1.88, video: 'mars.mp4' },
        { name: 'Jupiter', orbitalPeriod: 11.86, video: 'jupiter.mp4' },
        { name: 'Saturn', orbitalPeriod: 29.46, video: 'saturn.mp4' },
        { name: 'Uranus', orbitalPeriod: 84.01, video: 'uranus.mp4' },
        { name: 'Neptune', orbitalPeriod: 164.8, video: 'neptune.mp4' },
        { name: 'Pluto', orbitalPeriod: 248.0, video: 'pluto.mp4' }
    ];
    // Populate static planet info fields (orbital period, etc.) if present
    planets.forEach((planet) => {
        const key = planet.name.toLowerCase();
        const infoEl = document.getElementById(`info-${key}`);
        if (infoEl) {
            infoEl.textContent = `Orbital period: ${planet.orbitalPeriod} Earth year(s)`;
        }
    });

    if (!calculateBtn || !ageInput) return;

    calculateBtn.addEventListener('click', () => {
        const earthAge = parseFloat(ageInput.value);
        if (isNaN(earthAge) || earthAge <= 0) {
            alert('Please enter a valid age.');
            return;
        }

        planets.forEach((planet) => {
            const planetAge = (earthAge / planet.orbitalPeriod).toFixed(2);
            const ageSpan = document.getElementById(`age-${planet.name.toLowerCase()}`);
            if (ageSpan) {
                ageSpan.textContent = `Age on ${planet.name}: ${planetAge} years`;
            }
        });
    });
});