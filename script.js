
(function () {
	const LOCAL_JSON = './gameSort.json';

	// Array for Games
	let games = [];

	// DOM refs
	const listEl = document.getElementById('gameSort');
	const byNameBtn = document.querySelector('.by-name');
	const byOrderBtn = document.querySelector('.by-order');
	const byRatingBtn = document.querySelector('.by-rating');

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
// Sort by app name
// Resource Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
if (byOrderBtn) {
  byOrderBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!games || games.length === 0) return;
    games.sort((a,b) => String(a.appName||'').localeCompare(String(b.appName||''), undefined, {sensitivity:'base'}));
    render(games);
  });
}

})();