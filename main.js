const API_KEY = 'F2W3Pbaqyv7ut7qfbnEBDRNqAsytdSE5';

const searchBtn = document.getElementById('search-btn');
const celebritySelect = document.getElementById('celebrity-select');
const gifGrid = document.getElementById('gif-grid');

searchBtn.addEventListener('click', () => {
    const celebrity = celebritySelect.value;

    if (!celebrity) {
        alert('Please select a celebrity.');
        return;
    }

    fetchGIFs(celebrity);
});

async function fetchGIFs(celebrity) {
    gifGrid.innerHTML = '<p>Loading GIFs...</p>';
    
    if (celebrity === "Mariah Carey") {
        await fetchMariahMix();
        return;
    }

    fetchRegularGIFs(celebrity);
}

async function fetchMariahMix() {
    const queries = [
        'Mariah Carey 90s',
        'Mariah Carey 1990s',
        'Mariah Carey 90s music video',
        'Mariah Carey retro',
        'Mariah Carey'
    ];

    try {
        const promises = queries.map(query => 
            fetch(
                `https://api.giphy.com/v1/gifs/search?` +
                `api_key=${API_KEY}` +
                `&q=${encodeURIComponent(query)}` +
                `&limit=30` +
                `&offset=0` +
                `&rating=g` +
                `&lang=en`
            ).then(res => res.json())
        );

        const results = await Promise.all(promises);
        
        let allGifs = [];
        results.forEach(result => {
            if (result.data) {
                allGifs = [...allGifs, ...result.data];
            }
        });
        
        const excludeWords = [
            'shark', 'whale', 'left shark', 'fish',
            'cat', 'dog', 'animal', 'pet',
            'cartoon', 'animated', 'animation',
            'clipart', 'illustration', 'drawing',
            'costume', 'mascot',
            'impersonator', 'impression', 'parody', 'snl', 'mimic', 'cover'
        ];

        let filteredGifs = allGifs.filter(gif => {
            const title = gif.title.toLowerCase();
            
            if (!title.includes('mariah carey') && !title.includes('mariah') && !title.includes('carey')) {
                return false;
            }
            
            const hasExcludedWord = excludeWords.some(word => title.includes(word));
            return !hasExcludedWord;
        });

        const uniqueGifs = [];
        const seenIds = new Set();
        
        const sortedGifs = filteredGifs.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            const aHas90s = aTitle.includes('90') || aTitle.includes('1990') || aTitle.includes('retro');
            const bHas90s = bTitle.includes('90') || bTitle.includes('1990') || bTitle.includes('retro');
            
            if (aHas90s && !bHas90s) return -1;
            if (!aHas90s && bHas90s) return 1;
            return 0;
        });
        
        for (const gif of sortedGifs) {
            if (!seenIds.has(gif.id) && uniqueGifs.length < 20) {
                seenIds.add(gif.id);
                uniqueGifs.push(gif);
            }
        }

        displayGIFs(uniqueGifs, 'Mariah Carey');
    } catch (error) {
        console.error('Fetch error:', error);
        gifGrid.innerHTML = '<p>Something went wrong. Please try again.</p>';
    }
}

function fetchRegularGIFs(celebrity) {
    const url =
        `https://api.giphy.com/v1/gifs/search?` +
        `api_key=${API_KEY}` +
        `&q=${encodeURIComponent(celebrity)}` +
        `&limit=50` +
        `&offset=0` +
        `&rating=g` +
        `&lang=en`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const excludeWords = [
                'shark', 'whale', 'left shark', 'fish',
                'cat', 'dog', 'animal', 'pet',
                'cartoon', 'animated', 'animation',
                'clipart', 'illustration', 'drawing',
                'costume', 'mascot',
                'impersonator', 'impression', 'parody', 'snl', 'mimic'
            ];

            const filteredGifs = data.data.filter(gif => {
                const title = gif.title.toLowerCase();
                const celebName = celebrity.toLowerCase();
                
                if (!title.includes(celebName)) return false;
                
                const hasExcludedWord = excludeWords.some(word => title.includes(word));
                return !hasExcludedWord;
            });

            const uniqueGifs = [];
            const seenUrls = new Set();
            
            for (const gif of filteredGifs) {
                if (!seenUrls.has(gif.images.original.url) && uniqueGifs.length < 20) {
                    seenUrls.add(gif.images.original.url);
                    uniqueGifs.push(gif);
                }
            }

            displayGIFs(uniqueGifs, celebrity);
        })
        .catch(error => {
            console.error(error);
            gifGrid.innerHTML = '<p>Something went wrong. Please try again.</p>';
        });
}

function displayGIFs(gifs, query) {
    gifGrid.innerHTML = '';

    if (gifs.length === 0) {
        gifGrid.innerHTML = `<p>No GIFs found for "${query}". Try another celebrity!</p>`;
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