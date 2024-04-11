const socket = io();

const sendProductId = (productId) => {
    socket.emit('productClicked', productId);
}

socket.on('productList', function(productList) {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = '';
    productList.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.status ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<i class="bi bi-x-circle-fill text-danger"></i>'}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm delete-product-btn" data-product-id="${product._id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tr.addEventListener('click', () => {
            sendProductId(product._id);
        });

        productListElement.appendChild(tr);
    });
});

const sendFormData = () => {
    event.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        status: true,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnails: []
    };

    socket.emit('addProduct', formData);

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('category').value = '';
};

document.getElementById('add-product-btn').addEventListener('click', sendFormData);