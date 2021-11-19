/* This script handles all the logic of the sticky scheduler application. 
   The code still needs refactoring becuase the initial focus was to get the core functionality of the programme.
   For this reason some simple tasks are overly complicated, and not efficient. Naming and comments also needs to be reviewed.
*/


// Stick Note
class StickyNote {
    /* The assumtion is that assignee and priority data will be coming from a database
       that is why a select form was used for these fields.
    */

    constructor(id, assignee, priority, task, completed, position, left, top) {
        this.id = id;
        this.assignee = assignee;
        this.priority = priority;
        this.task = task;
        this.completed = completed;
        this.position = position;
        this.left = left;
        this.top = top;
    }

}



// This LocalStore class and it methods handles all the localStorage operations fro this application 
class LocalStore {

    static getStickyNotes() {
        let notes;

        if (localStorage.getItem("notes") === null) {
            notes = [];
        } else {
            notes = JSON.parse(localStorage.getItem("notes"));
        }

        return notes;
    }

    static addStickyNote(note) {
        const notes = LocalStore.getStickyNotes();
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    static updateStickyNote(element) {
        const notes = LocalStore.getStickyNotes();

        if (element.classList.contains("update") || element.classList.contains("checkbox")) {
            const stickyNoteId = element.parentElement.parentElement.id
           
            const id = stickyNoteId;
            const assignee = document.querySelector(`#assignee-update-${stickyNoteId}`).value;
            const priority = document.querySelector(`#priority-update-${stickyNoteId}`).value;
            const task = document.querySelector(`#task-update-${stickyNoteId}`).value;
            const completed = document.querySelector(`#completed-update-${stickyNoteId}`).checked ? true:false;
            const position = element.parentElement.parentElement.style.position;
            const left = element.parentElement.parentElement.style.left;
            const top = element.parentElement.parentElement.style.top;

            const updatedStickyNote = new StickyNote(id, assignee, priority, task, completed, position, left, top)
            element.parentElement.parentElement.remove();
            
            notes.forEach((note, index) => {
                if(note.id === stickyNoteId) {
                    notes[index] = updatedStickyNote
                    localStorage.setItem("notes", JSON.stringify(notes));
                    UserInterface.addNoteToList(updatedStickyNote);
                    UserInterface.swittchFromEditFormToStickyNote(document.querySelector(`#cancel-btn-${stickyNoteId}`))
                }
            });  
        }         
    }

    static removeStickyNote(id) {
        const notes = LocalStore.getStickyNotes();

        notes.forEach((note, index) => {
            if(note.id === id) {
                notes.splice(index, 1);
            }
        });

        localStorage.setItem("notes", JSON.stringify(notes));
    }

}



// This UserInterface class and it methods handle all the DOM manipulation for this application. 
class UserInterface {

    static displayNotes() {
        const notes = LocalStore.getStickyNotes();
        notes.forEach((note) => UserInterface.addNoteToList(note));
    }

    static addNoteToList(note) {
        const unorderedList = document.querySelector("#unordered-list");

        const list = document.createElement("li");

        list.id = note.id;
        list.style.position = note.position;
        list.style.left = note.left;
        list.style.top = note.top;

        /* Create new Stickey note element with some hidden form fields 
           and elements for later DOM manipulation operations 
        */
        list.innerHTML = `
            <a href="#" style=${note.completed ? "background:#ccc":""}>
                <p style="display:inline">
                    <b>Assignee:</b> 
                    <span id="assignee-${note.id}">${note.assignee}</span>
                    <select id="assignee-update-${note.id}" name="assignee-update" style="display:none">
                        <option value="">Select Assignee</option>
                        <option value="John Smith" ${ note.assignee === "John Smith"? "selected":""}>John Smith</option>
                        <option value="Jana du Toit" ${ note.assignee === "Jana du Toit"? "selected":""}>Jana du Toit</option>
                        <option value="katleho Mohapi" ${ note.assignee === "katleho Mohapi"? "selected":""}>katleho Mohapi</option>
                    </select>
                </p>
                <p>
                    <b>Priority:</b> 
                    <span id="priority-${note.id}">${note.priority}</span>
                    <select id="priority-update-${note.id}" name="priority-update" style="display:none">
                        <option value="low" ${ note.priority === "low"? "selected":""}>Low</option>
                        <option value="medium" ${ note.priority === "medium"? "selected":""}>Medium</option>
                        <option value="high" ${ note.priority === "high"? "selected":""}>High</option>
                    </select>
                </p>
                <p>
                    <b>Task:</b> 
                    <span id="task-${note.id}">${note.task}</span>
                    <textarea style="display:none" name="task" id="task-update-${note.id}" cols="25" rows="1">${note.task}</textarea>
                </p>
               
                <b style="font-family:'Reenie Beanie';font-size:2rem">Completed:</b>
                <input id="completed-update-${note.id}" type="checkbox" class="checkbox" ${note.completed ? "checked":""}>
               
                <br>
                <button id="edit-btn-${note.id}" class="button button2 edit">Edit</button>
                <button id="delete-btn-${note.id}" class="button button1 delete">Delete</button>
                <button id="update-btn-${note.id}" class="button button2 update" style="display:none">Save Changes</button>
                <button id="cancel-btn-${note.id}" class="cancel-btn button button3" style="display:none">Cancel</button>
            </a>
        `;

        unorderedList.appendChild(list);
    }

