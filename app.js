//Storage  Controller
const StorageCtrl = (function () {
	return {
		storeItem: function (item) {
			let items;

			//Check if any Items in LS
			if (localStorage.getItem('items') === null) {
				items = [];
				//Push New Item
				items.push(item)
				//Set LS
				localStorage.setItem('items',JSON.stringify(items));
			} else {
				//Get What is Already In
				items = JSON.parse(localStorage.getItem('items'));

				//Push New Item
				items.push(item);

				//Reset LS
				localStorage.setItem('items',JSON.stringify(items));
			}
		},
		getItemsFromStorage: function () {
			let items;
			if (localStorage.getItem('items') === null) {
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}

			return items;
		},
		updateItemStorage: function (updatedItem) {
			let items = JSON.parse(localStorage.getItem('items'));

			items.forEach( function(item , index) {
				if (updatedItem.id === item.id) {
					items.splice(index, 1 , updatedItem);
				}
			});
			//Set LS
			localStorage.setItem('items',JSON.stringify(items));
		},
		deleteItemFromStorage: function (id) {
			let items = JSON.parse(localStorage.getItem('items'));

			items.forEach( function(item , index) {
				if (id === item.id) {
					items.splice(index, 1);
				}
			});
			//Set LS
			localStorage.setItem('items',JSON.stringify(items));

		},
		clearItemsFromStorge: function () {
			localStorage.removeItem('items');
		}
	}
})();



//Item Controller
const ItemCtrl = (function(){
	//console.log('Item Controller');
	//Item Constructor
	const Item = function (id , name , calories) {
		this.id = id;
		this.name = name;
		this.calories = calories;
	}
	//Data Structure /sate
	const data = {
		// items: [
		//   {id: 0 , name:'Steak Dinner', calories: 1200},
		//   {id: 1 , name:'Cookie', calories: 400},
		//   {id: 2 , name:'Eggs', calories: 300},
		// ],
		items: StorageCtrl.getItemsFromStorage(),
		currentItem: null,
		totalCalories:0
	}

	return {
		getItems:function(){
			return data.items;
		},
		addItem: function (name , calories) {
			let ID;
			//Create ID
			if (data.items.length > 0) {
				ID = data.items[data.items.length - 1].id + 1;
			} else {
				ID = 0;
			}
			//Calories To Number
			calories = parseInt(calories);

			//Create New Item
			newItem = new Item(ID , name , calories);
            
            //Add To Item Array
			data.items.push(newItem);

			return newItem;
		},
		getItemById: function (id) {
			let found = null;
			data.items.forEach( function(item) {
				if (item.id === id) {
					found = item;

				} 
			});
			return found;
		},
		updatedItem: function (name , calories) {
			//Calories To number
			calories = parseInt(calories);

			let found = null;

			data.items.forEach( function(item) {
				if (item.id === data.currentItem.id) {
					item.name = name;
					item.calories = calories;
					found = item;
					
				}
				
			});
			return found;
		},
		deleteItem: function (id) {
			//get Ids
            const ids = data.items.map(function (item) {
            	return item.id
            });

            //Get Index
            const index = ids.indexOf(id);

            //Remove Item
            data.items.splice(index, 1 );
		},
		clearAllItems: function () {
			data.items = [];
		},
		setCurrentItem: function (item) {
			data.currentItem = item;

		},
		getCurrentItem: function () {
			return data.currentItem;
		},
		getTotalCalories: function () {
			let total = 0;
			data.items.forEach( function(item) {
				total += item.calories;
			});
            //Set Total Cal in Data Structure
			data.totalCalories = total;

			return data.totalCalories;
		},
		logData: function(){
			return data;
		}
	}
})();

