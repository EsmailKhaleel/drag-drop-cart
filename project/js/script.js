document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded After DOM Ready!");
let products = document.querySelectorAll('.product');
let upper = document.getElementById('imageswrapper');
let lower = document.getElementById('dropwrapper');
let cart = document.getElementById('cart');
let totalPriceElement = document.getElementById('totalPrice');
let resetBtn = document.getElementById('resetBtn');
let totalPrice = 0;
// Store initial stock values
let initialStock = {};
document.querySelectorAll('.product').forEach(product => {
    let productId = product.dataset.id;
    let stock = parseInt(product.dataset.stock);
    initialStock[productId] = stock; // Store original stock
});
// Attach drag events
products.forEach(product => {
    product.setAttribute('draggable', 'true');
    product.addEventListener('dragstart', startDrag);
});

upper.addEventListener('dragleave', leaveDrag);
lower.addEventListener('drop', dropped);
lower.addEventListener('dragenter', enterDrag);
lower.addEventListener('dragover', overDrag);
lower.addEventListener('dragleave', leaveLower);
resetBtn.addEventListener('click', resetCart);

function startDrag(e) {
    let productDiv = e.target.closest('.product');
    let productId = productDiv.dataset.id;
    let price = parseFloat(productDiv.dataset.price);
    let stock = parseInt(productDiv.dataset.stock);
    let imgElement = productDiv.querySelector('img');

    if (stock > 0) {
        e.dataTransfer.setData('id', productId);
        e.dataTransfer.setData('price', price);
        e.dataTransfer.setData('imgHTML', imgElement.outerHTML);
    } else {
        e.preventDefault();
    }
}

function dropped(e) {
    e.preventDefault();
    let productId = e.dataTransfer.getData('id');
    let price = parseFloat(e.dataTransfer.getData('price'));
    let imgHTML = e.dataTransfer.getData('imgHTML');
    let productDiv = document.querySelector(`.product[data-id="${productId}"]`);
    let stockElement = productDiv.querySelector('.stock');
    let stock = parseInt(productDiv.dataset.stock);

    if (stock > 0) {
        productDiv.dataset.stock = stock - 1;
        stockElement.innerText = `Stock: ${stock - 1}`;

        let cartItem = cart.querySelector(`.cart-item[data-id="${productId}"]`);
        if (cartItem) {
            let quantityElement = cartItem.querySelector('.quantity');
            let quantity = parseInt(quantityElement.innerText);
            quantityElement.innerText = quantity + 1;
        } else {
            let newCartItem = document.createElement('div');
            newCartItem.classList.add('cart-item');
            newCartItem.dataset.id = productId;
            newCartItem.innerHTML = `
                    <div class="cart-item-info">
                        ${imgHTML}
                        <span class="cart-item-name">${productDiv.querySelector('.product-title').innerText}</span>
                    </div>
                    <div class="cart-item-details">
                        <p class="cart-item-quantity">Qty: <span class="quantity">1</span></p>
                        <p class="cart-item-price">$${price}</p>
                    </div>
                    <button class="remove-btn">Remove</button>
                `;
            newCartItem.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(productId, price));
            cart.appendChild(newCartItem);
        }

        totalPrice += price;
        totalPriceElement.innerText = totalPrice.toFixed(2);

        if (stock - 1 === 0) {
            productDiv.style.opacity = '0.5';
        }
    }
}

function removeFromCart(productId, price) {
    let cartItem = cart.querySelector(`.cart-item[data-id="${productId}"]`);
    let quantityElement = cartItem.querySelector('.quantity');
    let quantity = parseInt(quantityElement.innerText);

    if (quantity > 1) {
        quantityElement.innerText = quantity - 1;
    } else {
        cartItem.remove();
    }

    let productDiv = document.querySelector(`.product[data-id="${productId}"]`);
    let stockElement = productDiv.querySelector('.stock');
    let stock = parseInt(productDiv.dataset.stock);
    productDiv.dataset.stock = stock + 1;
    stockElement.innerText = `Stock: ${stock + 1}`;
    productDiv.style.opacity = '1';

    totalPrice -= price;
    totalPriceElement.innerText = totalPrice.toFixed(2);
}

function enterDrag(e) {
    e.preventDefault();
}

function overDrag(e) {
    e.preventDefault();
    e.target.classList.add('dropZone');
}

function leaveLower(e) {
    e.preventDefault();
    e.target.classList.remove('dropZone');
}

function leaveDrag(e) {
    e.preventDefault();
}

function resetCart() {
    cart.innerHTML = '';
    totalPrice = 0;
    totalPriceElement.innerText = '0.00';

    document.querySelectorAll('.product').forEach(product => {
        let productId = product.dataset.id;
        let originalStock = initialStock[productId]; // Get stored stock value
        product.dataset.stock = originalStock;
        product.querySelector('.stock').innerText = `Stock: ${originalStock}`;
        product.style.opacity = '1';
    });
}
});