const router = require("express").Router();
const { User, Post } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll();
    res.status(200).json(postData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/user-posts", async (req, res) => {
  try {
    const userPost = await Post.findAll({
      where: {
        created_by: req.session.user_id,
      },
    });
    if (!userPost || userPost.lenght === 0) {
      res.status(404).json({ message: "No Posts Are Found" });
      return;
    }
    res.status(200).json(userPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/post-by-id/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    if (!postData) {
      res.status(404).json({ message: "No Posts Are Found" });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.session.logged_in) {
      res.status(401).json({ message: "Unauthorized: User is not logged in" });
      return;
    }
    const userId = req.session.user_id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const postData = await Post.create({
      title: req.body.title,
      content: req.body.content,
      created_by: userId,
    });
    res.status(200).json({ message: "Post Has Been Created!" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!req.session.logged_in) {
      return res
        .status(401).json({ message: "Unauthorized: User is not logged in" });
    }

    const userId = req.session.user_id;
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        created_by: userId,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Unauthorized: Incorrect User or the Post does not exist",
      });
    }

    const deletedRows = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "The Post does not exist" });
    }

    return res.status(200).json({ message: "The Post deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [updatedRowsCount, updatedPosts] = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (updatedRowsCount === 0) {
      res.status(404).json({ message: "No Posts Found" });
      return;
    }

    res.status(200).json({ message: "Updated the Post!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;




