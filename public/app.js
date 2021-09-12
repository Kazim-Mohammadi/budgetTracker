var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
        budget: 0,
        percentage: -1,
    };
    return {
        addItem: function(type, desc, val) {
            var newItem, id;
            // create new id
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            // create new item
            if (type === "inc") {
                newItem = new Income(id, desc, val);
            } else if (type === "exp") {
                newItem = new Expense(id, desc, val);
            }
            // push new item into our data structure
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            calculateTotal("exp");
            calculateTotal("inc");
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function() {
            var allPercentage = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentage;
        },
        getBudget: function() {
            return {
                totalInc: data.totals.inc,
                budget: data.budget,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },
    };
})();

var UIController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensePercentageLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };
    var formatNumber = function(num, type) {
        var splitNum, int, dec;
        num = Math.abs(num).toFixed(2);
        splitNum = num.split(".");
        int = splitNum[0];
        var from = [];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3) + ',' + int.substr(3, 3) + ',' + int.substr(6, 3) + ',' + int.substr(9, 3) + ',' + int.substr(12, 3);
        }
        dec = splitNum[1];
        return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
    };
    var nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i>&times;</i></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i>&times</i></button></div></div></div>';
            }
            // Replace the placeholder with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },
        deleteListItem: function(selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(
                DOMstrings.inputDescription + "," + DOMstrings.inputValue
            );
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? (type = "inc") : (type = "exp");
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
                obj.budget,
                type
            );
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
                obj.totalInc,
                "inc"
            );
            document.querySelector(DOMstrings.expenseLabel).textContent =
                formatNumber(obj.totalExp, "exp");
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "--";
            }
        },
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensePercentageLabel);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "--";
                }
            });
        },
        displayMonth: function() {
            var now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changedType: function() {
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        getDOMstrings: function() {
            return DOMstrings;
        },
    };
})();

var controller = (function(budgetCtrl, UICtrl) {
    var setEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    var updateBudget = function() {
        // calculate the budget
        budgetCtrl.calculateBudget();
        // return the budget
        var budget = budgetCtrl.getBudget();
        // display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    var updatePercentages = function() {
        // calculate the percentage
        budgetCtrl.calculatePercentages();
        // read percentages form the budget controller
        var percentages = budgetCtrl.getPercentages();
        // update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
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
    var ctrlDeleteItem = function(event) {
        var itemId, splitId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split("-");
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
        init: function() {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: -1,
            });
            setEventListeners();
        },
    };
})(budgetController, UIController);
controller.init();