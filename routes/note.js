const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/notes');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// This is a route to fetch notes of user : login required
router.get('/fetchnotes',fetchuser,async (req,res) =>{
    try {
        // finding notes in database with assosiated id givenby user
        const notes = await Notes.find({user: req.user.id});
        // Sending notes
        res.json(notes)

    } // internal error handling  
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})
   // route to create note : login required
router.post('/createnote',fetchuser,body('title','Enter a valid title').isLength({min:3}),
    body('description','Description must be at least 5 char').isLength({min:5}),
       async (req,res)=>{
        try {
            // javaScript destructuring
            const {title , description, tag} = req.body;
    // Validation of express-validator to check and return errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
     // fetching and assigning notes value from request body
    const note = new Notes ({
        title, description, tag, user : req.user.id
    })
    // Saving a note by save() function
    const savenote = await note.save();
     res.json(savenote);
    } 
    catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})


 // route to update a note : login required
router.put('/updatenote/:id',fetchuser,
       async (req,res)=>{

        try {
            const {title,description,tag} = req.body;
            const newNote = {};
             // if title is present in the request body then assignig new title value to title of note
            if(title) {newNote.title=title};
            if(description){newNote.description=description};
            if(tag){newNote.tag=tag};
             
            // Finding that specific note in database by its id
            let note = await Notes.findById(req.params.id);
            if(!note) {

                return res.status(404).send("Note not Found!")
            }
             
            // if notes id isn't assosiated to that user
            if(note.user.toString() !== req.user.id){
                return res.status(401).send("Not Allowed!")
            }
            // updating a note
            note = await Notes.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true})
            res.send({note})
            
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
        })

           // route to delete a note : login required
        router.delete('/deletenote/:id',fetchuser,
       async (req,res)=>{
        try {
            // finding note in database by id
            let note = await Notes.findById(req.params.id);
            if(!note) {return res.status(404).send("Note not Found!") }

            if(note.user.toString() !== req.user.id){
                return res.status(401).send("Not Allowed!")
            }
             // Deleting a note
             note = await Notes.findByIdAndDelete(req.params.id);
             res.json({'success':"Note deleted successfully", note:note})


            
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
        })
        




module.exports = router