const API_KEY = 'key'

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




})