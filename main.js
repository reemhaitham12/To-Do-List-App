const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoUl = document.getElementById("todo-list");
let allTodo = getTodo();

// Event listener for form submission
todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo();
});

// Function to add a new task
function addTodo() {
    const addToText = todoInput.value.trim();
    if (addToText.length > 0) {
        const todoObject = {
            text: addToText,
            completed: false,
        };
        allTodo.push(todoObject);
        updateTodoList(); // Update the UI with the new task
        save(); // Save the updated list in localStorage
        todoInput.value = ""; // Reset input field
        showNotification('Task added successfully!', 'success');  // Show success notification
    } else {
        showNotification('Please enter something', 'error');
    }
}

// Function to create a todo item
function createTodoItem(todo, todoIndex) {
    const todoText = todo.text;
    const todoID = "todo-" + todoIndex;
    const todoLi = document.createElement("li");
    todoLi.className = "to-do";
    todoLi.innerHTML = `
        <input type="checkbox" id="${todoID}">
        <label for="${todoID}" class="custom-checkbox">
            <i class="fa-solid fa-check"></i>
        </label>
        <span class="todo-text">${todoText}</span>
        <div class="buttons">
            <button class="edit-button">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="delete-button">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    // Delete button functionality
    const deleteButton = todoLi.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodo(todoIndex);
    });

    // Checkbox functionality
    const Checkbox = todoLi.querySelector("input");
    Checkbox.addEventListener("change", () => {
        allTodo[todoIndex].completed = Checkbox.checked;
        save(); // Update the list in localStorage
    });
    Checkbox.checked = todo.completed;

    // Edit button functionality
    const editButton = todoLi.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
        EditTodo(todoIndex, todoLi, todoText);
    });
    return todoLi;
}

// Function to update the todo list in the UI
function updateTodoList() {
    todoUl.innerHTML = "";
    allTodo.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        todoUl.append(todoItem);
    });
}

// Function to save the todo list to localStorage
function save() {
    const response = JSON.stringify(allTodo);
    localStorage.setItem("todo", response);
}

// Function to get the todo list from localStorage
function getTodo() {
    const todo = localStorage.getItem("todo") || "[]";
    return JSON.parse(todo);
}

// Function to delete a todo item
function deleteTodo(todoIndex) {
    allTodo = allTodo.filter((_, i) => i !== todoIndex);
    showNotification('Task deleted successfully!', 'success');
    save();
    updateTodoList();
}

// Function to edit a todo item
function EditTodo(todoIndex, todoLi, currentText) {
    // Replace todo text with inputField
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentText;
    inputField.className = "edit-input";

    const todoTextSpan = todoLi.querySelector(".todo-text");
    todoTextSpan.replaceWith(inputField);

    // Add Save button
    const saveButton = document.createElement("button");
    saveButton.className = "save-button";
    saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';

    // Add Save button to ButtonDiv
    const ButtonDiv = todoLi.querySelector(".buttons");
    ButtonDiv.append(saveButton);

    // Save Button functionality
    saveButton.addEventListener("click", () => {
        const updateText = inputField.value.trim();
        if (updateText.length > 0) {
            allTodo[todoIndex].text = updateText;
            showNotification('Task edited successfully!', 'success');
            save();
            updateTodoList();
        } else {
            showNotification('Please Enter Valid Text', 'error');
        }
    });
}

// Function to show notifications
function showNotification(message, type = 'success') {
    const notificationBox = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const closeButton = document.getElementById('notification-close');
    
    notificationMessage.textContent = message;

    if (type === 'success') {
        notificationMessage.className = 'notification-success';
    } else if (type === 'error') {
        notificationMessage.className = 'notification-error';
    }

    // Show the notification box and background overlay
    document.body.classList.add('show-notification');
    notificationBox.style.display = 'block';

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notificationBox.style.display = 'none';
        document.body.classList.remove('show-notification');
    }, 3000); // 3 seconds

    // Close the notification when the OK button is clicked
    closeButton.addEventListener('click', function() {
        notificationBox.style.display = 'none';
        document.body.classList.remove('show-notification');
    });
}
