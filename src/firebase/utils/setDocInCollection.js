import { getFirestore, doc, setDoc } from "firebase/firestore";

const setDocInCollection = async (collectionName, document, uid) => {
  const db = getFirestore();

  try {
    await setDoc(doc(db, collectionName, uid), document);
    return { id: uid, ...document };
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default setDocInCollection;
