const API_KEY = 'F2W3Pbaqyv7ut7qfbnEBDRNqAsytdSE5';

const searchBtn = document.getElementById('search-btn');
const celebritySelect = document.getElementById('celebrity-select');
const feelingSelect = document.getElementById('feeling-select');
const gifGrid = document.getElementById('gif-grid');

searchBtn.addEventListener('click', () => {
    const celebrity = celebritySelect.value;
    const feeling = feelingSelect.value;

    if (!celebrity && !feeling) {
        alert('Please select at least a celebrity or a feeling.');
        return;
    }

    // Build query based on selection
    let query = '';
    if (celebrity && feeling) {
        query = `${celebrity} ${feeling}`;
    } else if (celebrity) {
        query = celebrity;
    } else if (feeling) {
        query = feeling;
    }

    fetchGIFs(query);
});

function fetchGIFs(query) {
    gifGrid.innerHTML = '<p>Loading...</p>';
    const url =
        `https://api.giphy.com/v1/gifs/search?` +
        `api_key=${API_KEY}` +
        `&q=${encodeURIComponent(query)}` +
        `&limit=12` +
        `&offset=0` +
        `&rating=g` +
        `&lang=en` +
        `&bundle=messaging_non_clips`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            gifGrid.innerHTML = '';

            if (data.data.length === 0) {
                gifGrid.innerHTML = `<p>No GIFs found for "${query}". Try another combination!</p>`;
                return;
            }

            data.data.forEach(gif => {
                const card = document.createElement('div');
                card.className = 'gif-card';

                const img = document.createElement('img');
                img.src = gif.images.fixed_height.url;
                img.alt = gif.title;

                card.appendChild(img);
                gifGrid.appendChild(card);
            });
        })
        .catch(error => {
            console.error(error);
            gifGrid.innerHTML = '<p>Something went wrong. Please try again.</p>';
        });
}