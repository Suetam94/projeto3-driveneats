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

async function addressModal(el = false) {

    if (el && el.value.length === 8) {
        el.setAttribute('readonly', '');
        const addressData = await consultCep(el.value);

        if (addressData.erro) {
            const cepAlert = document.getElementById('cep-alert');
            cepAlert.style.display = 'block';
            el.removeAttribute('readonly');
        }

        sessionStorage.setItem('address', JSON.stringify(addressData));
        const completeAddress = document.getElementById('complete-address');
        completeAddress.style.display = 'block';

        // Put the address in to the form inputs;
        completeAddress.childNodes[1].control.value = addressData.logradouro;
        completeAddress.childNodes[5].control.value = addressData.bairro;
        completeAddress.childNodes[7].control.value = addressData.localidade;
        completeAddress.childNodes[9].control.value = addressData.uf;
    }

    const modal = document.getElementById("addressModal");
    const header = document.querySelector('header');

    header.style.zIndex = '0';
    modal.style.display = "block";

    const close = document.getElementsByClassName("close")[1];
    close.onclick = function () {
        header.style.zIndex = '1';
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            header.style.zIndex = '1';
            modal.style.display = "none";
        }
    }
}

async function consultCep(cep) {
    return fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => data);
}

function modalPedido() {
    document.getElementById("addressModal").style.display = 'none';
    const modal = document.getElementById("totalModal");
    const header = document.querySelector('header');

    modalData();

    header.style.zIndex = '0';
    modal.style.display = "block";

    const close = document.getElementsByClassName("close")[0];
    close.onclick = function () {
        header.style.zIndex = '1';
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            header.style.zIndex = '1';
            modal.style.display = "none";
        }
    }
}

function modalData() {
    const modalData = document.getElementById('modalData');
    const food = JSON.parse(sessionStorage.getItem('food'));
    const drink = JSON.parse(sessionStorage.getItem('drink'));
    const dessert = JSON.parse(sessionStorage.getItem('dessert'));
    const total = Number(sessionStorage.getItem('total')).toFixed(2);
    const address = JSON.parse(sessionStorage.getItem('address'));
    const customerName = document.getElementById('formData').childNodes[1].control.value ?? 'N??o informado';
    const addressNumber = document.getElementById('formData').childNodes[7].children[1].control.value ?? 's/n'

    const confirmBtn = document.getElementById('confirm-button');

    const whatsappText = encodeURI(`Ol??, gostaria de fazer o pedido:
- Prato: ${food.name}
- Bebida: ${drink.name}
- Sobremesa: ${dessert.name}
Total: R$ ${total.replace('.', ',')}
Nome: ${customerName}
Endere??o: ${address.logradouro}, ${addressNumber},${address.bairro}, ${address.localidade}, ${address.uf}`);

    const url = ' https://wa.me/5549988408008?text=';

    confirmBtn.setAttribute('href', url + whatsappText);
    confirmBtn.setAttribute('target', '_blank');


    modalData.innerHTML = `
        <li class="summary">
          <span>Nome</span>
          <span>${customerName}</span>
        </li>
        <li class="summary">
          <span>Endere??o</span>
          <span>${address.logradouro}, ${addressNumber}</span>
        </li>
        <li class="summary">
          <span>${food.name}</span>
          <span>R$ ${food.price.replace('.', ',')}</span>
        </li>
        <li class="summary">
           <span>${drink.name}</span>
          <span>R$ ${drink.price.replace('.', ',')}</span>
        </li>
        <li class="summary">
          <span>${dessert.name}</span>
          <span>R$ ${dessert.price.replace('.', ',')}</span>
        </li>
        <li class="total">
          <span>TOTAL</span>
          <span>R$ ${total.replace('.', ',')}</span>
        </li>
    `;
}

function changeButton(total) {
    const button = document.getElementById('order-button');
    button.innerText = `Fechar pedido - Total: R$ ${total.replace('.', ',')}`;
    button.style.backgroundColor = '#32B72F';
    button.removeAttribute('disabled');
}

function removeSelection(nameCategory) {
    const elements = document.querySelectorAll(`#${nameCategory}-options .option`);
    const checked = document.querySelector(`#${nameCategory}-options .option .check`);

    if (checked) {
        checked.classList.remove('check');
    }

    elements.forEach(element => {
        element.style.border = 'none';
        element.style.padding = '18px 14px 13px 14px';
    })
}

function addSelection(el) {
    const priceSpan = el.childNodes[7];
    el.style.border = '10px solid #50D074';
    el.style.padding = '8px 4px 3px 4px';
    priceSpan.classList.add('check');
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