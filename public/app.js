var budgetController = (() => {
    var Expense = (id, description, value) => {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = (totalIncome) => {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = () => {
        return this.percentage;
    }
    var Income = (id, description, value) => {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = (type) => {
        var sum = 0;
        data.allItems[type].forEach((current) => {
            sum += current.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };
    return {
        addItem: (type, desc, val) => {
            var newItem, id;
            // create new id
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            // create new item
            if (type === 'inc') {
                newItem = new Income(id, desc, val);
            } else if (type === 'exp') {
                newItem = new Expense(id, desc, val);
            }
            // push new item into our data structure
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: (type, id) => {
            var ids, index;
            ids = data.allItems[type].map((current) => {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: () => {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.budget) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: () => {

        },
        getPercentages: () => {
            var allPercentage = data.allItems.exp.map((current) => {
                return current.getPercentage();
            });
            return allPercentage;
        },
        getBudget: () => {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        }

    }
})();

var UIController = (() => {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
    }
    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: (obj, type) => {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i>D</i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i>D</i></button></div></div></div>';
            }
            // Replace the placeholder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: (selectorId) => {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        },
        clearFields: () => {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach((current, index, array) => {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: (obj) => {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },
        getDOMstrings: () => {
            return DOMstrings;
        }
    }
})();

var controller = ((budgetCtrl, UICtrl) => {
    var setEventListeners = () => {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    var updateBudget = () => {
        // calculate the budget
        budgetCtrl.calculateBudget();
        // return the budget
        var budget = budgetCtrl.getBudget();
        // display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    var updatePercentages = () => {
        // calculate the percentage
        data.allItems.exp.forEach((current) => {
            current.calcPercentage();
        });
        // read percentages form the budget controller

        // update the UI with the new percentages

    };

    var ctrlAddItem = () => {
        var input, newItem;
        // get the field input data
        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            // clear fields
            UICtrl.clearFields();
            // calculate and update the budget
            updateBudget();
            // calculate and update percentages
            updatePercentages();
        }
    };
    var ctrlDeleteItem = (event) => {
        var itemId, splitId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);
            // Delete the item form data structure
            budgetCtrl.deleteItem(type, id);
            // Delete the item the UI
            UICtrl.deleteListItem(itemId);
            // update and show the budget 
            updateBudget();
            // calculate and update the percentages
            updatePercentages();
        }
    };
    return {
        init: () => {
            UICtrl.displayBudget({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: -1
            });
            setEventListeners();
        }
    }
})(budgetController, UIController);
controller.init();