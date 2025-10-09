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
    }

    setUser(user : User){
        this.user = user;
    }

    clearUser(){
        this.user = {id: null , name : "" , phone_number: "" , email : null};
    }
}

const userStore = new UserStore();
export default userStore;