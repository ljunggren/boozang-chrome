document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
    alert("benny");
    loadProjectKey();
  }, false);
}, false);

var defaultProjectKey = "";

function loadProjectKey() {
  var projectKey = localStorage["projectKey"];

  // valid projectKey
  if (projectKey == undefined) {
    projectKey = "";
  }

  alert("Load Project Key = " + projectKey);

  return projectKey;
}