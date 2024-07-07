const headers = ['M', 'U', 'Z', 'I', 'C'];

$(document).ready(function() {
    let bingoData = [];

    $('#csvFile').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                skipEmptyLines: true,
                complete: function(results) {
                    bingoData = results.data.map(row => row.filter(item => item.trim() !== '')); // Filter out empty strings
                }
            });
        }
    });

    $('#generateBtn').on('click', function() {
        const numCards = parseInt($('#numCards').val());
        if (isNaN(numCards) || numCards <= 0) {
            alert('Please enter a valid number of cards.');
            return;
        }
        if (bingoData.length < 25) {
            alert('Not enough data to fill the bingo card.');
            return;
        }

        const includeFreeSpace = $('#freeSpaceCheckbox').prop('checked');
        const excludeNA = $('#naCheckbox').prop('checked');
        const excludeArtist = $('#allArtistCheckbox').prop('checked');
        const cardsContainer = $('#cardsContainer');
        cardsContainer.empty();

        for (let i = 0; i < numCards; i++) {
            const selectedItems = getRandomItems(25);
            const cardDiv = $('<div>').addClass('card');

            // Add BINGO header
            headers.forEach(letter => {
                const headerDiv = $('<div>').addClass('header-cell hide-on-screen').text(letter);
                cardDiv.append(headerDiv);
            });

            // Add bingo cells
            for (let j = 0; j < 25; j++) {
                const cellDiv = $('<div>').addClass('cell');
                const songTitle = selectedItems[j][1];
                const artistName = selectedItems[j][0];
                // Add FREE space
                if (includeFreeSpace && j == 12) {
                    cellDiv.addClass('free-space').html('<div>FREE</div>');
                } else {
                    let htmlString = '<div>'
                    if ((excludeNA && (`${songTitle}` != 'NA')) || (!excludeNA)) {
                        htmlString += `<span class="title-text">${toTitleCase(songTitle)}</span>`
                    }
                    if (!excludeArtist) {
                        if ((excludeNA && (`${artistName}` != 'NA')) || (!excludeNA)) {
                            htmlString += `<span class="artist-text">${toTitleCase(artistName)}</span>`
                        }
                    }
                    htmlString += '</div>'
                    cellDiv.html(htmlString);
                    if (htmlString == '<div></div>') {
                        alert(`Space #${j + 1} on card ${i + 1} is blank. Review your song list as well as artist / title settings.`)
                    }
                }
                cardDiv.append(cellDiv);
            }
            cardsContainer.append(cardDiv);
        }
    });

    $('#printBtn').on('click', function() {
        window.print();
    });

    function getRandomItems(num) {
        const selectedItems = [];
        while (selectedItems.length < num) {
            const randomIndex = Math.floor(Math.random() * bingoData.length);
            const selectedItem = bingoData[randomIndex];
            if (!selectedItems.includes(selectedItem)) {
                selectedItems.push(selectedItem);
            }
        }
        return selectedItems;
    }
});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
)};
