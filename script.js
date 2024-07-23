let confirmButton = document.querySelector('.ifOrderExist .confirmOrderButton');
confirmButton.addEventListener('click', (event) => {
    event.stopPropagation()
     document.querySelector('.orderConfirmedBanner').classList.add('active')
    confirmOrder()
})

let cartButtons = document.querySelectorAll('.add-to-cart');
cartButtons.forEach(button => {
    button.addEventListener('click', clickHandler)
})

function clickHandler(event) {
    toggleWhileCartUpdation(event.currentTarget)
}

function toggleWhileCartUpdation(button) {
    let parentInfo = button.parentNode
    parentInfo.querySelector('img').style.border='3px solid #c73b0f';    
    let dishInfo = parentInfo.querySelector('.name-list')
    let dishName = dishInfo.children[0].innerHTML
    let price = dishInfo.children[2].innerHTML
    addDishToCart(dishName, price, button)
    button.removeEventListener('click', clickHandler)
    let plus = button.querySelector('.plus')
    let minus = button.querySelector('.minus')
    plus.style.display = 'block'
    minus.style.display = 'block'
    button.style.backgroundColor = "#C73B0F";
    button.style.color = "white";
    button.querySelector('.cart-icon').style.display = 'none'
    let para = button.querySelector('p')
    para.innerHTML = '1'
    if (!button.getAttribute('clicked')) {
        plus.addEventListener('click', (event) => {//This event adds 1 item to the cart
            event.stopPropagation()
            para.innerHTML = parseInt(para.innerHTML) + 1
            updateCartItem(dishName, para.innerHTML)
            calculateGrandTotal()
        })
        minus.addEventListener('click', (event) => {//This event removes 1 item to the cart
            event.stopPropagation()
            if (para.innerHTML > 1) {
                para.innerHTML = parseInt(para.innerHTML) - 1
                updateCartItem(dishName, para.innerHTML)
                calculateGrandTotal()
            } else {
                parentInfo.querySelector('img').style.border='none';
                button.querySelector('p').innerHTML = 'Add to Cart';
                button.querySelector('img').style.display = 'block'
                plus.style.display = 'none'
                minus.style.display = 'none'
                button.style.backgroundColor = "white";
                button.style.color = "black";
                button.addEventListener('click', clickHandler)
                button.setAttribute('clicked', 'true')
                deleteCartItem(dishName)
                calculateGrandTotal()
            }
        })
    }
}
function addDishToCart(name, ratePerEachItem, button) {
    let emptyIndicatorDiv = document.querySelector('.onlyIfEmpty')
    if (emptyIndicatorDiv.style.display != 'none') {
        emptyIndicatorDiv.style.display = 'none'
    }
    let cartItemIndicator = document.querySelector('.ifOrderExist')
    if (cartItemIndicator.style.display == 'none') {
        cartItemIndicator.style.display = 'block'
    }

    let htmlStringOfSingleItemInfo = `
              <div class="dishInfo">
                <div class="dishName"></div>
                <div class="rateInfo">
                  <div class="noOfItems"></div>
                  <div class="ratePerItem"></div>
                  <div class="totalRateOfDish"></div>
                </div>
              </div>
              <div class="cancelButton">
                <img src="./assets/images/icon-remove-item.svg" alt="remove icon" srcset="">
              </div>
            `
    let singleOrderInfo = document.createElement('div')
    singleOrderInfo.setAttribute('class', 'singleOrderInfo')
    singleOrderInfo.innerHTML = htmlStringOfSingleItemInfo
    singleOrderInfo.querySelector('.dishName').innerHTML = name;
    singleOrderInfo.querySelector('.noOfItems').innerHTML = 1;
    singleOrderInfo.querySelector('.ratePerItem').innerHTML = ratePerEachItem;
    singleOrderInfo.querySelector('.totalRateOfDish').innerHTML = ratePerEachItem;
    singleOrderInfo.querySelector('.dishInfo').setAttribute('dish', name)
    singleOrderInfo.querySelector('.cancelButton').addEventListener('click', () => {
        deleteCartItem(name, buttonUpdation = button)
    })
    cartItemIndicator.querySelector('.ordersInfo').appendChild(singleOrderInfo)
    calculateGrandTotal()
}

function calculateGrandTotal() {
    let totalRateOfAllDish = 0
    let totalNoOfitemInCart = 0
    let allOrder = document.querySelectorAll('.ifOrderExist .ordersInfo .singleOrderInfo')    
    allOrder.forEach((eachOrder) => {
        totalRateOfAllDish += parseFloat(eachOrder.querySelector('.totalRateOfDish').innerHTML)
        totalNoOfitemInCart += parseInt(eachOrder.querySelector('.noOfItems').innerHTML)
    })
    document.querySelector('.totalItem').innerHTML = totalNoOfitemInCart;
    document.querySelectorAll('.totalRate')[1].innerHTML = totalRateOfAllDish;

    
}

