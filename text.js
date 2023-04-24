
// BUDGET CONTROLLER
var budgetController = (function(){

    var Expense =  function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    }

    var Income =  function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        total: {
            exp: 0,
            inc: 0
        }
    };

    return {

        addItem: function(type, des, val){
            var newItem, ID;
            // Creating new ID
            if(data.allItems[type] > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new Item based on inc or exp
            if(type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            
            // Push it to data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem
        },

        testing: function(){
            console.log(data)
        }

    }

}) ();


// UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function(){

            return {
                type: document.querySelector(DOMstrings.inputType).value, // either inc exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };

        },

        getDOMstrings: function(){
            return DOMstrings
        }
    }

}) ();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){

        var DOM = UICtrl.getDOMstrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){ 
                ctrlAddItem()
            }
        })

    }

    var updateBudget = function(){
        
    }

    function ctrlAddItem(){

        // 1. Get the input field
        var input = UICtrl.getInput()
        console.log(input)

        // 2. Add item to budget controller
        budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add item to UI

        // 4. Calculate the Budget

        // 5. Display the budget on UI

    }

    return {
        init: function(){
            console.log('Application has started.');
            setupEventListeners();
        }
    }

}) (budgetController, UIController);

controller.init()

