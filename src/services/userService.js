import { addDocToCollection }  from "../firebase/utils/addDocToCollection";
import { getDocsToArray } from "../firebase/utils/getDocsToArray";
import { deleteDocOnCollection } from "../firebase/utils/deleteDocOnCollection";
import { updateDocOnCollection } from "../firebase/utils/updateDocOnCollection";

import { getFirestore } from "firebase/firestore";

export class userService {
    
        static async addUser(user) {
            return await addDocToCollection("users", user);
        }
    
        static async addUsers(users) {
            const db = getFirestore();
            const batch = db.batch();
            users.forEach((user) => {
                const docRef = db.collection("users").doc();
                batch.set(docRef, user);
            });
            return await batch.commit();
        }
    
        static async deleteUser(id) {
            return await deleteDocOnCollection("users", id);
        }
    
        static async deleteUserByUserId(userId) {
            const users = await getDocsToArray("users");
            const userToDelete = users.find((user) => user.userId === userId);
            await deleteDocOnCollection("users", userToDelete.id);
        }
    
        static async getUsers() {
            const users = await getDocsToArray("users");
            return users;
        }
    
        static async getUserByUserId(userId) {
            const users = await this.getUsers();
            return users.find((user) => user.userId === userId);
        }
    
        static async getUsersByUserId(userId) {
            const users = await this.getUsers();
            return users.filter((user) => user.userId === userId);
        }
    
        static async updateUser(id, user) {
            const db = getFirestore();
            const usersCollection = getDocsToArray(db, "users");
            const userRef = usersCollection.doc(id);
            await updateDocOnCollection(userRef, user);
        }
    
        static async updateUserByUserId(userId, user) {
            const db = getFirestore();
            const usersCollection = getDocsToArray(db, "users");
            const userRef = usersCollection.doc(userId);
            await updateDocOnCollection(userRef, user);
        }
    }