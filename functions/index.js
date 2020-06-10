const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()

exports.test = functions.auth.user().onCreate(async (user) => {
  console.log('functions!!')
  const email = user.email || 'email??'

  await admin.firestore().collection('messages').set({
    text: `${email} さん`,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  })
  console.log('終わり')
})
