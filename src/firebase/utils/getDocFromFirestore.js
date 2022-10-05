import { getFirestore, doc, getDoc } from "firebase/firestore";

export const getDocFromFirestore = async (collectionName, uid) => {
  const db = getFirestore();

  const docSnapshot = await getDoc(doc(db, collectionName, uid));
  if (docSnapshot.exists()) {
    return docSnapshot.data();
  } else return null;
};

export default getDocFromFirestore;
