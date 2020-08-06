import React, { useState } from 'react'
import firebase from "firebase";
import {storage,db } from "../../database/firebase";

import "./ImageUpload.css";

import { Button } from '@material-ui/core';


function ImageUpload({username}) {
    const [image , setImage] = useState(null);
    const [url , setUrl] = useState("");
    const [progress , setProgress] = useState(0);
    const [caption , setCaption] = useState("");
    
    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }


    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress logic
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //Error Function ..
                console.log(error);
            },

            () => {
                //complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,
                            imageUrl : url,
                            username : username
                        });
                    
                        setProgress(0);
                        setImage(null);
                
                    })
            }
        )
    }

    return (
        <div className="imageupload">
           {/* <h1>Image Upload</h1>  */}
           <progress className="imageupload_progress" value={progress} max="100"/>
           <input type="text"  placeholder="Enter a caption"
            onChange={event => setCaption(event.target.value) } value = {caption}/>
           <input type="file" onChange={handleChange} />
          
           <Button onClick={handleUpload} >  Upload</Button>
        </div>
    )
}

export default ImageUpload
