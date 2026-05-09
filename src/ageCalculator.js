// for calculting planets age, sample
document.addEventListener('DOMContentLoaded', () => {
    const ageInput = document.getElementById('age-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const planets = [
        { name: 'Sun', orbitalPeriod: 1, video: 'Sunmp4.mp4' }, // Assuming 1 for Sun
        { name: 'Mercury', orbitalPeriod: 0.24, video: 'Mercurymp4.mp4' },
        { name: 'Venus', orbitalPeriod: 0.62, video: 'Venusmp4.mp4' },
        { name: 'Earth', orbitalPeriod: 1, video: 'Earthmp4.mp4' },
        { name: 'Mars', orbitalPeriod: 1.88, video: 'Marsmp4.mp4' },
        { name: 'Jupiter', orbitalPeriod: 11.86, video: 'fclip1.mp4' }, // Placeholder, assuming available
        { name: 'Saturn', orbitalPeriod: 29.46, video: 'fclip2.mp4' },
        { name: 'Uranus', orbitalPeriod: 84.01, video: 'uranus.mp4' },
        { name: 'Neptune', orbitalPeriod: 164.8, video: 'neptune.mp4' }
    ];

    calculateBtn.addEventListener('click', () => {
        const earthAge = parseFloat(ageInput.value);
        if (isNaN(earthAge) || earthAge <= 0) {
            alert('Please enter a valid age.');
            return;
        }

        planets.forEach((planet, index) => {
            const planetAge = (earthAge / planet.orbitalPeriod).toFixed(2);
            const ageSpan = document.getElementById(`age-${planet.name.toLowerCase()}`);
            if (ageSpan) {
                ageSpan.textContent = `Age on ${planet.name}: ${planetAge} years`;
            }
        });
    });
});