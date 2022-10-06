import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export const listenDocsToArray = (
  collectionName,
  callback,
  orderByParam,
  limitAmount = 50
) => {
  const db = getFirestore();

  console.log("collectionName", collectionName);
  console.log("orderByParam", orderByParam);
  const collectionRef = collection(db, collectionName);
  const queryRef =
    orderByParam &&
    query(
      collectionRef,
      orderBy(orderByParam.field, orderByParam.direction),
      limit(limitAmount)
    );

  return onSnapshot(
    orderByParam ? queryRef : collectionRef,
    (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        documents.push({ id: doc.id, ...data });
      });
      console.log("Will call callback with: ", documents);
      callback(documents);
    }
  );
};

export default listenDocsToArray;
