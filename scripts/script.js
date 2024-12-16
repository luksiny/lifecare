if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/lifecare/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        }, err => {
          console.log('Service Worker registration failed:', err);
        });
    });
  }


  
  
  /*-------------------------------------------medicine orderpage----------------------------------------------------------------------------*/



// Initialize orderItems array
let orderItems = [];

const orderItemsContainer = document.getElementById('orderItems');
const totalPriceElem = document.getElementById('totalPrice');
let totalPrice = 0;

// Add medicine to the order
function addToCart(name, price,quantityInput) {
    const quantity = parseInt(quantityInput.value);
    const itemIndex = orderItems.findIndex(item => item.name === name);

    if (quantity > 0) {
        if (itemIndex > -1) {
            orderItems[itemIndex].quantity = quantity;
        } else {
            orderItems.push({ name, quantity, price });
        }
    } else if (itemIndex > -1) {
        orderItems.splice(itemIndex, 1);
    }

    updateOrderSummary();
}

function updateOrderSummary() {
    orderItemsContainer.innerHTML = '';
    totalPrice = 0;
    orderItems.forEach(item => {
        const itemTotal = item.quantity * item.price;
        totalPrice += itemTotal;
        orderItemsContainer.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toFixed(2)}</td><td>$${itemTotal.toFixed(2)}</td></tr>`;
    });
    totalPriceElem.innerText = `total price : ${totalPrice.toFixed(2)}`;
}

// Save orders to local storage
function saveToFavourites() {
    if (orderItems.length > 0) {
        localStorage.setItem('favoriteOrder', JSON.stringify(orderItems));
        alert('Favorite order saved successfully!');
    } else {
        alert('Order is empty. Add items to save as a favorite.');
    }
}

// Apply the favorite order from local storage
document.getElementById('applyFavorite').addEventListener('click', () => {
    const favoriteOrder = localStorage.getItem('favoriteOrder');
    if (favoriteOrder) {
        const parsedOrder = JSON.parse(favoriteOrder);
        // Clear current order
        orderItems.length = 0;

        // Set quantities from the favorite order
        parsedOrder.forEach(item => {
          orderItems.push(item)
        });
        updateOrderSummary();
        alert('Favorite order applied successfully!');
    } else {
        alert('No favorite order found. Save an order as a favorite first.');
    }
});

// Handle "Buy Now" button
document.getElementById('buyNow').addEventListener('click', () => {
    if (orderItems.length > 0) {
        localStorage.setItem('currentOrder', JSON.stringify(orderItems));
        window.location.href = 'checkout.html';
    } else {
        alert('Your order is empty. Please add items to your order before proceeding to checkout.');
    }
});


if (document.getElementById('orderForm')) {
    document.getElementById('orderForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const paymentInfo = document.getElementById('payment').value;

        if (name && address && paymentInfo) {
            // Create delivery date only when inputs are valid
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 7);

            document.getElementById('thankYouMessage').innerHTML = `
                <p>Thank you, ${name}, for your purchase!</p>
                <p>Your order will be delivered to ${address} by ${deliveryDate.toDateString()}.</p>
            `;

            document.getElementById('thankYouMessage').style.display = 'block';
            document.getElementById('orderForm').style.display = 'none';
        } else {
            // Define delivery date separately for the alert
            const today = new Date();
            today.setDate(today.getDate() + 7);

            alert(`Please fill in all the required details. The estimated delivery date is ${today.toDateString()}.`);
        }
    });
}


    
// Load order summary on checkout page
if (document.getElementById('checkoutOrderSummary')) {
    const currentOrder = localStorage.getItem('currentOrder');
    if (currentOrder) {
        const parsedOrder = JSON.parse(currentOrder);
        const checkoutOrderSummary = document.getElementById('checkoutOrderSummary');
        let checkoutTotalPrice = 0;

        parsedOrder.forEach(item => {
            const itemTotal = item.quantity * item.price;
            checkoutTotalPrice += itemTotal;
            checkoutOrderSummary.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toFixed(2)}</td><td>$${itemTotal.toFixed(2)}</td></tr>`;
        });

        document.getElementById('checkoutTotalPrice').innerText = `$${checkoutTotalPrice.toFixed(2)}`;
    }
}



   