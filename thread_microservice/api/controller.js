const thread = require('../service/thread');

exports.getThreads = (req,res)=>{
    thread.getThreads(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.createThread = (req,res)=>{
    thread.createThread(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.getSubcatThreads = (req,res)=>{
    thread.getSubcatThreads(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.voteThread = (req,res)=>{
    thread.voteThread(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}