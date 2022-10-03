import { addDocToCollection }  from "../firebase/utils/addDocToCollection";
import { getDocsToArray } from "../firebase/utils/getDocsToArray";
import { deleteDocOnCollection } from "../firebase/utils/deleteDocOnCollection";
import { updateDocOnCollection } from "../firebase/utils/updateDocOnCollection";
import { selectUser } from "../redux/auth";
import { useSelector } from "react-redux";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export class friendService {
    static async addFriend(friend) {
        return await addDocToCollection("friends", friend);
    }

    static async addFriendRequest(friendRequest) {
        return await addDocToCollection("friendRequests", friendRequest);
    }

    static async addFriends(friends) {
        const db = getFirestore();
        const batch = db.batch();
        friends.forEach((friend) => {
            const docRef = db.collection("friends").doc();
            batch.set(docRef, friend);
        });
        return await batch.commit();
    }

    static sendFriendRequest(email) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let user = useSelector(selectUser);        
        const friendRequest = {
            email: email,
            userId: user.id,
            status: "pending",
        };
        return this.addFriendRequest(friendRequest);
    }


    static async deleteFriend(id) {
        return await deleteDocOnCollection("friends", id);
    }

    static async deleteFriendsByUserId(userId) {
        const friends = await getDocsToArray("friends");
        const friendsToDelete = friends.filter((friend) => friend.userId === userId);
        friendsToDelete.forEach(async (friend) => {
            await deleteDocOnCollection("friends", friend.id);
        });
    }

    static async getFriends() {
        return await getDocsToArray("friends");
    }

    static async getFriendByUserId(userId) {
        const friends = await this.getFriends();
        return friends.find((friend) => friend.userId === userId);
    }

    static async getFriendsByUserId(userId) {
        const friends = await this.getFriends();
        return friends.filter((friend) => friend.userId === userId);
    }

    static async updateFriend(id, friend) {
        const db = getFirestore();
        const friendsCollection = getDocsToArray(db, "friends");
        const friendRef = friendsCollection.doc(id);
        await updateDocOnCollection(friendRef, friend);
    }

    static async declineFriendRequest(friend) {
        const db = getFirestore();
        const friendsCollection = getDocsToArray(db, "friends");
        const friendRef = friendsCollection.doc(friend.id);
        await updateDocOnCollection(friendRef, { status: "declined" });
    }

    static async acceptFriendRequest(friend) {
        const db = getFirestore();
        const friendsCollection = getDocsToArray(db, "friends");
        const friendRef = friendsCollection.doc(friend.id);
        await updateDocOnCollection(friendRef, { status: "accepted" });
    }
  }