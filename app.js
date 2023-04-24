
// BUDGET CONTROLLER
var budgetController = (function(){
   
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else{
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage
    }


    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        })
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,

        percentage: 0
    }

    return {
        addItem: function(type, des, val){
            var newItem, ID
            
            // Creating new ID
            if(data.allItems[type] > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create New Item based on inc or exp
            if(type === 'exp'){
               newItem = new Expense(ID, des, val)
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val)
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element 
            return newItem

        },


        deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }

        },


        calculateBudget: function(){

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0){
                // calculate percentage of income that we spent
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1
            }
           
        },


        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc); 
            })
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage()
            })
            return allPerc
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLable: '.item__percentage',
        dateLabel: '.budget__title--month'
    }


    var formatNumber = function(num, type){
        var numSplit, int, dec, type; 

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0]
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1]

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };


    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };
    
    
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // either inc exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };    
        },

        addListItem: function(obj, type){
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
            } else if(type === 'exp'){
                element = DOMstrings.expensesContainer

                html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>'
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

            // Insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },


        deleteListItem: function(selectorID){
            var el;

            el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },


        clearField: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(current => {
                current.value = '';
            });

            fieldsArr[0].focus()
        },

        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp')
           
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            } 
        },

        displayPercentages: function(percentages){
            var field ;

            field = document.querySelectorAll(DOMstrings.expensesPercLable);

            nodeListForEach(field, function(current, index){   
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%' ; 
                } else{
                    current.textContent = '---' ; 
                }    
            });

        },

        displayMonth: function(){
            var now, months, month, year;

            now = new Date();
            months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] +' '+ year;
        },

        changeType: function(){

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')

        },

        getDOMstrings: function(){
            return DOMstrings
        }
    }
    
}) ();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem()
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType)
    }


    var updateBudget = function(){

        // 1. Calculate the budget
        budgetCtrl.calculateBudget()

        // 2. return the budget
        var budget = budgetCtrl.getBudget()

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget)

    }


    var updatePercentages = function(){

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages()

        // 2. Read percentages from the budget controller 
        var percentages = budgetCtrl.getPercentages()

        // 3. Update the UI with the percentages 
        UICtrl.displayPercentages(percentages)

    }


    var ctrlAddItem = function(){

        var input, newItem;

        // 1. Get the field input
        input = UICtrl.getInput();
        
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){

            // 2. Add the item to Budget Controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            budgetCtrl.testing()
            
            // 3. Add the item to UI
            UICtrl.addListItem(newItem, input.type)
    
            // 4. Clear Fields
            UICtrl.clearField()
            
            // 5. Calculate and update budget
            updateBudget()

            // 6. Update percentages
            updatePercentages()

        }
       
    };


    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        console.log(itemID)
        if(itemID){

            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from data structure
            budgetCtrl.deleteItem(type, ID)

            // 2. Remove the item from UI
            UICtrl.deleteListItem(itemID)

            // 3. Update and show the new budget
            updateBudget()
        }

    };

    
 
    return {
        init: function(){
            console.log('Applications working');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners()
        }
    }

}) (budgetController, UIController);

controller.init()

















































