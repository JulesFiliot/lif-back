const category = require('../service/category');

exports.getCategories = (req,res)=>{
    category.getCategories(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.getSubcats = (req,res)=>{
    category.getSubcats(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.createCategory = (req,res)=>{
    category.createCategory(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.createSubcat = (req,res)=>{
    category.createSubcat(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}