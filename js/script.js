const products = [
    {
        "id": 1,
        "name": "வேர்க்கடலைலட்டு",
        "description": "நாட்டு சர்க்கரை, இயற்கை வேர்க்கடலை சேர்த்து செய்யப்பட்டவை.",
        "mrp": "₹ 350/kg",
        "price": "₹ 300/kg",
        "product_unit": "kg",
        "image": "images/Peanut-ladoo.png",
        "quantities": [
            { "value": 0, "label": "அளவை கொடுக்கவும்" },
            { "value": 0.25, "label": "250 g" },
            { "value": 0.5, "label": "500 g" },
            { "value": 1, "label": "1 kg" },
            { "value": 2, "label": "2 kg" },
            { "value": 3, "label": "3 kg" }
        ]
    },
    {
        "id": 2,
        "name": "எள்ளு லட்டு",
        "description": "எள்ளு லட்டு, கருப்பட்டி வெல்லம் சேர்த்து செய்யப்பட்டவை",
        "mrp": "₹ 500/kg",
        "price": "₹ 450/kg",
        "product_unit": "kg",
        "image": "images/Ellu_laddu.png",
        "quantities": [
            { "value": 0, "label": "அளவை கொடுக்கவும்" },
            { "value": 0.25, "label": "250 g" },
            { "value": 0.5, "label": "500 g" },
            { "value": 1, "label": "1 kg" },
            { "value": 2, "label": "2 kg" },
            { "value": 3, "label": "3 kg" }
        ]
    },
    {
        "id": 3,
        "name": "திணை லட்டு",
        "description": "திணை லட்டு, நாட்டு சர்க்கரை சேர்த்து செய்யப்பட்டவை.",
        "mrp": "₹ 600/kg",
        "price": "₹ 530/kg",
        "product_unit": "kg",
        "image": "images/Thinai-laddu.jpg",
        "quantities": [
            { "value": 0, "label": "அளவை கொடுக்கவும்" },
            { "value": 0.25, "label": "250 g" },
            { "value": 0.5, "label": "500 g" },
            { "value": 1, "label": "1 kg" },
            { "value": 2, "label": "2 kg" },
            { "value": 3, "label": "3 kg" }
        ]
    }
];

// Initialize cart and total amount
let cart = [];
let totalAmount = 0;

// Function to load products from the JavaScript object
function loadProducts() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const quantityOptions = product.quantities.map(quantity => `
            <option value="${quantity.value}">${quantity.label}</option>
        `).join('');
        
		const productCard = `
		<div class="col-lg-4 col-md-6 mb-4">
			<div class="card">
				<img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
				<div class="card-body">
					<h5 class="card-title product-title">${product.name}</h5>
					<p class="card-text product-description">${product.description}</p>
					<p class="mrp product-mrp"><s>${product.mrp}</s></p>
					<p class="price product-price"><strong>${product.price}</strong></p>
					<label for="quantity-${product.id}" class="form-label product-quantity-label">அளவைத் தேர்வு செய்க: (${product.product_unit})</label>
					<select id="quantity-${product.id}" class="form-select quantity product-quantity" data-product-name="${product.name}">
						${quantityOptions}
					</select>
				</div>
			</div>
		</div>
        `;
        productList.insertAdjacentHTML('beforeend', productCard);
    });

    // Attach change event to quantity selects
    document.querySelectorAll('.quantity').forEach(select => {
        select.addEventListener('change', (e) => {
            const productName = e.target.getAttribute('data-product-name');
            const quantity = parseFloat(e.target.value);
            const priceText = e.target.closest('.card-body').querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('₹ ', '').replace('/kg', '').replace('/jar', ''));

            // If quantity is selected (not 0), add to cart, else remove from cart
            if (quantity > 0) {
                addToCart(productName, quantity, price);
            } else {
                removeFromCartByName(productName); // Remove the item if quantity is set to 0
            }
        });
    });

    // Attach hover events to each product card
    document.querySelectorAll('.card').forEach(card => {
        const quantitySelect = card.querySelector('.product-quantity');

        card.addEventListener('mouseenter', () => {
            quantitySelect.classList.add('highlight');
        });

        card.addEventListener('mouseleave', () => {
            quantitySelect.classList.remove('highlight');
        });
    });
}	

// Call the loadProducts function on page load
window.onload = loadProducts;

// Function to add an item to the cart
function addToCart(productName, quantity, price) {
    const totalPrice = quantity * price;
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity = quantity; // Update to new quantity directly
        existingItem.totalPrice = totalPrice; // Update the total price accordingly
    } else {
        cart.push({ name: productName, quantity, price, totalPrice });
    }

    updateCartBadge();
    updateCartModal();
	showCartNotification(); // Show notification to encourage user to check the cart
}

// Function to remove an item from the cart by name
function removeFromCartByName(productName) {
    const index = cart.findIndex(item => item.name === productName);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartBadge();
        updateCartModal();
    }
}

// Function to update cart badge
function updateCartBadge() {
    document.getElementById('cart-badge').innerText = cart.length;
}

