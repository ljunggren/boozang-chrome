function loadOptions() {
	var projectKey = localStorage["projectKey"];

	// valid colors are red, blue, green and yellow
	if (projectKey == undefined ) {
		projectKey = "";
	}
}

function saveOptions() {
	var projectKey = document.getElementById("projectKey").value;
	localStorage["projectKey"] = projectKey;
}

function eraseOptions() {
	localStorage.removeItem("projectKey");
	location.reload();
}
