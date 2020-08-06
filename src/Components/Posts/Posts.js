import React, { useState, useEffect } from 'react';
import './Posts.css';
import Avatar from '@material-ui/core/Avatar';
import firebase from "firebase";
import { db } from '../../database/firebase';



function Posts({postId,user,username,imageURL,caption}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const avatar_username = username.substring(0,1).toUpperCase();

    useEffect(() =>{
        let unsubscribed;
        if(postId){
            unsubscribed = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map((doc) => doc.data() ));
            });
        }

        return () => {
            unsubscribed();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text : comment,
            username : user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        })

        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    alt ="Donya"
                    className = "post__avatar"
                    // src="https://instagram.fmnl17-2.fna.fbcdn.net/v/t51.2885-19/s150x150/80815422_476716329930276_4410353198724808704_n.jpg?_nc_ht=instagram.fmnl17-2.fna.fbcdn.net&_nc_ohc=_NjZjcrTDnUAX9yypbe&oh=71023e7efa6e3017a326347e233febfa&oe=5F4123D4"
                    src="/static/images/avatar/2.jpg"
                >
                {avatar_username}
                </Avatar>
                <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageURL}/> 
            <h4 className="post__text"><strong>{username}</strong> : {caption}</h4>
           
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username} </strong>: {comment.text}
                        </p>
                    ))
                }
            </div>
           
            {user && (
                <form className="post__commentBox">
                    <input 
                        className="post__input"
                        type = "text"
                        placeholder = "Add a comment ..."
                        value = {comment}
                        onChange = {(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled = {!comment}
                        type ="submit"
                        onClick = {postComment}
                    >Post</button>
                </form>
                )
            
            }
        </div>
    )
}

export default Posts
