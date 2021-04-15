let showStartPage = true

window.addEventListener('load', startPage);

function startPage() {
    getAllIceCreams()
    displayButtons()
};

async function getAllIceCreams() {
    const iceCreams = await makeRequest('/api/ice-cream', 'GET');
    
    const mainContent = document.querySelector('.main-content-container');
    mainContent.innerHTML = "";
    
    for(const iceCream of iceCreams) {
        displayIceCream(iceCream, mainContent)   
    };
}; 

function displayIceCream(iceCream, mainContent) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    
    // Ice cream image
    const backgroundImage = document.createElement('div');
    backgroundImage.classList.add('background-image-square');
    
    const image = document.createElement('img');
    image.src = iceCream.image;
    image.classList.add('small-image');

    // Ice cream name
    const title = document.createElement('p');
    title.innerHTML = iceCream.name;

    // Display content
    mainContent.append(productCard);
    productCard.append(backgroundImage);
    backgroundImage.append(image);
    productCard.append(title);
    
    backgroundImage.addEventListener('click', () => {
        showStartPage = false;
        displaySpecificIceCream(iceCream, mainContent);
        displayButtons();
    });         
};

function displaySpecificIceCream(iceCream, mainContent) {
    mainContent.innerHTML = "";        

    const productContainer = document.createElement('div');
    productContainer.classList.add('specific-product-container');

    // Ice cream image
    const backgroundImage = document.createElement('div');
    backgroundImage.classList.add('background-image-circle');

    const image = document.createElement('img');
    image.src = iceCream.image;
    image.classList.add('large-image');

    // Ice cream info
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('product-info-container');

    const title = document.createElement('h2');
    title.innerHTML = iceCream.name;
    title.innerHTML.length > 10
    ? title.classList.add('h2-small')
    : title.classList.add('h2');

    const price = document.createElement('h3');
    price.innerHTML = iceCream.price + ' kr';
    price.classList.add('h3');

    const description = document.createElement('p');
    description.innerHTML = iceCream.description;
    
    // Display content
    mainContent.append(productContainer);
    productContainer.append(backgroundImage);
    backgroundImage.append(image);
    productContainer.append(infoContainer);
    infoContainer.append(title);
    infoContainer.append(price);
    infoContainer.append(description);
};

function displayButtons() {
    const footer = document.querySelector('footer');
    footer.classList.add('footer');
    
    footer.innerHTML = "";
    
    if(showStartPage) {
        title = 'Add ice cream';

        const button = document.createElement('button');
        button.classList.add('button');
        button.innerHTML = title;
        
        footer.append(button);

        button.addEventListener('click', () => {
            handleButtonClick(title);
        });
    } else {
        const buttonTitles = ['Remove ice cream', 'Update ice cream', 'Go back'];
        
        for(const title of buttonTitles) {
            const button = document.createElement('button');
            button.classList.add('button');
            button.innerHTML = title;
            
            footer.append(button); 

            button.addEventListener('click', () => {
                handleButtonClick(title);
            });
        };
    };      
};

// TODO: Skapa funktioner för knappar.
function handleButtonClick(buttonTitle) {
    switch(buttonTitle) {
        case 'Add ice cream':
            addIceCream();
            break;
        case 'Remove ice cream':
            removeIceCream();
            break;
        case 'Update ice cream':
            updateIceCream();
            break;
        case 'Go back':
            showStartPage = true;
            getAllIceCreams();
            displayButtons();
            break;
    }
}

async function makeRequest(url, method, body) {
    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();

    return result;
};