//Ui Controller
const UiCtrl = (function(){
	//console.log('Ui Controller');
    const Uiselectors = {
    	itemList: '#item-list',
    	listItems: '#item-list li',
    	addbtn: '.add-btn',
    	updatebtn: '.update-btn',
    	deletebtn: '.delete-btn',
    	backbtn: '.back-btn',
    	clearAll: '.clear-btn',
    	itemNameInput: '#item-name',
    	itemCalories: '#item-calories',
    	totalCalories: '.total-calories'
    }
	return{
		populateItemList: function (items) {
			let html = '';
			items.forEach( function(item) {
				html += `
				<li class="collection-item" id="item-${item.id}">
			        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
			        <a href="#" class="secondary-content">
			          <i class="fa fa-pencil edit-item"></i>
			        </a>
		        </li>
			`;
			});
		//Insert LIst Item
		document.querySelector(Uiselectors.itemList).innerHTML = html;
		},
        getItemsInput: function () {
        	return {
        		name: document.querySelector(Uiselectors.itemNameInput).value,
        		calories:document.querySelector(Uiselectors.itemCalories).value
        	}
        },
        addListItem: function (item) {
        	//show list 
        	document.querySelector(Uiselectors.itemList).style.display = 'block';
        	//Create Li Element
        	const li = document.createElement('li');
        	//add class
        	li.className = 'collection-item';
        	//Add ID
        	li.id = `item-${item.id}`;

        	//Add HTML
        	li.innerHTML = `
               <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
			        <a href="#" class="secondary-content">
			          <i class="fa fa-pencil edit-item"></i>
			        </a>
        	`;
            //Inser Item
            document.querySelector(Uiselectors.itemList).insertAdjacentElement('beforeend',li);
        },
        updateListItem: function (item) {
        	let listItems = document.querySelectorAll(Uiselectors.listItems);

        	//Turn Node List into Array
        	listItems = Array.from(listItems);

        	listItems.forEach( function(listItem) {
        		const itemId = listItem.getAttribute('id');
        		if (itemId === `item-${item.id}`) {
        			document.querySelector(`#${itemId}`).innerHTML = 
        			`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
			        <a href="#" class="secondary-content">
			          <i class="fa fa-pencil edit-item"></i>
			        </a>
        			`;
        		} else {
        			// statement
        		}
        	});
        },
        deleteListItem:function (id) {
        	const itemId = `#item-${id}`;
        	const item = document.querySelector(itemId);
        	item.remove();
        },
        clearInput: function () {
        	document.querySelector(Uiselectors.itemNameInput).value = '';
        	document.querySelector(Uiselectors.itemCalories).value = '';
        },
        hideList: function () {
        	document.querySelector(Uiselectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
        	document.querySelector(Uiselectors.totalCalories).textContent = totalCalories;
        },
        clearEditSate: function () {
        	UiCtrl.clearInput();
        	document.querySelector(Uiselectors.updatebtn).style.display = 'none';
        	document.querySelector(Uiselectors.deletebtn).style.display = 'none';
        	document.querySelector(Uiselectors.backbtn).style.display = 'none';
        	document.querySelector(Uiselectors.addbtn).style.display = 'inline';
        },
        showEditState: function () {
        	
        	document.querySelector(Uiselectors.updatebtn).style.display = 'inline';
        	document.querySelector(Uiselectors.deletebtn).style.display = 'inline';
        	document.querySelector(Uiselectors.backbtn).style.display = 'inline';
        	document.querySelector(Uiselectors.addbtn).style.display = 'none';
        },
        addItemToForm: function () {
        	document.querySelector(Uiselectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        	document.querySelector(Uiselectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
        	UiCtrl.showEditState();
        },
        removeItems: function () {
        	let listItems = document.querySelectorAll(Uiselectors.listItems);

        	//Turn Node List Into Array
        	listItems = Array.from(listItems);
        	listItems.forEach( function(item) {
        		item.remove();
        	});
        },
        getSelectors: function () {
		   return Uiselectors;
	    }


	}
})();


//App Controller
const AppCtrl = (function(ItemCtrl , StorageCtrl , UiCtrl){
	//console.log('App Controller');
	//console.log(ItemCtrl.logData());
    
    //Load Event Listener
    const loadEventListeners = function () {
    	const Uiselectors = UiCtrl.getSelectors();

    	//Add Item Event
    	document.querySelector(Uiselectors.addbtn).addEventListener('click',
    		itemAddSubmit);

    	//Disabled submit on enter
    	document.addEventListener('keypress',
    		function (e) {
    			if (e.KeyCode === 13 || e.which === 13) {
    				e.preventDefault();
    				return false;
    			} 
    		});
    	

    	//Edit Icon click Event
    	document.querySelector(Uiselectors.itemList).addEventListener('click',
    		itemEditClicked);
        
        //Update  Item Event
    	document.querySelector(Uiselectors.updatebtn).addEventListener('click',
    		itemUpdateSubmit);


    	//Delete  Item Event
    	document.querySelector(Uiselectors.deletebtn).addEventListener('click',
    		itemDeleteSubmit);

    	//Clear All  Item Event
    	document.querySelector(Uiselectors.clearAll).addEventListener('click',
    		clearallItemClick);


    	//BackButton Event
    	document.querySelector(Uiselectors.backbtn).addEventListener('click',
    		UiCtrl.clearEditSate);

    }

    //Add Item Submit
    const itemAddSubmit = function(e){
        //Get From Input From Ui Controller
        const input = UiCtrl.getItemsInput();
        //Check For name and calories
        if (input.name !== '' && input.calories !=='') {
        	//Add Item 
        	const newItem = ItemCtrl.addItem(input.name,input.calories);
        	//Add Item to Ui list
        	UiCtrl.addListItem(newItem);

        	//Get  Total Calories
        	const totalCalories = ItemCtrl.getTotalCalories();

            
            //Add Total Calories to Ui
            UiCtrl.showTotalCalories(totalCalories);
            
            //Store in Local Storage
            StorageCtrl.storeItem(newItem);

        	//Clear Fields
        	UiCtrl.clearInput();
        } else {
        	
        }
    	e.preventDefault();
    }
  
   //item Edit Clicked

   const itemEditClicked = function (e) {
   	if (e.target.classList.contains('edit-item')) {
   		//Get List Item Id
   		const listId = e.target.parentNode.parentNode.id ;
   		//Break into an array
   		const listIdArr = listId.split('-');

   		//Get The Actual ID
   		const id = parseInt(listIdArr[1]);

   		

   		//Get Item
   		const itemToEdit = ItemCtrl.getItemById(id);

   		//Set Current Item
   		ItemCtrl.setCurrentItem(itemToEdit);



   		//Add Item To Form
   		UiCtrl.addItemToForm();
   	} else {
   		// statement
   	}
   	e.preventDefault();
   }

   //Update Item Submit
   const itemUpdateSubmit = function (e) {

   	//Get Item Input
   	const input = UiCtrl.getItemsInput();
   	
   	//Update Item
   	const updatedItem = ItemCtrl.updatedItem(input.name , input.calories);
   	
   	//Update Ui
   	UiCtrl.updateListItem(updatedItem);

   	//Get  Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

            
    //Add Total Calories to Ui
    UiCtrl.showTotalCalories(totalCalories);

    //Update LOcal Storage
    StorageCtrl.updateItemStorage(updatedItem);

    //Clear Fields
    UiCtrl.clearInput();

   	e.preventDefault();
   }

   //item Delete Submit
   const itemDeleteSubmit = function (e) {
   	//Det Current Item
   	const currentItem = ItemCtrl.getCurrentItem();
   	
   	//Delete From Data Structure
    ItemCtrl.deleteItem(currentItem.id);
   	
   	//Delete From Ui
   	UiCtrl.deleteListItem(currentItem.id);


   	//Get  Total Calories
	const totalCalories = ItemCtrl.getTotalCalories();

    
    //Add Total Calories to Ui
    UiCtrl.showTotalCalories(totalCalories);
    

    //Delete From LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

	//Clear Fields
	UiCtrl.clearInput();

   	e.preventDefault();
   }

   const clearallItemClick = function (e) {
   	//Delete All Items From Data Structure
   	ItemCtrl.clearAllItems();
   	
    //Get  Total Calories
	const totalCalories = ItemCtrl.getTotalCalories();

    
    //Add Total Calories to Ui
    UiCtrl.showTotalCalories(totalCalories);

    //Remove From Ui
	UiCtrl.removeItems();

	//Remove From LS
	StorageCtrl.clearItemsFromStorge();

	//Hide Ul
	UiCtrl.hideList();

   	e.preventDefault();
   }

	return{
		init: function () {
			console.log('Init App.....');
            //Clear edit state
            UiCtrl.clearEditSate();

			//Fetch Items From Data Structure
			const items = ItemCtrl.getItems();

			//Check if any items
			if (items.length === 0) {
				UiCtrl.hideList();
			} else {
				//Populate list with Item
			    UiCtrl.populateItemList(items);
			}

			//Get Total Calories
        	const totalCalories = ItemCtrl.getTotalCalories();

            
            //Add Total Calories to Ui
            UiCtrl.showTotalCalories(totalCalories);

			//Load Event Listeners
			loadEventListeners();

		}
	}
})(ItemCtrl , StorageCtrl ,UiCtrl);

//Init App
AppCtrl.init();