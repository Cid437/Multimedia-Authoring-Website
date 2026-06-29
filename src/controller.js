(function () {
        var planets = {
            sun:     { orbit:'Center',   video:'../public/videos/sun.mp4',     status:'SUN \u00b7 CENTER',      period:'N/A (Star)',       distance:'0 AU',     type:'G-type Star',      desc:'The Sun is the star at the center of our solar system, providing light and heat to all planets.' },
            mercury: { orbit:'Orbit 01', video:'../public/videos/mercury.mp4', status:'MERCURY \u00b7 ORBIT 01',period:'88 Earth days',    distance:'0.39 AU',  type:'Rocky Planet',     desc:'Mercury is the smallest planet in our solar system and the closest to the Sun.' },
            venus:   { orbit:'Orbit 02', video:'../public/videos/venus.mp4',   status:'VENUS \u00b7 ORBIT 02',  period:'225 Earth days',   distance:'0.72 AU',  type:'Rocky Planet',     desc:'Venus is the second planet from the Sun and the hottest planet in our solar system.' },
            earth:   { orbit:'Orbit 03', video:'../public/videos/earthAndMoon.mp4',   status:'EARTH \u00b7 ORBIT 03',  period:'365.25 days',      distance:'1.00 AU',  type:'Rocky Planet',     desc:'Earth is the third planet from the Sun and the only known celestial body to harbor life.' },
            mars:    { orbit:'Orbit 04', video:'../public/videos/mars.mp4',    status:'MARS \u00b7 ORBIT 04',   period:'687 Earth days',   distance:'1.52 AU',  type:'Rocky Planet',     desc:'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.' },
            jupiter: { orbit:'Orbit 05', video:'../public/videos/jupiterAndMoons.mp4', status:'JUPITER \u00b7 ORBIT 05',period:'11.86 Earth yrs',  distance:'5.20 AU',  type:'Gas Giant',        desc:'Jupiter is the fifth planet from the Sun and the largest in the Solar System.' },
            saturn:  { orbit:'Orbit 06', video:'../public/videos/saturnAndMoons.mp4',  status:'SATURN \u00b7 ORBIT 06', period:'29.46 Earth yrs',  distance:'9.58 AU',  type:'Gas Giant',        desc:'Saturn is the sixth planet from the Sun and the second-largest in the Solar System.' },
            uranus:  { orbit:'Orbit 07', video:'../public/videos/uranus.mp4',  status:'URANUS \u00b7 ORBIT 07', period:'84 Earth yrs',     distance:'19.22 AU', type:'Ice Giant',        desc:'Uranus is the seventh planet from the Sun and the third-largest in the Solar System.' },
            neptune: { orbit:'Orbit 08', video:'../public/videos/neptune.mp4', status:'NEPTUNE \u00b7 ORBIT 08',period:'164.8 Earth yrs',  distance:'30.05 AU', type:'Ice Giant',        desc:'Neptune is the eighth planet from the Sun and the fourth-largest in the Solar System.' },
            pluto:   { orbit:'Orbit 09', video:'../public/videos/pluto.mp4',   status:'PLUTO \u00b7 ORBIT 09',  period:'248 Earth yrs',    distance:'39.48 AU', type:'Dwarf Planet',     desc:'Pluto is the largest known dwarf planet, once considered the ninth planet of the Solar System.' }
        };

        var current = 'sun';

        function selectPlanet(key) {
            if (key === current) return;
            var data = planets[key];
            if (!data) return;
            current = key;

            /* Fade out */
            var video    = document.getElementById('stage-video');
            var stageName = document.getElementById('stage-name');
            var stageDesc = document.getElementById('stage-desc');
            var stageAge  = document.getElementById('stage-age');
            video.classList.add('is-switching');
            stageName.style.opacity = '0';
            stageDesc.style.opacity = '0';
            stageAge.style.opacity  = '0';

            setTimeout(function () {
                /* Swap video */
                document.getElementById('stage-source').src = data.video;
                video.load();

                /* Update text */
                document.getElementById('stage-orbit').textContent    = data.orbit;
                stageName.textContent                                  = key.charAt(0).toUpperCase() + key.slice(1);
                stageDesc.textContent                                  = data.desc;
                document.getElementById('stage-period').textContent   = data.period;
                document.getElementById('stage-distance').textContent = data.distance;
                document.getElementById('stage-type').textContent     = data.type;
                document.getElementById('stage-status').textContent   = data.status;

                /* Sync age if already calculated */
                var ageEl = document.getElementById('age-' + key);
                stageAge.textContent = (ageEl && ageEl.textContent.trim())
                    ? ageEl.textContent.trim()
                    : 'Enter age above';

                /* Fade back in */
                video.classList.remove('is-switching');
                stageName.style.opacity = '1';
                stageDesc.style.opacity = '1';
                stageAge.style.opacity  = '1';
            }, 200);

            /* Update selector */
            document.querySelectorAll('.planet-node').forEach(function (btn) {
                btn.classList.toggle('is-active', btn.dataset.planet === key);
            });
        }

        /* Attach selector clicks */
        document.querySelectorAll('.planet-node').forEach(function (btn) {
            btn.addEventListener('click', function () { selectPlanet(btn.dataset.planet); });
        });

        /* After age calculation, push result into stage display */
        var calcBtn = document.getElementById('calculate-btn');
        if (calcBtn) {
            calcBtn.addEventListener('click', function () {
                setTimeout(function () {
                    var ageEl    = document.getElementById('age-' + current);
                    var stageAge = document.getElementById('stage-age');
                    if (ageEl && ageEl.textContent.trim()) {
                        stageAge.textContent = ageEl.textContent.trim();
                    }
                }, 80);
            });
        }
    })();