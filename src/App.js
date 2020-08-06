import React, {useState,useEffect} from 'react';
import {db, auth} from "./database/firebase";
import firebase from "firebase"
// import logo from './logo.svg';
import './App.css';
import Posts from "./Components/Posts/Posts";
import ImageUpload from "./Components/ImageUpload/ImageUpload";

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const[open, setOpen] = useState(false);
  const [openSignIn,setOpenSignIn] = useState(false);
  // firebase is simple
  // remove the complexity of having a backend
  // cloud function
  // can scale
  // real time database {fire store}

  const [posts,setPosts] = useState([
    // {username: "donyatesoro", imageURL: "https://mildaintrainings.com/wp-content/uploads/2017/11/react-logo.png", caption : "React Js"},
    // {username: "donyatesoro", imageURL : "https://upload.wikimedia.org/wikipedia/commons/b/b9/SanManueljf5811_07.JPG", caption : "San Manuel"},
    // {username: "donyatesoro", imageURL : "https://instagram.fmnl17-2.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/107460818_739832226751667_3841395470818418348_n.jpg?_nc_ht=instagram.fmnl17-2.fna.fbcdn.net&_nc_cat=111&_nc_ohc=F7EwSmlVtyoAX-xveHk&oh=3d62f5ad00565152e25ac169fc5feba3&oe=5F4197B2", caption : "Posing kuno"}
  ]);

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [user, setUser] = useState(null);
  
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //login
        console.log(authUser)
        setUser(authUser)
        // if(authUser.displayName) {
        //   //dont update username
        // }else {
        //   // if we just created someone
        //   return authUser.updateProfile({
        //     displayName :username,
        //   });
        // }

      } else {
        //logout
        setUser(null);
      }
    }) // any change happen it fires this

    return () => {
      unsubscribe();
    }

  }, [user, username]) // listen to changes of these two

  useEffect(() => {

    db.collection('posts').orderBy('timestamp','desc')
    .onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id : doc.id,
        post: doc.data()
      }) ))
    })

  }, [])

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName : username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message))
  
    setOpenSignIn(false);
  }

  return (
    <div className="App">



      {/* {user.displayName} */}
      

      <Modal
        open={open}
        onClose={() => setOpen(false)}
       
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt = ""
              />
            </center>



            <Input 
              placeholder = "Username"
              type = "text"
              value = {username}
              onChange = {(e) => setUsername(e.target.value)}
            />

            <Input 
              placeholder = "Email"
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder = "Password"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick = {signUp}>Login</Button>
           

          </form>
        </div>
      </Modal>


      {/* sign in */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
       
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt = ""
              />
            </center>

            <Input 
              placeholder = "Email"
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder = "Password"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick = {signIn}>Sign In</Button>
           

          </form>
        </div>
      </Modal>
     
      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt = ""
        />

      {
          user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) :
        (
          <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign Up</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
          
        )
      }

      </div>

      <div className="app__posts">
          <div className="app__postLef">
              {
                  posts.map(({id,post}) => (
                    <Posts key={id} postId={id} user = {user} username = {post.username} imageURL = {post.imageUrl} caption = {post.caption} />
                  )
                )
              }
          </div>
     



          <div className="app__postRight">
              <InstagramEmbed
                // https://www.instagram.com/god_speed_23/
                  // url='https://www.instagram.com/p/B_uf9dmAGPw'
                  url='https://www.instagram.com/p/B9WJrEJBYhz/'
                  maxWidth={320}
                  hideCaption={false}
                  containerTagName='div'
                  protocol=''
                  injectScript
                  onLoading={() => {}}
                  onSuccess={() => {}}
                  onAfterRender={() => {}}
                  onFailure={() => {}}
                />
          </div>

      </div>


      {user?.displayName ? (
        <ImageUpload username = {user.displayName} />
      ):(
        <h3>Sorry You need to login</h3>
      )
      }
     
    </div>
  );
}

export default App;