    static moveFormToClickedPosition(e) {

        if (e.target === this) {
            const formContainer = document.querySelector("#form-container")
            formContainer.style.position = "absolute";
            formContainer.style.left = e.clientX + 'px';
            formContainer.style.top = e.clientY + 'px';
            formContainer.style.display = "block";
        }  
    }

    static removeForm(e) {
        document.querySelector("#form-container").style.display = "none"
    }

    static clearFormFields() {
        document.querySelector("#assignee").value = "";
        document.querySelector("#task").value = "";
        document.querySelector("#completed").checked = false;
    }

    static removeStickyNote(element) {
        if (element.classList.contains("delete")) {
            element.parentElement.parentElement.remove();

            // Delete /remove sticky note from localStorage
            LocalStore.removeStickyNote(element.parentElement.parentElement.id)
        }
    }

    static toggleStickyNoteBackgroundColor(element) {
        if (element.classList.contains("checkbox") && element.checked) {
            element.parentElement.parentElement.style.background = "#ccc"; 
        } else {
            element.parentElement.parentElement.style.background = "#ffc"; 
        }
    }

    static switchFromStickyNoteToEditForm(element) {
        if (element.classList.contains("edit")) {
            const stickyNoteId = element.parentElement.parentElement.id
            // Hide  sticky note values
            document.querySelector(`#assignee-${stickyNoteId}`).style.display = "none";
            document.querySelector(`#priority-${stickyNoteId}`).style.display = "none";
            document.querySelector(`#task-${stickyNoteId}`).style.display = "none";

            // Show note form fields to edit sticky note
            document.querySelector(`#assignee-update-${stickyNoteId}`).style.display = "inline";
            document.querySelector(`#priority-update-${stickyNoteId}`).style.display = "inline";
            document.querySelector(`#task-update-${stickyNoteId}`).style.display = "inline";

            // Change visible buttons
            element.style.display = "none";
            document.querySelector(`#update-btn-${stickyNoteId}`).style.display = "inline";
            document.querySelector(`#delete-btn-${stickyNoteId}`).style.display = "none";
            document.querySelector(`#cancel-btn-${stickyNoteId}`).style.display = "inline";
        }
    }

    static swittchFromEditFormToStickyNote(element) {
        if (element.classList.contains("cancel-btn")) {
            const stickyNoteId = element.parentElement.parentElement.id

            // Show  sticky note values
            document.querySelector(`#assignee-${stickyNoteId}`).style.display = "inline";
            document.querySelector(`#priority-${stickyNoteId}`).style.display = "inline";
            document.querySelector(`#task-${stickyNoteId}`).style.display = "inline";

            // Hide note form fields to edit sticky note
            document.querySelector(`#assignee-update-${stickyNoteId}`).style.display = "none";
            document.querySelector(`#priority-update-${stickyNoteId}`).style.display = "none";
            document.querySelector(`#task-update-${stickyNoteId}`).style.display = "none";

            // Change visible buttons
            element.style.display = "none";
            document.querySelector(`#update-btn-${stickyNoteId}`).style.display = "none";
            document.querySelector(`#delete-btn-${stickyNoteId}`).style.display = "inline";
            document.querySelector(`#edit-btn-${stickyNoteId}`).style.display = "inline";
        }
    }

}



// Form submition to create new sticky note
document.querySelector("#note-form").addEventListener("submit", (e) => {
    // Prevent defualtn submit
    e.preventDefault();
    
    // Get form values
    const assignee = document.querySelector("#assignee").value;
    const priority = document.querySelector("#priority").value;
    const task = document.querySelector("#task").value;
    const completed = document.querySelector("#completed").checked ? true : false;
    
    // Validate form
    if (assignee === "" || task === "") {
        alert("Please fill in all fields")
    } else {
        // Get current position of the form
        const form = document.querySelector("#note-form")
        const position = form.parentElement.parentElement.style.position;
        const left = form.parentElement.parentElement.style.left;
        const top = form.parentElement.parentElement.style.top;

        // Generate unique id
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2)

        // Instatiate new sticky note
        const note = new StickyNote(id, assignee, priority, task, completed, position, left, top);

        // Add note to UserInterface
        UserInterface.addNoteToList(note);

        // Add note to local store
        LocalStore.addStickyNote(note);

        // Clean and hide/remove form
        UserInterface.clearFormFields();

        // remove form from the DOM
        UserInterface.removeForm();
    }  

});



// Event Listener functions
document.addEventListener("DOMContentLoaded", UserInterface.displayNotes);
document.querySelector("#main").addEventListener("click", UserInterface.moveFormToClickedPosition);
document.querySelector("#unordered-list").addEventListener("click", UserInterface.moveFormToClickedPosition);
document.querySelector("#cancel-form").addEventListener("click", UserInterface.removeForm);

document.querySelector("#unordered-list").addEventListener("click", (e) => {
    UserInterface.removeStickyNote(e.target);
    UserInterface.toggleStickyNoteBackgroundColor(e.target);
    UserInterface.switchFromStickyNoteToEditForm(e.target);
    UserInterface.swittchFromEditFormToStickyNote(e.target);
    LocalStore.updateStickyNote(e.target);
});


