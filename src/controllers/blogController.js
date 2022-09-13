const blogsModel = require("../models/blogmodel");
const authorModel = require("../models/authorModel");


//CREATE BLOG

const createBlogs = async function (req, res) {
  try {
    let data = req.body;
    let authorId = req.body.authorId;
    if (!authorId)
      return res.status(400).send({ status: false, msg: "please provide authorId" });
    if (Object.keys(data).length != 0) {
      let authorId = await authorModel.findOne({ _id: data.authorId });
      if (!authorId) return res.status(400).send({ status: false, msg: "please provide invalid auhtor id " });

      let savedData = await blogsModel.create(data);
      return res.status(201).send({ status: true, data: savedData });


    } else {
      return res.status(400).send({ status: false, msg: "body is empty" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};



//GET BLOG

const getblogs = async function (req, res) {
  try {
    let data = req.query
    const check = await blogsModel.find
      ({
        data, isDeleted: false, isPublished: true,
      });
    if (check.length == 0)
      return res.status(404).send({ status: false, msg: "No blogs found" });

    return res.status(200).send({ status: true, data: check });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};



//UPDATE BLOG
const updateBlog = async function (req, res) {
  try {
    let getId = req.params.blogId;
    let data = req.body;

    if (!data)
      return res.status(404).send({ status: false, msg: "data is not provide" });
    let checkId = await blogsModel.findOne({ _id: getId });
    if (checkId) {
      if (checkId.isDeleted === false) {
        let check = await blogsModel.findByIdAndUpdate(
          getId,
          {
            $push: { tags: data.tags, subcategory: data.subcategory },
            title: data.title, body: data.body, category: data.category, isPublished: true, publishedAt: Date.now()
          },
          { new: true }
        );
        return res.status(200).send({ status: true, message: "update Successful", data: check });
      } else {
        return res.status(404).send("CANT UPDATE , IT IS DELETED");
      }
    } else {
      return res.status(401).send({ status: false, msg: "Please enter valid Blog id" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, error: error.message });
  }
};




//DELETE BLOG
// (delete the documnet by blogID).

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId
    if (!blogId) { return res.status(404).send("KINDLY ADD BLOG ID") }
    let blog = await blogsModel.findById(blogId)
    if (!blog) { return res.status(404).send("NOT A VALID BLOG ID") }
    if (blog.isDeleted == false) {
      let save = await blogsModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
      return res.status(200).send({ status: true, msg: save })
    }
    else {
      res.status(404).send({ status: false, msg: "already deleted" })
    }
  }
  catch (error) {
    res.status(500).send(error.message);
  }
}




//DELETE BY QUERY
//(delete the document by query). 

const deletebyquery = async function (req, res) {
  try {
    let data = req.query;
    let find = await blogsModel.findOne(data);
    if (!find) {
      return res.status(404).send({ status: false, msg: "Blog is not created" });
    }
    if (find.isDeleted == true) {
      return res.status(400).send({ status: false, msg: "THIS DOCUMENT Is deleted" });
    }
    let saved = await blogsModel.findOneAndUpdate(
      data,
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    res.status(200).send({ status: true, msg: saved });
  }
  catch (error) {
    res.status(500).send(error.message);
  }
};



module.exports.deletebyquery = deletebyquery;
module.exports.deleteBlog = deleteBlog;
module.exports.updateBlog = updateBlog;
module.exports.createBlogs = createBlogs;
module.exports.getblogs = getblogs;