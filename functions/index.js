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
    id: data.id,
    category: data.category,
    name: data.name,
    address: data.address || null,
    tel: data.tel || null,
    image: data.image || null,
    opentime: data.opentime || null,
    url: data.url || null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    uid: uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  })
})

// exports.getStar = functions.https.onCall(async (data, context) => {
//   const uid = context.auth.uid
//   let getStar = []F
//   const firestore = admin.firestore().collection('star')
//   await firestore.where('uid', '==', uid)
//     .get()
//     .then(querySnapShot => {
//       querySnapShot.forEach(doc => {
//         console.log(doc.data())
//         getStar.push(doc.data())
//       })
//       console.log(getStar)
//       return getStar
//     })
// })