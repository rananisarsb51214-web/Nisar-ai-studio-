const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

async function saveMemory(key,value){

 await db.collection('agent_memory')
 .add({
   key,
   value,
   createdAt:new Date()
 });

}

saveMemory("agent","online");
