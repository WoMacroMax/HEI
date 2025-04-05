function addContact(name, email, phone) {
  return db.collection("contacts").add({
    name,
    email,
    phone,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function editContact(id, name, email, phone) {
  return db.collection("contacts").doc(id).update({
    name,
    email,
    phone
  });
}

function deleteContact(id) {
  return db.collection("contacts").doc(id).delete();
}

function getContacts() {
  return db.collection("contacts")
           .orderBy("createdAt", "desc")
           .get()
           .then(snapshot => {
             const contacts = [];
             snapshot.forEach(doc => contacts.push({ id: doc.id, ...doc.data() }));
             return contacts;
           });
}
