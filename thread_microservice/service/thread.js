require('dotenv').config();

const { threadUpdate } = require('../websocket');
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
    var ref = admin.database().ref('threads/')
    if (req.params.subcat_id) {
        ref = ref.child(req.params.subcat_id.toString());
    }
    const filter = req.query.filter;
    if (filter) {
        const [field, operator, value] = filter.split('%');
        if(operator === 'eq'){
            ref = ref.orderByChild(field).equalTo(value);
        }
        else if(operator === 'lt'){
            ref = ref.orderByChild(field).endAt(value);
        }
        else if(operator === 'gt'){
            ref = ref.orderByChild(field).startAt(value);
        }
        else{
            callback('invalid operator');
        }
    }

    ref.once('value', (snapshot) => {
        response = snapshot.val();
        callback("",response);
      });
}

exports.createThread = (req,res,callback) => {
    try {
        const parent_id = req.body.parent_id ? req.body.parent_id.toString() : null;
        const subcat_id = req.body.subcat_id ? req.body.subcat_id.toString() : null;
        const message = req.body.message? req.body.message.toString() : null;
        const thread = new ThreadDTO(parent_id, subcat_id, message);
        const ref = admin.database().ref('threads/');
        ref.push(thread).then(() => {
            if (parent_id) {
                threadUpdate(thread);
            }
        });
        callback("",'created');
    } catch (error) {
        callback(true)
    }
}

exports.voteThread = (req,res,callback) => {
    //{user_id, vote: 'up' ou 'down', 'cancel': true ou false}
    try {
        const thread_id = req.params.thread_id ? req.params.thread_id.toString() : null;
        const user_id = req.body.user_id ? req.body.user_id.toString() : null;;
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
                    if (currentArray.includes(user_id)) {
                        return currentArray;
                    } else {
                        const newArray = currentArray.concat([user_id]);
                        return newArray;
                    }
                }
                return [user_id];
            });
        }
        callback("",'voted');
    } catch {
        callback(true)
    }
}