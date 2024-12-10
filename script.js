document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');

    async function searchAnime(query) {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Помилка при отриманні даних:', error);
            return [];
        }
    }

    function displayResults(animeList) {
        resultsDiv.innerHTML = '';
        
        animeList.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.className = 'anime-card';
            
            const translatedGenres = anime.genres?.map(g => translateGenre(g.name)).slice(0, 3).join(', ') || 'Невідомо';
            const status = translateStatus(anime.status);
            const year = new Date(anime.aired?.from).getFullYear() || 'Невідомо';
            const season = translateSeason(anime.season);
            const rating = (anime.score || '??') + '/10';
            
            animeCard.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <div class="anime-info">
                    <h3>${anime.title}</h3>
                    <div class="anime-stats">
                        <span>⭐ ${rating}</span>
                        <span>📺 ${anime.episodes || '??'} еп.</span>
                    </div>
                    <p>
                        <span class="tag">${year}</span>
                        <span class="tag">${status}</span>
                        ${season ? `<span class="tag">${season}</span>` : ''}
                    </p>
                    <div class="tags-container">
                        ${anime.genres?.map(g => 
                            `<span class="tag">${translateGenre(g.name)}</span>`
                        ).join('') || ''}
                    </div>
                </div>
            `;
            
            animeCard.addEventListener('click', () => {
                window.open(anime.url, '_blank');
            });
            
            resultsDiv.appendChild(animeCard);
        });
    }

    function translateGenre(genre) {
        const genreMap = {
            'Action': 'Бойовик',
            'Adventure': 'Пригоди',
            'Comedy': 'Комедія',
            'Drama': 'Драма',
            'Fantasy': 'Фентезі',
            'Horror': 'Жахи',
            'Mystery': 'Містика',
            'Romance': 'Романтика',
            'Sci-Fi': 'Наукова фантастика',
            'Slice of Life': 'Повсякденність',
            'Sports': 'Спорт',
            'Supernatural': 'Надприродне',
            'Thriller': 'Трилер',
            'Mecha': 'Меха',
            'Music': 'Музика',
            'Psychological': 'Психологія',
            'School': 'Школа',
            'Shounen': 'Сьонен',
            'Shoujo': 'Сьодзьо',
            'Magic': 'Магія',
            'Military': 'Військове',
            'Historical': 'Історичне',
            'Super Power': 'Супер��или',
            'Vampire': 'Вампіри',
            'Martial Arts': 'Бойові мистецтва',
            'Samurai': 'Самураї',
            'Demons': 'Демони',
            'Space': 'Космос'
        };
        return genreMap[genre] || genre;
    }

    function translateStatus(status) {
        const statusMap = {
            'Finished Airing': 'Завершено',
            'Currently Airing': 'Виходить',
            'Not yet aired': 'Ще не вийшло'
        };
        return statusMap[status] || status;
    }

    function translateSeason(season) {
        const seasonMap = {
            'spring': 'Весна',
            'summer': 'Літо',
            'fall': 'Осінь',
            'winter': 'Зима'
        };
        return seasonMap[season] || '';
    }

    // Додаємо обробники подій
    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query) {
            const results = await searchAnime(query);
            displayResults(results);
        }
    });

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const results = await searchAnime(query);
                displayResults(results);
            }
        }
    });
}); 