const newTaskInputField = document.querySelector(".newTaskInputField");
const taskOutput = document.querySelector(".taskOutput");
let list = document.querySelector(".list");
let task = "";
let editTaskInputField = "";
let text = "";

/*===========================================
            Functions - Alphabetical
===========================================*/

//calls createTask() and attaches the returned "task" (li) 
//and adds it to the "list" (ul)
function addNewTask() {
    list = document.querySelector(".list");
    if (/\S/.test(newTaskInputField.value)) {            //check that input has at least one character
        text = newTaskInputField.value.trim();
        list.appendChild(createTask(text));
    }
    newTaskInputField.value = "";
    newTaskInputField.focus();
}

//cycle through 3 tiered priority by replacing buttons
function changePriorityLevel(e, task) {
    const newButton = document.createElement("button");
    if (e.target.textContent === "med") {
        newButton.textContent = "high";
        newButton.className = "priorityLevel high";
        task.insertBefore(newButton, e.target);
        task.removeChild(e.target);
    }
    if (e.target.textContent === "high") {
        newButton.textContent = "low";
        newButton.className = "priorityLevel low";
        task.insertBefore(newButton, e.target);
        task.removeChild(e.target);
    }
    if (e.target.textContent === "low") {
        newButton.textContent = "med";
        newButton.className = "priorityLevel med";
        task.insertBefore(newButton, e.target);
        task.removeChild(e.target);
    }
}

//creates "task" with li as parent item
//each li has a checkbox to mark if task is complete,
//a button that identifies the priority of the task,
//a span that holds the text of the task,
//and an edit and delete button
function createTask(text) {
    task = document.createElement("li");
    task.className = "task";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    task.appendChild(checkbox);
    const priorityLevel = document.createElement("button");
    priorityLevel.className = "priorityLevel med";
    priorityLevel.textContent = "med";
    task.appendChild(priorityLevel);
    const span = document.createElement("span");
    span.textContent = text;
    task.appendChild(span);
    const edit = document.createElement("button");
    edit.textContent = "edit";
    edit.className = "edit";
    task.appendChild(edit);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    deleteButton.className = "delete";
    task.appendChild(deleteButton);
    return task;
}

//Replaces the span element holding the text of the "task"
//with an input field to make edits to the text.
//Also replaces the edit button of selected "task" with a save button
function edit(button, task, span) {
    editTaskInputField = document.createElement("input");
    editTaskInputField.type = "text";
    editTaskInputField.className = "editTaskInputField";
    text = span.textContent;
    editTaskInputField.value = text;
    task.insertBefore(editTaskInputField, span);
    task.removeChild(span);
    const saveButton = document.createElement("button");
    saveButton.textContent = "save";
    saveButton.className = "save";
    task.insertBefore(saveButton, button);
    task.removeChild(button);
    editTaskInputField.focus();
}

//this function checks for if a "task" is in the editable state
//and the user clicks off the editable input field (for anything
//other than the save button).  It exits the editable state
//and restores the most recent saved state.
function forceSaveAnyOpenEdits(e) {
    editTaskInputField = document.querySelector(".editTaskInputField");
    if (editTaskInputField != null && e.target != editTaskInputField  && e.target.className != "save") {
        task = editTaskInputField.parentNode;
        button = task.childNodes[3];
        const newSpan = document.createElement("span");
        newSpan.textContent = text;
        task.insertBefore(newSpan, editTaskInputField);
        task.removeChild(editTaskInputField);
        const editButton = document.createElement("button");
        editButton.textContent = "edit";
        editButton.className = "edit";
        task.insertBefore(editButton, button);
        task.removeChild(button);
    }
}

//prioritizes list from high priority to low priority by
//looping through current list and adding each "task" to
//1 of 3 new arrays, based on corresponding priority level.
//The function then adds the three arrays together and replaces
//the old list with this new, sorted, array
function prioritizeList() {
    list = document.querySelector(".list");
    let prioritizedList = [];
    let medPriorityList = [];
    let lowPriorityList = [];
    for(let i = 0; i < list.childNodes.length; i++) {
        let whichPriority = list.childNodes[i].childNodes[1].textContent;
        if (whichPriority === "high") {
            prioritizedList.push(list.childNodes[i]);
        }
        if (whichPriority === "med") {
            medPriorityList.push(list.childNodes[i]);
        }
        if (whichPriority === "low") {
            lowPriorityList.push(list.childNodes[i]);
        }
    }
    prioritizedList = prioritizedList.concat(medPriorityList);
    prioritizedList = prioritizedList.concat(lowPriorityList);
    const newList = document.createElement("ul");
    newList.className = "list";
    for(let i = 0; i < prioritizedList.length; i++) {
        newList.appendChild(prioritizedList[i]);
    }
    taskOutput.insertBefore(newList, list);
    taskOutput.removeChild(list);
}

//loops through the list and removes any "tasks" that have a
//check checkbox (completed task).
//Looping backwards is a solution to the problem of the DOM representation
//of the list (parent) after each "task" (child) is removed
function clearCompletedTasks() {
    list = document.querySelector(".list");
    for(let i = list.childNodes.length - 1; i >= 0; i--) {
        if (list.childNodes[i].childNodes[0].checked) {
            list.removeChild(list.childNodes[i]);
        }
    }
}

//takes the value of the editable input field and replaces it
//with a span element with equivalent text value.
//Also replaces the save button with an edit button
function save(button, task, span) {
    if (/\S/.test(editTaskInputField.value)) {                  //check that input has at least one character
        const newSpan = document.createElement("span");
        newSpan.textContent = editTaskInputField.value.trim();
        task.insertBefore(newSpan, editTaskInputField);
        task.removeChild(editTaskInputField);
        const editButton = document.createElement("button");
        editButton.textContent = "edit";
        editButton.className = "edit";
        task.insertBefore(editButton, button);
        task.removeChild(button);
    } else {
        editTaskInputField.value = "";
        editTaskInputField.placeholder = "Task cannot be blank";
    }
    editTaskInputField.focus();
}

/*===========================================
            Event Listeners
===========================================*/

//The entire document has this click event listener that calls
//forceSaveAnyOpenEdits() and then checks to see if it was a button
//that was clicked.  If so, the button's corresponding function
//will execute
document.addEventListener('click', (e)=> {
    forceSaveAnyOpenEdits(e);
    if (e.target.tagName === "BUTTON") {
        let button = e.target;
        task = button.parentNode;
        const span = task.childNodes[2];
        list = document.querySelector(".list");
        if (button.className === "edit") {
            edit(button, task, span);
        }
        if (button.className === "save") {
            save(button, task, span);
        }
        if (button.className === "delete") {
            list.removeChild(task);
        }
        if (button.classList.contains("priorityLevel")) {
            changePriorityLevel(e, task);
        }
        if (button.className === "addTask") {
            addNewTask();
        }
        if (button.className === "prioritizeTheList") {
            prioritizeList();
        }
        if (button.className === "clearCompletedTasks") {
            clearCompletedTasks();
        }
    }
});

//The document has this click event listener that checks for the
//enter key to be pressed. If so, it checks to see if one of two
//types of input fields has focus.  If so, it executes the 
//corresponding function, either add or save.
document.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        if (document.activeElement == newTaskInputField) {
            addNewTask();
        }
        if (document.activeElement == editTaskInputField) {
            task = editTaskInputField.parentNode;
            const span = task.childNodes[2];
            button = task.childNodes[3];
            save(button, task, span);
        }
    }
});