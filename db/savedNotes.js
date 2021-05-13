const util = require('util');
const fs = require('fs');
// get the node packages we require (util, fs, uuid) and declaring the variables so we can reference them in this file - uuid being the only one which requires an npm i
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
// readFileAsync is uses the 2 prev mentioned node packages to convert the fs.readFile cb structured functions into Promises
// same concept with fs.writeFile
// we will now be able to use each of these files like promises with .then .catch syntax by referencing those variables 
class SavedNotes {

    // we are reading the "database" json file that contains the utf8 character encoding asynchronously, and returning the resulting promise
    read() {
        return readFileAsync("db/db.json", "utf8");
    }

    // similarly to the read method, we interact with the db.json file but now we also using the second argument in the async writefile function to pass  strigified data to the target file.
    write(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note));
    }

    // the getNotes method will return the promise we get back from the read function defined on line 13. Within the .then we use the argument of notes which we use to define our readNotes variable either as an array with concatenated content from the file or an empty array depending on if we encounter an error
    getNotes() {
        return this.read().then((notes) => {
            let readNotes;
            
            try {
                readNotes = [].concat(JSON.parse(notes));
            }
            catch(err) {
                readNotes = [];
            }

            return readNotes;
        });
    }

    // we define a new function which will take an argument id and return the promise array from the this savedNotes class, we call the getNotes function with the argument of notes, then filter those notes to not include the note the user selected by id, then we rewrite the notes minus the previously filtered one back to the db.json document using the function defined near line 17
    deleteNote(id) {
        return this.getNotes().then((notes) => 
        notes.filter((note) => note.id !== id))
        .then((filteredNotes) => this.write(filteredNotes));
        }

    // we define a new saveNote function which takes in a note arg 
    saveNote(note) {
        const {title, text} = note;
        //and using object destructuring the get the title and text keys from the arg note object.

        //If either value does not exist, we'll throw and error with a string "Note 'title' and 'text' cannot be blank". Otherwise, we declare a new variable newNote with the keys of title, text, and id.
        if(!title || !text) {
            throw new Error("Note 'title' and 'text' cannot be blank!");
        }

        // the value of i.d. is generated pseudo-randomly by this expression 
        const newNote = {title, text, id: Math.floor(Math.random()*Date.now())};

        //We return the getNotes promise and 3 additional then chains wherein the first one takes our promised notes array, spreads it and adds the newNote obj from above to the end. Then the second promise cb takes the parameter of the new notes from the previous promise chain and writes them to the db.json document. The last then returns the newNote obj
        return this.getNotes()
        .then((notes) => [...notes, newNote])
        .then((modifiedNotes) => this.write(modifiedNotes))
        .then(() => newNote)
    }
};

// we export an instance of the savenotes class so we can access it in other .js files
module.exports = new SavedNotes();
