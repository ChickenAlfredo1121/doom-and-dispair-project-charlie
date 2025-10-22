(function () {
	const LOCAL_JSON = './gameSort.json';

	// Array for Games
	let games = [];

	// DOM refs
	const listEl = document.getElementById('gameSort');
	const byNameBtn = document.querySelector('.by-name');
	const byOrderBtn = document.querySelector('.by-order');
	const byRatingBtn = document.querySelector('.by-rating');

	// Define the image container
	const imageContainer = document.getElementById('imageContainer');

	// Sort by app name
	// Resource Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	fetch('./gameSort.json')
		.then(r => { if (!r.ok) throw new Error('Could not fetch'); return r.json(); })
		.then(data => {
			games = Array.isArray(data.gameSort) ? data.gameSort.slice() : (Array.isArray(data) ? data.slice() : []);
			render(games); // make sure render is defined
		})
		.catch(err => console.error('Fetch error:', err));

	function render(list) {
		if (!listEl) return;
		listEl.innerHTML = '';
		(list || []).forEach(item => {
			const li = document.createElement('li');
			li.className = 'list-group-item';
			li.textContent = item.appName || 'Untitled';
			listEl.appendChild(li);
		});
	}

	function renderGameDetails(games) {
		games.forEach(game => {
			// Create a container for each game
			const gameContainer = document.createElement('div');
			gameContainer.className = 'game-container';

			// Add the image
			const img = document.createElement('img');
			img.src = game.img;
			img.alt = `${game.appName} Image`;
			img.className = 'game-image';
			gameContainer.appendChild(img);

			// Add the developer name
			const devName = document.createElement('p');
			devName.textContent = `Developer: ${game.devName}`;
			gameContainer.appendChild(devName);

			// Add the live link
			const liveLink = document.createElement('a');
			liveLink.href = game.app;
			liveLink.textContent = 'Live App';
			liveLink.target = '_blank';
			gameContainer.appendChild(liveLink);

			// Add the GitHub repo link
			const repoLink = document.createElement('a');
			repoLink.href = game.repo;
			repoLink.textContent = 'GitHub Repo';
			repoLink.target = '_blank';
			gameContainer.appendChild(repoLink);

			// Append the game container to the image container
			imageContainer.appendChild(gameContainer);
		});
	}

	fetch('./gameSort.json')
		.then(response => {
			if (!response.ok) throw new Error('Failed to fetch game details');
			return response.json();
		})
		.then(data => {
			const games = data.gameSort || [];
			renderGameDetails(games);
		})
		.catch(err => console.error('Error fetching game details:', err));

	// Sort by app name
	// Resource Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	if (byOrderBtn) {
		byOrderBtn.addEventListener('click', e => {
			e.preventDefault();
			if (!games || games.length === 0) return;
			games.sort((a, b) => String(a.appName || '').localeCompare(String(b.appName || ''), undefined, { sensitivity: 'base' }));
			render(games);
		});
	}

})();