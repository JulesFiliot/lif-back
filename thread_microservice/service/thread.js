require('dotenv').config();

const ThreadDTO = require('../dto/thread-dto');
const admin = require('firebase-admin');
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH); //add path to service_account_key.json
const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyCmmvusffkyhITJBWJuN-eN58XQKBwCRDQ",
    authDomain: "lif-inc.firebaseapp.com",
    projectId: "lif-inc",
    storageBucket: "lif-inc.appspot.com",
    messagingSenderId: "106325689547",
    appId: "1:106325689547:web:043220d36608dd139a074e",
    databaseURL:"https://lif-inc-default-rtdb.europe-west1.firebasedatabase.app"
};
const app = admin.initializeApp(firebaseConfig);

exports.getThreads = (req,res,callback) => {
    let response = "";
    const ref = admin.database().ref('threads/')
    ref.once('value', (snapshot) => {
        response = snapshot.val();
        callback("",response);
      });
}

exports.createThread = (req,res,callback) => {
    try {
        const thread = new ThreadDTO(req.body.thread.parent_id, req.body.thread.subcategory_id, req.body.thread.message);
        const ref = admin.database().ref('threads/');
        ref.push(thread);
        callback("",'created');
    } catch {
        callback(true)
    }
}

exports.voteThread = (req,res,callback) => {
    //{user_id, vote: 'up' ou 'down', 'cancel': true ou false}
    try {
        const thread_id = req.params.thread_id;
        const user_id = req.body.user_id;
        const vote = req.body.vote.toLowerCase();
        const cancel = req.body.cancel ? req.body.cancel : false;
        let vote_list_ref = "";
        if (vote == 'up') {
            vote_list_ref = admin.database().ref('threads/'+thread_id+'/upvote_ids');
        } else if (vote == 'down') {
            vote_list_ref = admin.database().ref('threads/'+thread_id+'/downvote_ids');
        }
        if (cancel) {
            vote_list_ref.transaction(currentArray => {
                if (currentArray) {
                  const newArray = currentArray.filter(value => value !== user_id);
                  return newArray;
                }
                return null;
              });
        } else {
            vote_list_ref.transaction(currentArray => {
                if (currentArray) {
                  const newArray = currentArray.concat([user_id]);
                  return newArray;
                }
                return [user_id];
            });
        }
        callback("",'voted');
    } catch {
        callback(true)
    }
}