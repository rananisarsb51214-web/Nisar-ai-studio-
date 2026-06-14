const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

async function sync(){

 await db.collection('system')
 .doc('status')
 .set({
   online:true,
   timestamp:Date.now()
 });

 console.log("SYNC OK");

}

sync();
