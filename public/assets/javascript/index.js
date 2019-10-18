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
    }).catch(err => console.log(err))
  })

  $(".clear").on("click", function () {
    $.ajax("/deleteall", {
      type: "DELETE"
    }).then((deleteRes) => {
      console.log(deleteRes)
    }).catch((err) => console.log(err))
  })

  $(".delete").on("click", function () {
    var articleToDelete = $(this)
      .parents(".card")
      .data();
    $(this)
      .parents(".card")
      .remove();

    articleToDelete.saved = true;

    $.ajax({
      method: "DELETE",
      url: "/delete/" + articleToDelete._id,
      data: articleToDelete
    }).then(function (data) {

      console.log(data)
    }).catch(err => console.log(err))
  })

  $(".notes").on("click", function () {
    var noteToAdd = $(this)
      .parents(".card")
      .data();
    $(".articleId").text(noteToAdd._id)
    $(".popupNote").show()
  })

  $(".saveNote").on("click", function (evt) {
    evt.preventDefault();
    let articleId= $(".articleId").text()
    let body = $(".noteText").val()
    console.log(articleId + "---"+ body)
    $.ajax({
      type: "POST",
      url: "/addnote/" + articleId,
      data: {body}
    }).then(function (data) {
      console.log(data)
      $(".popupNote").hide()
    }).catch(err => console.log(err))

  })

  $(".closeNote").on("click", evt => {
    evt.preventDefault();
    $(".popupNote").hide()
  })
})
///////////////////////////////////////
//////////////////////////////////////////
///////////////////////////////////////////
//////////////////////////////////////////