(function () {
    const LOCAL_JSON = './gameSort.json';

    // Array for Games
    let games = [];

    // DOM refs
    const listEl = document.getElementById('gameSort');
    const byNameBtn = document.querySelector('.by-name');
    const byOrderBtn = document.querySelector('.by-order');
    const byRatingBtn = document.querySelector('.by-rating');

    // Image container
    const imageContainer = document.getElementById('imageContainer');

    // If image is missing
    const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x250.png?text=No+Image';

    // Fix URL mistakes
    function normalizeUrl(u) {
        if (!u || typeof u !== 'string') return null;
        let s = u.trim();
        // protocol-relative -> https
        if (s.startsWith('//')) s = 'https:' + s;
        // add https for bare 'www.example...'
        if (/^www\./i.test(s)) s = 'https://' + s;
        // convert github blob -> raw.githubusercontent
        // https://github.com/user/repo/blob/branch/path/to/file.png
        // -> https://raw.githubusercontent.com/user/repo/branch/path/to/file.png
        const blobMatch = s.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/i);
        if (blobMatch) {
            const user = blobMatch[1], repo = blobMatch[2], branch = blobMatch[3], path = blobMatch[4];
            s = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
        }
        // encode spaces
        s = s.replace(/ /g, '%20');
        return s;
    }

    // Sort by app name
    // Resource Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    fetch(LOCAL_JSON)
        .then(r => { if (!r.ok) throw new Error('Could not fetch'); return r.json(); })
        .then(data => {
            games = Array.isArray(data.gameSort) ? data.gameSort.slice() : (Array.isArray(data) ? data.slice() : []);
        })
        .catch(err => console.error('Fetch error:', err));

    function renderGameDetails(gamesList) {
        imageContainer.innerHTML = ''; // Clear the container before rendering

        // Ensure arrray
        if (!Array.isArray(gamesList)) return;

        gamesList.forEach(game => {
            try {
                // Container for each game
                const gameContainer = document.createElement('div');
                gameContainer.className = 'game-container';

                // Add game name
                const gameName = document.createElement('h3');
                gameName.textContent = game?.appName || 'Untitled';
                gameContainer.appendChild(gameName);

                // Add developer name
                const devName = document.createElement('p');
                devName.textContent = `Developer: ${game?.devName || 'Unknown'}`;
                gameContainer.appendChild(devName);

                // Add image
                const img = document.createElement('img');
                // Normalize URL and use placeholder if needed
                const candidate = normalizeUrl(game?.img) || game?.img || PLACEHOLDER_IMAGE;
                img.src = candidate;
                img.alt = `${game?.appName || 'Game'} Image`;
                img.className = 'game-image';
                img.style.width = '300px';
                img.style.height = 'auto';
                // If image fails to load, show placeholder
                img.onerror = () => {
                    img.onerror = null;
                    img.src = PLACEHOLDER_IMAGE;
                    img.classList.add('broken-img');
                };
                gameContainer.appendChild(img);

                // Add the live link (only if present)
                if (game?.app) {
                    const liveLink = document.createElement('a');
                    liveLink.href = game.app;
                    liveLink.textContent = 'Live App';
                    liveLink.target = '_blank';
                    liveLink.rel = 'noopener noreferrer';
                    liveLink.id = 'liveLink';
                    liveLink.className = 'me-2';
                    gameContainer.appendChild(liveLink);
                }

                // Add the GitHub repo link (only if present)
                if (game?.repo) {
                    const repoLink = document.createElement('a');
                    repoLink.href = game.repo;
                    repoLink.textContent = 'GitHub Repo';
                    repoLink.target = '_blank';
                    repoLink.rel = 'noopener noreferrer';
                    repoLink.id = 'repoLink';
                    gameContainer.appendChild(repoLink);
                }

                // Append the game container to the image container
                imageContainer.appendChild(gameContainer);
            } catch (renderErr) {
                // keep rendering even if one item is malformed
                console.error('Error rendering item', game, renderErr);
            }
        });
    }

    function sortGames(gamesArr, criteria) {
        return gamesArr.sort((a, b) => {
            if (criteria === 'name') {
                return (a?.appName || '').localeCompare(b?.appName || '', undefined, { sensitivity: 'base' });
            } else if (criteria === 'developer') {
                return (a?.devName || '').localeCompare(b?.devName || '', undefined, { sensitivity: 'base' });
            }
            return 0;
        });
    }

    // fetch and render (this mirrors your original second fetch + render behavior)
    fetch(LOCAL_JSON)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch game details');
            return response.json();
        })
        .then(data => {
            const gamesData = data.gameSort || [];

            // Initial render
            renderGameDetails(gamesData);

            // Add sorting functionality
            byNameBtn?.addEventListener('click', () => {
                const sortedGames = sortGames(gamesData.slice(), 'name');
                renderGameDetails(sortedGames);
            });

            const byDeveloperBtn = document.querySelector('.by-developer');
            byDeveloperBtn?.addEventListener('click', () => {
                const sortedGames = sortGames(gamesData.slice(), 'developer');
                renderGameDetails(sortedGames);
            });
        })
        .catch(err => console.error('Error fetching game details:', err));

})();
