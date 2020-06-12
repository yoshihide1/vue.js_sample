const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()


//新規登録の時
// exports.addMessage = functions.auth.user().onCreate(async (user) => {
//   console.log(user)
//   const fullName = user.displayName || 'unknown'
//   await admin.firestore().collection('test').add({
//     name: 'テスト',
//     text: `${fullName}さん`,
//     timestamp: admin.firestore.FieldValue.serverTimestamp(),
//   })
//   console.log(2)
// })

//test用
exports.sample = functions.https.onCall((data, context) => {
  const text = data.text
  const name = data.name || null
  const email = data.email || null
  const uid = context.auth.uid
  const test1 = context.auth
  
  console.log(data)
  console.log(context)
  return {text, name, uid, email, test1, test2}
})

//ユーザー登録処理
exports.user = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  await admin.firestore().collection('users').add({
    displayName: data.displayName || "unknown",
    emai: data.email,
    uid: uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp()

  })
})

//マイページ登録処理
exports.star = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  await admin.firestore().collection('star').add({
    category: data.category,
    name: data.name,
    address: data.address || null,
    tel: data.tel || null,
    image: data.image || null,
    opentime: data.opentime || null,
    url: data.url || null,
    uid: uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
    
  })
})