const API_KEY = 'F2W3Pbaqyv7ut7qfbnEBDRNqAsytdSE5';

const searchBtn = document.getElementById('search-btn');
const celebritySelect = document.getElementById('celebrity-select');
const feelingSelect = document.getElementById('feeling-select');
const gifGrid = document.getElementById('gif-grid');

searchBtn.addEventListener('click',() => {
    const celebrity = celebritySelect.value;
    const feeling = feelingSelect.value;

if (! celebrity || !feeling) {
    alert('Please select both a celebrity and a feeling.');
    return;
}

const query = `${celebrity}${feeling}`;

fetchGIFs(query);
});

function fetchGIFs(query) {
    gifGrid.innerHTML = '<p>Loading...</p>';
    const url =
        `https://api.giphy.com/v1/gifs/search?` +
        `api_key=F2W3Pbaqyv7ut7qfbnEBDRNqAsytdSE5` +
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
                gifGrid.innerHTML = `<p>No GIFs found for "${query}". try another combination!</p>`;
                return;
            }
        }

}