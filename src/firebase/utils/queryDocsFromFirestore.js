import { getFirestore, collection, getDocs, query } from "firebase/firestore";

export const queryDocsFromFirestore = async (collectionName, queryFunc) => {
  const db = getFirestore();

  const collectionRef = collection(db, collectionName);

  const q = query(collectionRef, queryFunc);

  const querySnapshot = await getDocs(q);
  const documents = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    documents.push({ id: doc.id, ...data });
  });

  return documents;
};

export default queryDocsFromFirestore;