function updateCartItem(name, noOfItems) {
    let allOrder = document.querySelectorAll('.ifOrderExist .ordersInfo .singleOrderInfo')

    allOrder.forEach((eachOrder) => {
        if (eachOrder.querySelector('.dishInfo').getAttribute('dish') == name) {
            eachOrder.querySelector('.noOfItems').innerHTML = noOfItems
            eachOrder.querySelector('.totalRateOfDish').innerHTML = noOfItems * parseFloat(eachOrder.querySelector('.ratePerItem').innerHTML)
        }
    })
}
function deleteCartItem(name, buttonUpdation = false) {
    if (buttonUpdation) {
        let parentInfo = buttonUpdation.parentNode
        parentInfo.querySelector('img').style.border='none';
        let plus = buttonUpdation.querySelector('.plus')
        let minus = buttonUpdation.querySelector('.minus')
        buttonUpdation.querySelector('p').innerHTML = 'Add to Cart';
        buttonUpdation.querySelector('img').style.display = 'block'
        plus.style.display = 'none'
        minus.style.display = 'none'
        buttonUpdation.style.backgroundColor = "white";
        buttonUpdation.style.color = "black";
        buttonUpdation.addEventListener('click', clickHandler)
        buttonUpdation.setAttribute('clicked', 'true')
    }
    let allOrder = document.querySelectorAll('.ifOrderExist .ordersInfo .singleOrderInfo')
    allOrder.forEach((eachOrder) => {
        let totolNoOfDish = 0
        if (eachOrder.querySelector('.dishInfo').getAttribute('dish') == name) {
            if (parseInt(eachOrder.querySelector('.dishInfo').querySelector('.noOfItems').innerHTML) > 1) {
                totolNoOfDish -= (parseInt(eachOrder.querySelector('.dishInfo').querySelector('.noOfItems').innerHTML))
            }
            eachOrder.remove()
        }
    })
    if (allOrder.length == 1) {
        let emptyIndicatorDiv = document.querySelector('.onlyIfEmpty')
        if (emptyIndicatorDiv.style.display == 'none') {
            emptyIndicatorDiv.style.display = 'flex'
        }
        let cartItemIndicator = document.querySelector('.ifOrderExist')
        if (cartItemIndicator.style.display != 'none') {
            cartItemIndicator.style.display = 'none'
        }
    }
    calculateGrandTotal()
}

function confirmOrder() {
    let main = document.querySelector('main')
    main.style.opacity = '0.4';
    main.querySelector('article').style.pointerEvents = 'none';
    main.querySelector('.cart-details').style.pointerEvents = 'none';
    let orderConfirmedBanner = document.querySelector('.orderConfirmedBanner');
    orderConfirmedBanner.querySelector('.confirmOrderButton').style.cursor = 'pointer';
    orderConfirmedBanner.style.display = 'block';
    document.addEventListener('click', (event) => {
        if (event.target != this) {
            main.querySelector('article').style.pointerEvents = 'auto';
            main.querySelector('.cart-details').style.pointerEvents = 'auto';
            main.style.opacity = '1';
            orderConfirmedBanner.style.display = 'none';
            clearConfirmOrder()
        }
    })
    totalAmout = document.querySelector('.ifOrderExist .totalRate').innerHTML
    orderConfirmedBanner.querySelector('.totalRate').innerHTML = totalAmout
    htmlStringOfFinalOrder = `
        <div class="dishImg"><img width="100px" src="" alt=""></div>
        <div class="basicDishInfo">
          <div class="dishName"></div>
          <div class="rateInfo">
            <div class="noOfItems"></div>
            <div class="ratePerItem">5</div>
          </div>
        </div>
        <div class="totalRateOfDish">25</div>
      `
    let OrderInfo = getAllOrderInfo()
    Array.from(OrderInfo).forEach((order) => {
        let singleOrderInfo = document.createElement('div')
        singleOrderInfo.setAttribute('class', 'singleOrderInfo')
        singleOrderInfo.innerHTML = htmlStringOfFinalOrder
        singleOrderInfo.querySelector('.dishName').innerHTML = order.dishName;
        singleOrderInfo.querySelector('.noOfItems').innerHTML = order.noOfItems;
        singleOrderInfo.querySelector('.ratePerItem').innerHTML = order.ratePerItem;
        singleOrderInfo.querySelector('.totalRateOfDish').innerHTML = order.totalRateOfDish;
        singleOrderInfo.querySelector('.dishImg img').src = order.imgSrc;
        orderConfirmedBanner.querySelector('.ordersInfo').appendChild(singleOrderInfo)
    })
}

function getOrderImg(dishName) {
    let allItems = document.querySelectorAll('section')
    let imgSrc = null
    allItems.forEach((dessert) => {
        if (dessert.querySelector('li').innerHTML == dishName) {
            imgSrc = dessert.querySelector('img').src;
        }
    })
    return imgSrc;
}

function getAllOrderInfo() {
    let allOrderInfo = document.querySelectorAll('.ifOrderExist .ordersInfo .singleOrderInfo')
    let orderInfoList = new Set()
    allOrderInfo.forEach((orderInfo) => {
        let dishName = orderInfo.querySelector('.dishName').innerHTML;
        let noOfItems = orderInfo.querySelector('.noOfItems').innerHTML;
        let ratePerItem = orderInfo.querySelector('.ratePerItem').innerHTML;
        let totalRateOfDish = orderInfo.querySelector('.totalRateOfDish').innerHTML;
        let imgSrc = getOrderImg(dishName);
        orderInfo = { dishName, noOfItems, ratePerItem, totalRateOfDish, imgSrc }
        orderInfoList.add(orderInfo);

    })
    return orderInfoList;
}

function clearConfirmOrder(){
    let orderConfirmedBanner = document.querySelector('.orderConfirmedBanner')
    orderConfirmedBanner.classList.remove('active')
    orderConfirmedBanner.querySelector('.ordersInfo').innerHTML=null;
}
