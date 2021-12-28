import React, { Component } from "react";
import classes from './Home.module.css'
import { doc, getFirestore, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject, listAll } from "firebase/storage";



class Home extends Component{
    constructor(props){
        super(props)
        this.state = {
            key : ''
        }
    }

    downloadHandler = (event)=>{
        window.location.href="/downloadform"
    }

    uploadHandler = (event)=>{
        window.location.href="/uploadform"
    }

    componentDidMount(){
        const db = getFirestore()
        const storage = getStorage();
        const q = query(collection(db, "key"), where("created", "<", Date.now()-604800000));
        const querySnapshot =  getDocs(q);
        querySnapshot.then((docs)=>{
            docs.forEach(mydoc=>{
                const desertRef = ref(storage, mydoc.id);
                listAll(desertRef)
                .then((res) => {
                    res.items.forEach((itemRef) => {
                        deleteObject(itemRef).then(()=>{
                        })
                    });
                })
                .then(()=>{
                    deleteDoc(doc(db, "key", mydoc.id));
                })
                .catch((error) => {
                    console.log("we have error");
                });
            })
        })

    }

    render(){
        return (
            <div>
                <div className={classes.buttonDiv}>
                    <button onClick={this.downloadHandler} className={"btn "+classes.button1}>Download Form</button>
                    <button onClick={this.uploadHandler} className={"btn "+classes.button2}>Upload Form</button>
                </div>
            </div>
        )
    }
}

export default Home