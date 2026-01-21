const listening = require("../model/listening");
module.exports.indexpage = async (req, res) => {
  let all_data = await listening.find({});
  res.render("listings/list.ejs", { all_data });
};
module.exports.showNewListingfrom = (req, res) => {
  res.render("listings/create.ejs");
};
module.exports.showspecificdata = async (req, res) => {
  let { id } = req.params;
  let specific_data = await listening
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!specific_data) {
    req.flash("error", "The listing you are looking for could not be found.");
    return res.redirect("/listing");
  }
  console.log(specific_data);
  res.render("listings/specific_data.ejs", { specific_data });
};

module.exports.savenewlisting = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let { title, description, image, price, location, country } = req.body;
  let listening_new = new listening({
    title: title,
    description: description,
    image: { url, filename },
    price: price,
    location: location,
    country: country,
    owner: req.user._id,
  });
  //listening_new = req.user._id;
  await listening_new.save();
  req.flash("success", "New Listing is created Successfully!!");
  res.redirect("/listing");
};
module.exports.editform = async (req, res) => {
  let { id } = req.params;
  let specific_data = await listening.findById(id);
  if (!specific_data) {
    req.flash("error", "The listing you tried to edit could not be found.");
    return res.redirect("/listing");
  }
  let orginal_image = specific_data.image.url;
  orginal_image = orginal_image.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { specific_data, orginal_image });
};
// module.exports.save_editform = async (req, res) => {
//   let url = req.file.path;
//   let filename = req.file.filename;
//   let { id } = req.params;
//   let { title, description, image, price, location, country } = req.body;
//   await listening.findByIdAndUpdate(id, {
//     title: title,
//     description: description,
//     image: { url: url, filename: filename },
//     price: price,
//     location: location,
//     country: country,
//   });
//   req.flash("success", "Listing Updated Successfully!!");
//   res.redirect(`/listing/${id}`);
// };
module.exports.save_editform = async (req, res) => {
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;
  let updateData = {
    title,
    description,
    price,
    location,
    country,
  };
  if (req.file) {
    updateData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  await listening.findByIdAndUpdate(id, updateData);
  req.flash("success", "Listing Updated Successfully!!");
  res.redirect(`/listing/${id}`);
};

module.exports.destroylisting = async (req, res) => {
  let { id } = req.params;
  await listening.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!!");
  res.redirect("/listing");
};