// Function to update cart modal
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>தயவுசெய்து தேவையான பொருட்களைச் சேர்க்கவும்!</p>';
        cartTotal.innerText = '₹ 0.00';
        return;
    }

    let cartHTML = '';
    totalAmount = 0;
    cart.forEach(item => {
        const { name, quantity, price, totalPrice } = item;
        totalAmount += totalPrice;

        cartHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <strong>${name}</strong><br>
                    ${quantity} at ₹ ${price}/kg
                </div>
                <div>
                    <strong>₹ ${totalPrice.toFixed(2)}</strong>
                    <button class="btn btn-sm btn-danger ms-3" onclick="removeFromCartByName('${name}')">நீக்கவும்</button>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    cartTotal.innerText = `₹ ${totalAmount.toFixed(2)}`;
}

// Attach click event for cart icon to review the cart
document.getElementById('cart-icon').addEventListener('click', updateCartModal);

// Function to generate WhatsApp link
function generateWhatsAppLink() {
    let message = "வணக்கம், நான் ஆர்டர் செய்ய விரும்புகிறேன்:\n";
    let totalPrice = 0;

    cart.forEach(item => {
        message += `${item.quantity} x ${item.name} at ₹ ${item.price}/kg\n`;
        totalPrice += item.totalPrice;
    });

    message += `மொத்தம்: ₹ ${totalPrice.toFixed(2)}`;
    const whatsappNumber = '9047812407'; // Replace with your WhatsApp number
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open the WhatsApp link
    window.open(whatsappLink, '_blank');
}

// Event Listener for Place Order button
document.getElementById('place-order').addEventListener('click', generateWhatsAppLink);

// Function to handle zooming when the product is in the middle of the screen
function handleZoomOnScroll() {
    const productImages = document.querySelectorAll('.product-image');

    productImages.forEach(image => {
        const rect = image.getBoundingClientRect(); // Get the position of the image relative to the viewport
        const windowHeight = window.innerHeight; // Height of the viewport
        const imageCenter = rect.top + rect.height / 2; // Calculate the image's vertical center
        const screenCenter = windowHeight / 2; // Calculate the screen's vertical center

        // Check if the image's center is near the screen's center
        if (Math.abs(imageCenter - screenCenter) < rect.height / 2) {
            // Zoom the image as it gets closer to the center of the screen
            image.style.transform = `scale(1.2)`;
        } else {
            image.style.transform = 'scale(1)'; // Reset zoom if out of the center
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', handleZoomOnScroll);


// Function to show cart notification below the cart icon
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-arrow"></div>
        <div class="notification-content">
            <strong>பொருள் சேர்க்கப்பட்டது!</strong><span class="small-text">ஆர்டர் செய்ய உங்கள் கூடியைச் சரிபார்க்கவும்.</span>.
        </div>
    `;

    const cartIcon = document.getElementById('cart-icon');
    cartIcon.insertAdjacentElement('afterend', notification); // Place notification below the cart icon

    // Automatically remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500); // Delay for fade-out effect
    }, 3000);
}

// JavaScript for handling menu popup
const menuIcon = document.getElementById('menu-icon');
const menuPopup = document.getElementById('menu-popup');

// Function to show the popup menu
function showPopup() {
    const rect = menuIcon.getBoundingClientRect(); // Get the position of the menu icon
    menuPopup.style.top = `${rect.bottom + window.scrollY}px`; // Position below the menu icon
    menuPopup.style.right = `10px`; // Align it to the right
    menuPopup.style.display = 'block'; // Show the menu
}

// Show popup menu when the menu icon is clicked
menuIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    if (menuPopup.style.display === 'block') {
        menuPopup.style.display = 'none'; // Hide if already visible
    } else {
        showPopup(); // Show the popup and set its position
    }
});

// Hide popup menu when clicking outside the menu
document.addEventListener('click', (e) => {
    if (!menuPopup.contains(e.target) && e.target !== menuIcon) {
        menuPopup.style.display = 'none'; // Hide the menu if clicked outside
    }
});

// Hide the menu when a link is clicked and smooth scroll
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        menuPopup.style.display = 'none'; // Hide the menu on link click
    });
});

// Function to highlight quantity select boxes during scrolling
function highlightQuantityOnScroll() {
    // Get all quantity select elements
    const quantitySelects = document.querySelectorAll('.product-quantity');

    // Add the highlight class
    quantitySelects.forEach(select => {
        select.classList.add('highlight');
    });

    // Remove the highlight class after 2 seconds
    setTimeout(() => {
        quantitySelects.forEach(select => {
            select.classList.remove('highlight');
        });
    }, 2000); // 2 seconds duration
}

// Detect scroll event on mobile
let isMobile = window.matchMedia("(max-width: 768px)").matches; // Adjust breakpoint as needed
if (isMobile) {
    let timer;

    window.addEventListener('scroll', () => {
        clearTimeout(timer);

        // Highlight the select boxes if scrolling stops
        timer = setTimeout(() => {
            highlightQuantityOnScroll();
        }, 150); // Trigger after scrolling has paused for 150ms
    });
}





