require('dotenv').config();

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
    let response = "";
    const ref = admin.database().ref('categories/')
    ref.once('value', (snapshot) => {
        response = snapshot.val();
        callback("",response);
      });
}

exports.getSubcats = (req,res,callback) => {
    //TO REWORK
    try{
        let response = "";
        var ref = admin.database().ref('subcategories');
        const filter = req.query.filter;
        const page = req.query.page;
        const per_page = req.query.per_page;
        var filters = [];
        if (req.params.cat_id) {
            filters.push({field : 'parent_cat_id', operator: 'eq', value: req.params.cat_id.toString()})
        }

        if (filter) {
            const filters_raw = filter.split(',');
            filters_raw.forEach((filter) => {
                const [field, operator, value] = filter.split('%');
                filters.push({
                    field,
                    operator,
                    value
                })
            })
        }

        if (filters.length > 0) {
            if(filters[0].operator === 'eq'){
                ref = ref.orderByChild(filters[0].field).equalTo(filters[0].value);
            }
            else if(filters[0].operator === 'lt'){
                ref = ref.orderByChild(filters[0].field).endAt(filters[0].value)
            }
            else if(filters[0].operator === 'gt'){
                ref = ref.orderByChild(filters[0].field).startAt(filters[0].value)
            }
            else{
                callback('invalid operator');
            }
        }

        ref.once("value", function(snapshot) {
            var response = snapshot.val()
            if (page && page > 0 && per_page && per_page > 0) {
                response = Object.fromEntries(Object.entries(response).slice((page - 1) * per_page, page * per_page));
            }
            const entries = Object.entries(response);
            for (let [key, value] of entries) {
                if (filters && filters.length === 2) {
                    if(filters[1].operator === 'eq'){
                        if (response[key][filters[1].field].toString() != filters[1].value){
                            delete response[key];
                        }
                    }
                    else if(filters[1].operator === 'lt'){
                        if (response[key][filters[1].field] > filters[1].value){
                            delete response[key];
                        }
                    }
                    else if(filters[1].operator === 'gt'){
                        if (response[key][filters[1].field] < filters[1].value){
                            delete response[key];
                        }
                    }
                    else{
                        return callback('invalid operator');
                    }
                }
            }
            callback("",response);
        });
    }
    catch(err){
        console.log(err)
        callback('error');
    }
}

exports.createCategory = (req,res,callback) => {
    const ref = admin.database().ref('categories/');
    ref.push(req.body.name);
    callback("",'created');
}

exports.createSubcat = (req,res,callback) => {
    const subcategory = new SubcategoryDTO(req.body.name, req.body.parent_cat_id.toString());
    const ref = admin.database().ref('subcategories/')
    ref.push(subcategory);
    callback("",'created');
}
