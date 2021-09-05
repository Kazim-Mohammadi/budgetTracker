var budgetController = (function() {

})();

var UIController = (function() {
    return {
        getInput: function() {
            return {
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value
            }
        }
    }
})();

var controller = (function(budgetCtrl, UICtrl) {
    var ctrlAddItem = function() {

    }
    document.querySelector('.add-btn').addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', (e) => {
        if (e.keyCode === 13 || e.which === 13) {
            ctrlAddItem();
        }
    });
})(budgetController, UIController);