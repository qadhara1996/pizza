document.addEventListener('DOMContentLoaded', function() {
    const prices = {
        base: {
            base1: 10,
            base2: 12,
            base3: 15,
            base4: 18
        },
        ingredient1: {
            'ing1.1': 3,
            'ing1.2': 4,
            'ing1.3': 5,
            'ing1.4': 6
        },
        ingredient2: {
            'ing2.1': 2,
            'ing2.2': 3,
            'ing2.3': 4,
            'ing2.4': 5
        },
        sauce: {
            sauce1: 1,
            sauce2: 1.5,
            sauce3: 2,
            sauce4: 2.5
        }
    };
    
    const currentSelection = {
        base: null,
        ingredient1: [],
        ingredient2: [],
        sauce: null
    };
    
    const orderBtn = document.getElementById('order-btn');
    const buildStage = document.getElementById('build-stage');
    
    document.querySelectorAll('.ingredient-option').forEach(option => {
        option.addEventListener('click', function() {
            const type = this.dataset.type;
            const value = this.dataset.value;
            const name = this.dataset.name;
            
            if (type === 'ingredient1' || type === 'ingredient2') {
                if (this.classList.contains('selected')) {
                    removeSelectedItem(type, value);
                    this.classList.remove('selected');
                    currentSelection[type] = currentSelection[type].filter(item => item !== value);
                } 
                else if (currentSelection[type].length < 2) {
                    this.classList.add('selected');
                    addSelectedItem(type, value, name);
                    currentSelection[type].push(value);
                } else {
                    alert(`Можно выбрать не более 2 ингредиентов в категории ${type === 'ingredient1' ? 'Ингредиент 1' : 'Ингредиент 2'}`);
                    return;
                }
            } 
            else {
                if (this.classList.contains('selected')) {
                    removeSelectedItem(type, value);
                    this.classList.remove('selected');
                    currentSelection[type] = null;
                } 
                else {
                    if (currentSelection[type] !== null) {
                        removeSelectedItem(type, currentSelection[type]);
                        document.querySelector(`.ingredient-option[data-type="${type}"][data-value="${currentSelection[type]}"]`)
                            .classList.remove('selected');
                    }
                    
                    this.classList.add('selected');
                    addSelectedItem(type, value, name);
                    currentSelection[type] = value;
                }
            }
            
            updatePizzaView();
            
            updatePrice();
            
            updateBuildStage();
            
            checkOrderButton();
            
            updateOptionsAvailability();
        });
    });
    
    function updateOptionsAvailability() {
        document.querySelectorAll('.ingredient-option').forEach(option => {
            const type = option.dataset.type;
            
            if (type === 'ingredient1' || type === 'ingredient2') {
                if (currentSelection[type].length >= 2 && !option.classList.contains('selected')) {
                    option.classList.add('max-selected');
                } else {
                    option.classList.remove('max-selected');
                }
            }
        });
    }
    
    function updatePizzaView() {
        document.querySelectorAll('.pizza-image').forEach(img => {
            img.classList.remove('active');
        });
        
        if (currentSelection.base && currentSelection.sauce && 
            currentSelection.ingredient1.length > 0 && currentSelection.ingredient2.length > 0) {
            document.getElementById('pizza-full').classList.add('active');
        } else if (currentSelection.base && currentSelection.ingredient1.length > 0 && currentSelection.ingredient2.length > 0 || currentSelection.base && currentSelection.ingredient1.length > 0 && currentSelection.sauce || currentSelection.base && currentSelection.ingredient2.length > 0 && currentSelection.sauce || currentSelection.ingredient1.length > 0 && currentSelection.ingredient2.length > 0 && currentSelection.sauce) {
            document.getElementById('pizza-ing2').classList.add('active');
        } else if (currentSelection.base && currentSelection.ingredient1.length > 0 || currentSelection.base && currentSelection.ingredient2.length > 0 || currentSelection.base && currentSelection.sauce || currentSelection.ingredient1.length > 0 && currentSelection.ingredient2.length > 0 || currentSelection.ingredient1.length > 0 && currentSelection.sauce || currentSelection.ingredient2.length > 0 && currentSelection.sauce) {
            document.getElementById('pizza-ing1').classList.add('active');
        } else if (currentSelection.base || currentSelection.sauce || currentSelection.ingredient1.length > 0 || currentSelection.ingredient2.length > 0) {
            document.getElementById('pizza-base').classList.add('active');
        } else {
            document.getElementById('pizza-empty').classList.add('active');
        }
    }
    
    function updateBuildStage() {
        if (!currentSelection.base) {
            buildStage.textContent = "Выберите основу";
        } else if (currentSelection.ingredient1.length === 0) {
            buildStage.textContent = "Выберите первый ингредиент (до 2)";
        } else if (currentSelection.ingredient2.length === 0) {
            buildStage.textContent = "Выберите второй ингредиент (до 2)";
        } else if (!currentSelection.sauce) {
            buildStage.textContent = "Выберите соус";
        } else {
            buildStage.textContent = "Пицца готова к заказу!";
        }
    }
    
    function checkOrderButton() {
        const allSelected = currentSelection.base && 
                           currentSelection.ingredient1.length > 0 && 
                           currentSelection.ingredient2.length > 0 && 
                           currentSelection.sauce;
        orderBtn.disabled = !allSelected;
    }
    
    function addSelectedItem(type, value, name) {
        const selectedItems = document.getElementById('selected-items');
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.textContent = name;
        item.dataset.type = type;
        item.dataset.value = value;
        
        item.addEventListener('click', function() {
            removeSelectedItem(type, value);
            document.querySelector(`.ingredient-option[data-type="${type}"][data-value="${value}"]`)
                .classList.remove('selected');
            
            if (type === 'ingredient1' || type === 'ingredient2') {
                currentSelection[type] = currentSelection[type].filter(item => item !== value);
            } else {
                currentSelection[type] = null;
            }
            
            updatePizzaView();
            updatePrice();
            updateBuildStage();
            checkOrderButton();
            updateOptionsAvailability();
        });
        
        selectedItems.appendChild(item);
    }
    
    function removeSelectedItem(type, value) {
        const item = document.querySelector(`.selected-item[data-type="${type}"][data-value="${value}"]`);
        if (item) item.remove();
    }
    
    function updatePrice() {
        let total = 0;
        
        if (currentSelection.base) total += prices.base[currentSelection.base];
        
        currentSelection.ingredient1.forEach(ing => {
            total += prices.ingredient1[ing];
        });
        
        currentSelection.ingredient2.forEach(ing => {
            total += prices.ingredient2[ing];
        });
        
        if (currentSelection.sauce) total += prices.sauce[currentSelection.sauce];
        
        document.getElementById('total-price').textContent = total;
    }
    
    orderBtn.addEventListener('click', function() {
        const orderInfo = {
            base: {
                name: document.querySelector(`.ingredient-option[data-type="base"][data-value="${currentSelection.base}"]`).dataset.name,
                price: prices.base[currentSelection.base]
            },
            ingredient1: currentSelection.ingredient1.map(value => ({
                name: document.querySelector(`.ingredient-option[data-type="ingredient1"][data-value="${value}"]`).dataset.name,
                price: prices.ingredient1[value]
            })),
            ingredient2: currentSelection.ingredient2.map(value => ({
                name: document.querySelector(`.ingredient-option[data-type="ingredient2"][data-value="${value}"]`).dataset.name,
                price: prices.ingredient2[value]
            })),
            sauce: {
                name: document.querySelector(`.ingredient-option[data-type="sauce"][data-value="${currentSelection.sauce}"]`).dataset.name,
                price: prices.sauce[currentSelection.sauce]
            },
            total: document.getElementById('total-price').textContent + '$'
        };
        
        console.log('Информация о заказе:', orderInfo);
        alert('Ваш заказ успешно оформлен!\nПицца готовится и скоро будет доставлена.');
    });
});
