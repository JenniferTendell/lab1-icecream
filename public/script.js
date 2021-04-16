let pageToShow = 'homepage' | 'detailpage' | 'addOrUpdatePage';
let clickedIceCream = {};

window.addEventListener('load', startPage);

function startPage() {
    getAllIceCreams()
    displayButtons()
};

async function getAllIceCreams() {
    pageToShow = 'homepage';
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
    title.innerHTML = iceCream.title;

    // Display content
    mainContent.append(productCard);
    productCard.append(backgroundImage);
    backgroundImage.append(image);
    productCard.append(title);
    
    backgroundImage.addEventListener('click', () => {
        pageToShow = 'detailpage';
        displaySpecificIceCream(iceCream, mainContent);
        displayButtons();
    });         
};

function displaySpecificIceCream(iceCream, mainContent) {
    clickedIceCream = iceCream

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
    title.innerHTML = iceCream.title;
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
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container')

    const button = document.createElement('button');
    button.classList.add('button');

    footer.innerHTML = "";
    footer.append(buttonsContainer)
    
    if(pageToShow === 'homepage') {
        title = 'Lägg till glass';
        button.innerHTML = title;
        button.addEventListener('click', () => {
            handleButtonClick(title);
        });
        
        buttonsContainer.append(button);

    } else if(pageToShow === 'detailpage') {
        const buttonTitles = ['Ta bort', 'Ändra', 'Gå tillbaka'];
        
        for(const title of buttonTitles) {
            const button = document.createElement('button');
            button.classList.add('button');
            button.innerHTML = title;
            button.addEventListener('click', () => {
                handleButtonClick(title);
            });
            
            buttonsContainer.append(button);   
        };
    } else {
        title = 'Gå tillbaka';
        button.innerHTML = title;
        button.addEventListener('click', () => {
            handleButtonClick(title);
        });
        
        buttonsContainer.append(button);    
    };      
};

function handleButtonClick(buttonTitle) {
    switch(buttonTitle) {
        case 'Lägg till glass':
            displayAddIceCreamForm();
            pageToShow = 'addOrUpdatePage';
            displayButtons();
            break;

        case 'Ta bort':
            removeIceCream();
            pageToShow = 'homepage';
            getAllIceCreams();
            displayButtons();
            break;

        case 'Ändra':
            displayUpdateIceCreamForm();
            pageToShow = 'addOrUpdatePage';
            displayButtons();
            break;

        case 'Gå tillbaka':
            pageToShow = 'homepage';
            getAllIceCreams();
            displayButtons();
            break;
    };
};

function displayAddIceCreamForm() {
    const mainContent = document.querySelector('.main-content-container');
    mainContent.innerHTML = "";

    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    /* Image container */
    const imageContainer = document.createElement('img');
    imageContainer.classList.add('image-container');

    /* FORM */
    const form = document.createElement('form');
    form.classList.add('new-ice-cream-form');

    /* Title */
    const title = document.createElement('input');
    title.classList.add('input');
    title.placeholder = 'Titel';
    
    /* Price */
    const price = document.createElement('input');
    price.classList.add('input');
    price.placeholder = 'Pris';

    /* Description */
    const description = document.createElement('input');
    description.classList.add('input');
    description.placeholder = 'Beskrivning';

    /* Image */
    const image = document.createElement('input');
    image.classList.add('input');
    image.placeholder = 'Bildadress (http://...)';
    image.addEventListener('input', (e) => {
        imageContainer.src = e.target.value;
    });

    /* Submit button */
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.innerHTML = 'Lägg till';
    submitButton.addEventListener('click', () => {
        addNewIceCream(title, price, description, image);
        pageToShow = 'homepage';
        startPage();
    });

    /* Display */
    mainContent.append(formContainer);
    formContainer.append(imageContainer);
    formContainer.append(form);
    form.append(title);
    form.append(price);
    form.append(description);
    form.append(image);  
    form.append(submitButton); 
}

async function addNewIceCream(title, price, description, image) {
    
    const body = {
        "title": title.value,
        "price": price.value,
        "description": description.value,
        "image": image.value,
    }
    
    await makeRequest('/api/ice-cream', 'POST', body);
};

async function removeIceCream() {
    const id = clickedIceCream.id;

    await makeRequest(`/api/ice-cream/${id}`, 'DELETE');
};

function displayUpdateIceCreamForm() {
    const mainContent = document.querySelector('.main-content-container');
    mainContent.innerHTML = "";

    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    /* Image preview */
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('background-image-circle');

    const image = document.createElement('img');
    image.src = clickedIceCream.image;
    image.classList.add('large-image');
    
    /* FORM */
    const form = document.createElement('div');
    form.classList.add('new-ice-cream-form');

    /* Title */
    const titleInput = document.createElement('input');
    titleInput.classList.add('input');
    titleInput.value = clickedIceCream.title;
    
    /* Price */
    const priceInput = document.createElement('input');
    priceInput.classList.add('input');
    priceInput.value = clickedIceCream.price;

    /* Description */
    const descriptionInput = document.createElement('input');
    descriptionInput.classList.add('input');
    descriptionInput.value = clickedIceCream.description;
    
    /* Image */
    const imageInput = document.createElement('input');
    imageInput.classList.add('input');
    imageInput.value = clickedIceCream.image;
    imageInput.addEventListener('input', (e) => {
        image.src = e.target.value;
    });

    /* Submit button */
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.innerHTML = 'Spara';
    submitButton.addEventListener('click', () => {
        updateIceCream(titleInput, priceInput, descriptionInput, imageInput);
        pageToShow = 'homepage';
        startPage();
    });

    /* Display */
    mainContent.append(formContainer);
    formContainer.append(imageContainer);
    imageContainer.append(image)
    formContainer.append(form);
    form.append(titleInput);
    form.append(priceInput);
    form.append(descriptionInput);
    form.append(imageInput);  
    form.append(submitButton);
}

async function updateIceCream(title, price, description, image) {
    const id = clickedIceCream.id;

    const body = {
        "title": title.value,
        "price": price.value,
        "description": description.value,
        "image": image.value
    }
    await makeRequest(`/api/ice-cream/${id}`, 'PUT', body);
};

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