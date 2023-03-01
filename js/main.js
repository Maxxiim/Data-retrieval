const discounts = [
    [5, { value: 100, cond: 150 }], 
    [10, 200],
    [15, 300],
    [20, 500],
];

const games = [
    {
        id: 1,
        name: ' death stranding   ',
        price: '1000rub',
        description: 'Компьютерная игра в жанре action с открытым миром, разработанная...',
        link: 'https://ru.wikipedia.org/wiki/Death_Stranding',
        discountType: null,
        hashTags: ['Шутер', '', ['Приключения,Доставка еды']],
    },
    {
        id: 2,
        name: 'the last of us   ',
        price: 300,
        description: 'Компьютерная игра в жанре action-adventure с элементами survival horror...',
        link: 'https://ru.wikipedia.org/wiki/The_Last_of_Us',
        discountType: 20,
        hashTags: ['Стелс', 'Экшен', 'Приключения'],
    },
    {
        id: 3,
        name: 'death stranding',
        price: null,
        description: null,
        discountType: null,
        hashTags: [],
    },
    {
        id: 4,
        name: 'SHREK 2: THE GAME',
        price: '321',
        description: 'Игра про зеленого мужика, который всем нравится',
        discountType: 5,
        hashTags: [['Шутер,Приключения'], 'Хоррор', 'Криминал'],
    },
    {
        id: 5,
        name: 'GTA 3',
        price: 20.512830102,
        description: 'Игра про безумного мужика, который всем нравится',
        discountType: 5,
        hashTags: undefined,
    },
];

const formattedGames = [];
const problemGames = [];

games.forEach((game) => {

    const price = !game.price ? 0 : parseFloat(game.price);

    const discountData = discounts.find((discount) => {
        if (discount[1] !== 'number' && discount[1].cond > price) {
            return false;
        }

        if ( discount[0] === game.discountType) {
            return true;
        }
    });

    const discountValue = Array.isArray(discountData) 
    ? discountData[1]
    : 0;

    const numericDiscount = typeof discountValue === 'number' 
    ? discountValue
    : discountValue.value;


    const newGame = {
        id: game.id,
        description: game.description,
        // 'link' добавили
        name: game.name.trim(),
        finaprice: parseFloat(price.toFixed(2)) - numericDiscount,
    };

    if (Array.isArray(game.hashTags)) {
        newGame.hashTags = game.hashTags
        .flat(Infinity)
        .reduce((acc, tags) => {
            if (tags.length === 0) {
                return acc;
            }

            const split = tags.split(',');

            split.forEach((value) => {
               acc.push(value);
            })
            return acc;
        }, []);
    }

    if (!newGame.hashTags) {
        newGame.hashTags = [];
    };

    if ('link' in game) {
        newGame.link = game.link;
    }

    const isDuplicate = formattedGames.find((formattedGames) => {
        if ( formattedGames.name === newGame.name) {
            return true;
        }
    })

    if ( newGame.finaprice < 0) {
        const reason = ['Цена ушла в минус'];
        const gameWithReason = {
            ...game,
            reason,
        };
        problemGames.push(gameWithReason);
    } else if (isDuplicate) {
        const reason = ['Дубликат'];
        const gameWithReason = {
            ...game, 
            reason,
        }
        problemGames.push(gameWithReason);
    } else {
        formattedGames.push(newGame);
    };    
});

// problemGames.forEach((game) => {
//     const name = `Игра ${game.name.trim()}`
//     const problems = game.reason.join(', ')
//     console.error(`${name} имеет проблемы с данными: ${problems}.`)
// });

// const genres = formattedGames.reduce((acc,game) => {
//     game.hashTags.forEach((tag) => {
//         if ( tag in acc) {
//             acc[tag].push(game.id);
//         } else {
//             acc[tag] = [game.id];
//         }
//     })
//     return acc;
// }, {});

// console.log(genres);

// console.log('problemGames', problemGames)
console.log('formattedGames', formattedGames);

const divContainer = document.createElement('div');
divContainer.className = 'container';

formattedGames.forEach((game) => {

    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';

    const name = createGameItem(game.name, 'game-name');
    gameContainer.append(name);

    const price = createGameItem(`${game.finaprice}`, 'game-price');
    gameContainer.append(price);
    
    const description = createGameItem(game.description, 'game-description');
    gameContainer.append(description);

    if ( game.link) {
        const link = createGameItem('Посмотреть полное описание', 'game-link', 'a')
        link.href = game.link;
        gameContainer.append(link)
    };

    if ( Array.isArray(game.hashTags) && game.hashTags.length > 0) {
        const hashTagContainer = document.createElement('div');
        gameContainer.className = 'game-hastag-container';
    
        game.hashTags.forEach((tag) => {
            const hashTag = createGameItem(`#${tag} `, 'game-hastag', 'span')
            hashTagContainer.prepend(hashTag);
        });
    
        gameContainer.append(hashTagContainer);
    }
    
    divContainer.append(gameContainer);
});

document.body.prepend(divContainer);

function createGameItem ( text, className, tagName = 'p') {
    const element = document.createElement(tagName);
    element.innerText = text;
    element.className = className;

    return element;
};