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
		})
		.catch(err => console.error('Fetch error:', err));

	function renderGameDetails(games) {
		imageContainer.innerHTML = ''; // Clear the container before rendering

		games.forEach(game => {
			// Create a container for each game
			const gameContainer = document.createElement('div');
			gameContainer.className = 'game-container';

			// Add the game name
			const gameName = document.createElement('h3');
			gameName.textContent = game.appName;
			gameContainer.appendChild(gameName);

			// Add the developer name
			const devName = document.createElement('p');
			devName.textContent = `Developer: ${game.devName}`;
			gameContainer.appendChild(devName);

			// Add the image
			const img = document.createElement('img');
			img.src = game.img;
			img.alt = `${game.appName} Image`;
			img.className = 'game-image';
			img.style.width = '300px'; 
			img.style.height = 'auto'; 
			img.onerror = () => {
				img.src = 'placeholder.png'; 
			};
			gameContainer.appendChild(img);

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

	function sortGames(games, criteria) {
		return games.sort((a, b) => {
			if (criteria === 'name') {
				return a.appName.localeCompare(b.appName, undefined, { sensitivity: 'base' });
			} else if (criteria === 'developer') {
				return a.devName.localeCompare(b.devName, undefined, { sensitivity: 'base' });
			}
			return 0;
		});
	}

	fetch('./gameSort.json')
		.then(response => {
			if (!response.ok) throw new Error('Failed to fetch game details');
			return response.json();
		})
		.then(data => {
			const games = data.gameSort || [];

			// Initial render
			renderGameDetails(games);

			// Add sorting functionality
			byNameBtn.addEventListener('click', () => {
				const sortedGames = sortGames(games, 'name');
				renderGameDetails(sortedGames);
			});

			const byDeveloperBtn = document.querySelector('.by-developer');
			byDeveloperBtn.addEventListener('click', () => {
				const sortedGames = sortGames(games, 'developer');
				renderGameDetails(sortedGames);
			});
		})
		.catch(err => console.error('Error fetching game details:', err));

})();