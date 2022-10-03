import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export const listenDocsToArray = (collectionName, callback, orderByParam) => {
  const db = getFirestore();

  const collectionRef = collection(db, collectionName);
  const queryRef = query(
    collectionRef,
    orderBy(orderByParam.field, orderByParam.direction),
    limit(50)
  );

  return onSnapshot(orderBy ? queryRef : collectionRef, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      documents.push({ id: doc.id, ...data });
    });
    console.log("Will call callback with: ", documents);
    callback(documents);
  });
};

export default listenDocsToArray;
