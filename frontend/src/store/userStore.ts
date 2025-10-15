import { makeAutoObservable } from "mobx";


interface User {
    id : number | null;
    name : string;
    phone_number : string;
    email?: string | null;
}

class UserStore {
    user : User = {
        id:null,
        name: "",
        phone_number : "",
        email : null
    };

    constructor(){
        makeAutoObservable(this);
        this.loadFromStorage();
    }

    setUser(user : User){
        this.user = user;
        this.saveToStorage();
        console.log("User set in Store: " , this.user);
    }

    clearUser(){
        this.user = {id: null , name : "" , phone_number: "" , email : null};
        this.removeFromStorage();
    }

    //save user to localstorage
    private saveToStorage(){
        try {
            localStorage.setItem("User",JSON.stringify(this.user))
        } catch (error) {
            console.error("failed to save user to localStorage: ", error)
        }
    }

    //load user from localStorage
    private loadFromStorage(){
        try {
            const storedUser = localStorage.getItem("User");
            if(storedUser){
                this.user = JSON.parse(storedUser);
                console.log('User loaded from Storage: ' ,this.user);
            }
        } catch (error) {
            console.log("Failed to load user from localStorage: " , error);
        }
    }

     // Remove user from localStorage
     private removeFromStorage(){
            try{
                localStorage.removeItem("User");                
            }catch(error){
                console.error("Failed to remove user from localStorage:" , error);
            }
        }


    // Helper getter to check if user is logged in

    get isLoggedIn() : boolean{
        return this.user.id !== null;
    }
}

const userStore = new UserStore();
export default userStore;