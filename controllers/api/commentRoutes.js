const router = require("express").Router();
const {User, Post, Coment}= require("../../models");

route.get("/:id",async(req,res)=>{
  try {
    const comments= await Comment.findAll({
      where: {
        post_id: req.params.id,
      },
    });
    res.status(200).json(comments);
  }catch (err){
    console.err(err);
    res.status(500).json(err);
  }
});



module.exports = router;
