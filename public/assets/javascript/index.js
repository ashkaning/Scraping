$(document).ready(function () {

  $(".scrape-new").on("click", function () {

    $.ajax("/api/fetch", {
      type: "GET"
    }).then(function (data) {
      window.location.reload()
    })
      .catch(err => console.log(err));
  })

  $(".save").on("click", function () {
    var articleToSave = $(this)
      .parents(".card")
      .data();
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;

    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
      console.log(data)
    }).catch(err => console.log(err))
  })

  $(".clear").on("click", function () {
    $.ajax("/deleteall", {
      type: "DELETE"
    }).then((deleteRes) => {
      console.log(deleteRes)
      window.location.reload()
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
    $(".articleId").text("")
    $(".preNotes").empty()
    $(".noteText").text("")
    var getArticleid = $(this)
      .parents(".card")
      .data();
    $.ajax({
      method: "GET",
      url: "/articleNotes/" + getArticleid._id
    }).then((noteResponse) => {
      console.log(noteResponse)
      $(".popupNote").show()
      $(".articleId").text(noteResponse._id)

      $(".preNotes").append("<p class='oldNotes'>" + noteResponse[0].note.body + "<span data-id='" + noteResponse[0].note._id + "' class='removeChildNotes'>X</span>")
    })
  })

  $(".preNotes").on("click", ".removeChildNotes", function () {
    var noteIdDelete = $(this).data("id")

    $.ajax({
      method: "DELETE",
      url: "/deleteonenote/" + noteIdDelete
    }).then(function (data) {

      console.log(data)
    }).catch(err => console.log(err))
  })

  $(".saveNote").on("click", function (evt) {
    evt.preventDefault();
    let articleId = $(".articleId").text()
    let body = $(".noteText").val()
    console.log(articleId + "---" + body)
    $.ajax({
      type: "POST",
      url: "/addnote/" + articleId,
      data: { body }
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