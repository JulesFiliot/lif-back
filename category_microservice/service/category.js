require('dotenv').config();

const CategoryDTO = require('../dto/category-dto');
const SubcategoryDTO = require('../dto/subcategory-dto');
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

exports.getCategories = (req,res,callback) => {
    const ref = admin.database().ref('categories/')
    ref.once('value', (data) => {
        console.log(data.val());
      });
    callback("",'ok');
}

exports.getSubcats = (req,res,callback) => {
    if (req.params.cat_id) {
        const ref = admin.database().ref('subcategories').orderByChild('parent_cat_id').equalTo(req.params.cat_id);
        ref.once('value', (snapshot) => {
            let val = snapshot.val();
            console.log(val);
        });
        callback("",'ok');
    } else { //get all subcats
        const ref = admin.database().ref('subcategories/')
        ref.once('value', (data) => {
            console.log(data.val());
        });
        callback("",'ok');
    }
}

exports.createCategory = (req,res,callback) => {
    const category = new CategoryDTO(req.body.name);
    const ref = admin.database().ref('categories/');
    ref.push(category);
    callback("",'ok');
}

exports.createSubcat = (req,res,callback) => {
    const subcategory = new SubcategoryDTO(req.body.name, req.body.parent_cat_id);
    const ref = admin.database().ref('subcategories/')
    ref.push(subcategory);
    callback("",'ok');
}
