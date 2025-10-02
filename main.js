const API_KEY = 'F2W3Pbaqyv7ut7qfbnEBDRNqAsytdSE5';

// Test API key on load
console.log('Testing API connection...');

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

async function fetchGIFs(celebrity, feeling) {
    gifGrid.innerHTML = '<p>Loading...</p>';
    
    if (celebrity === "Mariah Carey") {
        await fetchMariahMix(feeling);
        return;
    }

    let query = '';
    if (celebrity && feeling) {
        query = `${celebrity} ${feeling}`;
    } else if (celebrity) {
        query = celebrity;
    } else {
        query = feeling;
    }

    fetchRegularGIFs(query, celebrity, feeling);
}

async function fetchMariahMix(feeling) {
    // Multiple queries to get more 90s content
    const queries = [
        feeling ? `Mariah Carey 90s ${feeling}` : 'Mariah Carey 90s',
        feeling ? `Mariah Carey 1990s ${feeling}` : 'Mariah Carey 1990s',
        feeling ? `Mariah Carey 90s music video ${feeling}` : 'Mariah Carey 90s music video',
        feeling ? `Mariah Carey retro ${feeling}` : 'Mariah Carey retro',
        feeling ? `Mariah Carey ${feeling}` : 'Mariah Carey'
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
            ).then(res => {
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                return res.json();
            })
        );

        const results = await Promise.all(promises);
        console.log('API Response:', results);
        
        if (!results.some(r => r.data)) {
            throw new Error('Invalid API response');
        }
        
        // Combine all results, prioritizing 90s content
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
            
            if (feeling && !title.includes(feeling.toLowerCase())) {
                return false;
            }
            
            const hasExcludedWord = excludeWords.some(word => title.includes(word));
            return !hasExcludedWord;
        });

        const uniqueGifs = [];
        const seenUrls = new Set();
        
        // Prioritize GIFs with 90s keywords in the title
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
            if (!seenUrls.has(gif.images.original.url) && uniqueGifs.length < 15) {
                seenUrls.add(gif.images.original.url);
                uniqueGifs.push(gif);
            }
        }

        displayGIFs(uniqueGifs, 'Mariah Carey');
    } catch (error) {
        console.error('Fetch error:', error);
        gifGrid.innerHTML = '<p>API Error: ' + error.message + '. The API key may be invalid. Please check the console for details.</p>';
    }
}

function fetchRegularGIFs(query, celebrity, feeling) {
    const url =
        `https://api.giphy.com/v1/gifs/search?` +
        `api_key=${API_KEY}` +
        `&q=${encodeURIComponent(query)}` +
        `&limit=50` +
        `&offset=0` +
        `&rating=g` +
        `&lang=en`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            
            if (!data.data) {
                throw new Error('Invalid API response');
            }

            let filteredGifs = [];

            const excludeWords = [
                'shark', 'whale', 'left shark', 'fish',
                'cat', 'dog', 'animal', 'pet',
                'cartoon', 'animated', 'animation',
                'clipart', 'illustration', 'drawing',
                'costume', 'mascot',
                'impersonator', 'impression', 'parody', 'snl', 'mimic'
            ];

            if (celebrity) {
                filteredGifs = data.data.filter(gif => {
                    const title = gif.title.toLowerCase();
                    const celebName = celebrity.toLowerCase();
                    
                    if (!title.includes(celebName)) return false;
                    
                    const hasExcludedWord = excludeWords.some(word => title.includes(word));
                    if (hasExcludedWord) return false;
                    
                    if (feeling && !title.includes(feeling.toLowerCase())) {
                        return false;
                    }
                    
                    return true;
                });
            } else {
                filteredGifs = data.data;
            }

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
}w