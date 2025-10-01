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

    fetchGIFs(celebrity, feeling);
});

function fetchGIFs(celebrity, feeling) {
    gifGrid.innerHTML = '<p>Loading...</p>';
    
    let query = '';
    
    if (celebrity && feeling) {
        query = `${celebrity} ${feeling}`;
    } else if (celebrity) {
        query = celebrity;
    } else {
        query = feeling;
    }

    const url =
        `https://api.giphy.com/v1/gifs/search?` +
        `api_key=${API_KEY}` +
        `&q=${encodeURIComponent(query)}` +
        `&limit=50` +
        `&offset=0` +
        `&rating=g` +
        `&lang=en`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let filteredGifs = [];

            // More comprehensive exclude list
            const excludeWords = [
                'shark', 'whale', 'left shark', 'fish',
                'cat', 'dog', 'animal', 'pet',
                'cartoon', 'animated', 'animation',
                'clipart', 'illustration', 'drawing',
                'costume', 'mascot'
            ];

            if (celebrity) {
                // Filter to only show actual celebrity GIFs
                filteredGifs = data.data.filter(gif => {
                    const title = gif.title.toLowerCase();
                    const celebName = celebrity.toLowerCase();
                    
                    // Must contain celebrity name
                    if (!title.includes(celebName)) return false;
                    
                    // Exclude if contains any excluded words
                    const hasExcludedWord = excludeWords.some(word => title.includes(word));
                    if (hasExcludedWord) return false;
                    
                    // If feeling is specified, prioritize GIFs with that feeling
                    if (feeling) {
                        return title.includes(feeling.toLowerCase());
                    }
                    
                    return true;
                });

                // If we filtered out too much, relax the feeling requirement
                if (filteredGifs.length < 6 && feeling) {
                    filteredGifs = data.data.filter(gif => {
                        const title = gif.title.toLowerCase();
                        const hasExcludedWord = excludeWords.some(word => title.includes(word));
                        return title.includes(celebrity.toLowerCase()) && !hasExcludedWord;
                    });
                }
            } else {
                // Feeling only
                filteredGifs = data.data;
            }

            // Remove duplicates and limit to 12
            const uniqueGifs = [];
            const seenUrls = new Set();
            
            for (const gif of filteredGifs) {
                if (!seenUrls.has(gif.images.original.url) && uniqueGifs.length < 12) {
                    seenUrls.add(gif.images.original.url);
                    uniqueGifs.push(gif);
                }
            }

            displayGIFs(uniqueGifs, query);
        })
        .catch(error => {
            console.error(error);
            gifGrid.innerHTML = '<p>Something went wrong. Please try again.</p>';
        });
}

function displayGIFs(gifs, query) {
    gifGrid.innerHTML = '';

    if (gifs.length === 0) {
        gifGrid.innerHTML = `<p>No GIFs found for "${query}". Try another combination!</p>`;
        return;
    }

    gifs.forEach(gif => {
        const card = document.createElement('div');
        card.className = 'gif-card';

        const img = document.createElement('img');
        img.src = gif.images.original.url;
        img.alt = gif.title;

        card.appendChild(img);
        gifGrid.appendChild(card);
    });
}