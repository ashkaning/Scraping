$(document).ready(function () {

  $(".scrape-new").on("click", function () {
    $.ajax("/api/fetch", {
      type: "GET"
    }).then(data => console.log(data))
      .catch(err => console.log(err));
  })

  $(".save").on("click", function () {
    var articleToSave = $(this)
      .parents(".card")
      .data();
     // alert('alo'+articleToSave._id)
    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
   
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
     /*  if (data.saved) {
        initPage();
      } */
      console.log(data)
    }).catch(err=>console.log(err))
  })
})