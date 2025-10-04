const upcInput = document.getElementById('upcInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const error = document.getElementById('error');

// UPC Database API - using Open Product Facts API
async function lookupUPC(upc) {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${upc}.json`);
    const data = await response.json();
    return data;
}

function displayProduct(data) {
    if (data.status === 0) {
        showError('Product not found. Try another UPC code.');
        return;
    }

    const product = data.product;
    let html = '<div class="product-card">';

    if (product.image_url) {
        html += `<img src="${product.image_url}" alt="${product.product_name || 'Product'}" class="product-image">`;
    }

    html += '<div class="product-details">';
    html += `<h2>${product.product_name || 'Unknown Product'}</h2>`;

    if (product.brands) {
        html += `<p><strong>Brand:</strong> ${product.brands}</p>`;
    }

    if (product.quantity) {
        html += `<p><strong>Quantity:</strong> ${product.quantity}</p>`;
    }

    if (product.categories) {
        html += `<p><strong>Categories:</strong> ${product.categories}</p>`;
    }

    if (product.countries) {
        html += `<p><strong>Countries:</strong> ${product.countries}</p>`;
    }

    if (product.barcode) {
        html += `<p><strong>Barcode:</strong> ${product.barcode}</p>`;
    }

    html += '</div></div>';

    result.innerHTML = html;
    result.classList.remove('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    result.classList.add('hidden');
}

function hideMessages() {
    error.classList.add('hidden');
    result.classList.add('hidden');
    loading.classList.add('hidden');
}

async function performSearch() {
    const upc = upcInput.value.trim();

    if (!upc) {
        showError('Please enter a UPC code');
        return;
    }

    if (!/^\d{8,13}$/.test(upc)) {
        showError('UPC code must be 8-13 digits');
        return;
    }

    hideMessages();
    loading.classList.remove('hidden');

    try {
        const data = await lookupUPC(upc);
        loading.classList.add('hidden');
        displayProduct(data);
    } catch (err) {
        loading.classList.add('hidden');
        showError('Error fetching product data. Please try again.');
        console.error(err);
    }
}

searchBtn.addEventListener('click', performSearch);

upcInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});
