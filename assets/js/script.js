/* SLIDER */
const foodSlider = tns({
    container: '#food-options',
    items: 2,
    controls: false,
    mouseDrag: true,
    touch: true,
    loop: false,
    nav: false,
});

const drinkSlider = tns({
    container: '#drink-options',
    items: 2,
    controls: false,
    mouseDrag: true,
    touch: true,
    loop: false,
    nav: false,
});

const dessertSlider = tns({
    container: '#dessert-options',
    items: 2,
    controls: false,
    mouseDrag: true,
    touch: true,
    loop: false,
    nav: false,
});

/* FUNCTIONALITIES */
function selection() {
    const el = event.target;
    const index = el.id.indexOf('-')
    const nameCategory = el.id.slice(0, index);

    removeSelection(nameCategory);
    addSelection(el);
    const total = addPriceAndTotal(el, nameCategory);

    if (total) {
        changeButton(total);
    }
}

function modalPedido() {
    const modal = document.getElementById("totalModal");

    modal.style.display = "block";

    const close = document.getElementsByClassName("close")[0];
    close.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

function changeButton(total) {
    const button = document.getElementById('order-button');
    button.innerText = `Fechar pedido - Total: R$ ${total.replace('.', ',')}`;
    button.style.backgroundColor = '#32B72F';
    button.removeAttribute('disabled');
}

function removeSelection(nameCategory) {
    const elements = document.querySelectorAll(`#${nameCategory}-options .option`);
    elements.forEach(element => {
        element.style.border = 'none';
        element.style.padding = '18px 14px 13px 14px';
    })
}

function addSelection(el) {
    el.style.border = '10px solid #50D074';
    el.style.padding = '8px 4px 3px 4px';
}

function addPriceAndTotal(el, nameCategory) {
    let price = el.childNodes[7].innerText;
    let name = el.childNodes[3].innerText;
    price = price.replace('R$', '').trim().replace(',', '.');

    let total = Number(sessionStorage.getItem('total'));
    const oldItem = JSON.parse(sessionStorage.getItem(nameCategory)) ?? false;

    if (oldItem) {
        total -= oldItem.price;
    }

    total += Number(price);

    const productData = {
        name, price
    };

    sessionStorage.setItem(nameCategory, JSON.stringify(productData));
    sessionStorage.setItem('total', total.toString());

    if (sessionStorage.length === 4) {
        return Number(total).toFixed(2);
    }

    return false;
}