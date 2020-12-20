const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let photosArray = [];
let imagesLoadedNum = 0;
let loaded = false;
let totalImagesNum = 0;
// default state of the initial image load on page load
let initialImageLoad = true;

// Unsplash API
const queryString = 'galaxy';
let initialImageLoadCount = 5;

const apiKey = 'dwSgWNqTX_Ssk_C7NausSukTu85lVv0PdAhIJR_l_84';
let apiUrl =`https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${initialImageLoadCount}&query=${queryString}`;

function updateApiUrlWithNewCount(imageLoadCount) {
    apiUrl =`https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imageLoadCount}&query=${queryString}`;
}

// helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function imageLoaded() {
    imagesLoadedNum++;
    if (imagesLoadedNum === totalImagesNum) {
        loaded = true;
        loader.hidden = true;
    } 
}

// create elements for links and photos
// then add to DOM
function displayImages() {
    imagesLoadedNum = 0;
    totalImagesNum = photosArray.length;
    // for each photo in photosArray,
    photosArray.forEach((photo) => {
        // creates an <a> link to Unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });

        // creates <img> for the image
        const image = document.createElement('img');
        setAttributes(image, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        // check when for-each is finished loading
        image.addEventListener('load', imageLoaded());

        // put <img> inside <a>, then put them both inside the image-container element
        item.appendChild(image);
        imageContainer.appendChild(item);
    });
}

// get images from Unsplash API
async function getImages() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        
        displayImages();

        if (initialImageLoad) {
            updateApiUrlWithNewCount(30);
            initialImageLoad = false;
        }
    } catch (error) {
        console.log(error);
    }
}

// check if we are near the bottom of the page, 
// if so, load more images
window.addEventListener('scroll', () => {
    // scrollY = distance from the top of page on scroll
    // innerHeight = height of the browser window
    // offsetHeight = total height of the body including what isn't in current view
    // subtracting a 1000px to trigger the infinite scroll just before the user scrolls to the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && loaded) {
        loaded = false;
        getImages();
    }

});

// on page load
getImages();