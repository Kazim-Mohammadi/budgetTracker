var budgetController = (function() {

})();

var UIController = (function() {

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