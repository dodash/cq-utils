/**
 * CQ utility methods
 */

/**
 * A callback to process only a single object
 * @callback singleObjectCallback
 * @param {Object} object
 */

/**
 * A callback to process an array of objects
 * @callback arrayCallback
 * @param {Object[]} arr
 */

/**
 * A callback to process html as a string
 * @callback htmlCallback
 * @param {string} html
 */

/**
 * A callback to process response of a AJAX request
 * @callback requestCallback
 * @param {object} response
 */

var DEBUG=false, repo=null, db=null, currentSectionId=null;

/**
 * Get base URL i.e. everything till the port number, e.g. http://localhost:8080
 * @returns {string} base URL
 */
function getBasePath(){
    return window.location.protocol + "://" + window.location.hostname + (window.location.port? (":" + window.location.port) : "");
}

/**
 * Adjusts the gadget height by calling the gadget api after adding a delay
 */
function adjustHeight(){
    DEBUG&&console.log("adjustHeight");
    setTimeout(function() {
        gadgets.window.adjustHeight();
    }, 100);
}

/**
 * Sets the visibility of an element. Also adjusts the height of the gadget after changing the visibility
 * @param {string} divId
 * @param {boolean} visible
 */
function setVisibilityOf(divId, visible)
{
    if (visible) {
        $("#" + divId).show({complete: adjustHeight});
    } else {
        $("#" + divId).hide({complete: adjustHeight});
    }
}

function setLoading(visible) {
    setVisibilityOf('loading', visible);
}

function showAlert(message) {
    var myButton = $("<button></button").attr(
            {
                "type": "button",
                "data-dismiss": "alert",
                "aria-label": "Close"
            }).addClass("close");
    $("<span>&times;</span>").attr("aria-hidden", "true").appendTo(myButton);

    var myAlert = $("<div>"+message+"</div>").
        addClass("alert alert-danger alert-dismissible");
    myButton.prependTo(myAlert);
    myAlert.appendTo($("#cq-error-view")).alert();
    myAlert.on('closed.bs.alert', function () {
        // alert disappeared, reset height
        adjustHeight();
    });
}

function closeAlert(message) {
    $("#cq-error-view").empty();
}

/**
 * Get name of the schema repository from user database URL
 * @param {string} dbUrl - The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL
 * @returns {string} schema repository name
 */
function getRepoNameFromDbUrl(dbUrl){
    if (dbUrl) {
        var pieces = dbUrl.split("/");
        var repoName = pieces[6];
        return repoName;
    }
    return "";
}

/**
 * Get name of the user database from its URL
 * @param {string} dbUrl - The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL
 * @returns {string} user database name
 */
function getDbNameFromDbUrl(dbUrl){
    if (dbUrl) {
        var pieces = dbUrl.split("/");
        var dbName = pieces[8];
        return dbName;
    }
    return "";
}

/**
 * Get the html preview of a record
 * @param {string} recordUrl - The record URL e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL/record/16777224-33602104
 * @param {htmlCallback} callback - callback to process the response. Response will contain the HTML representing the record
 */
function getRecordPreviewHtml(recordUrl, callback){
	DEBUG&&console.log("getRecordPreviewHtml: recordUrl", recordUrl);
	 var params = initParams();
	    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
	    makeRequest(recordUrl + '/preview?content=fragment', function(
	                    response) {
	            DEBUG&&console.log("getRecordPreviewHtml response.data ", response.data);
	            callback(response.data);
	    }, params);
}

function initParams(isOSLCv2){
    var params = {};
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.OAUTH;;

    if(isOSLCv2){
        params[gadgets.io.RequestParameters.HEADERS] = {
                "Accept" : "application/json",
                "OSLC-Core-Version" : "2.0"
        };
    }else{
        params[gadgets.io.RequestParameters.HEADERS] = {
                "Accept" : "application/json"
        };
    }

    params["OAUTH_REQUEST_TOKEN_URL"] = prefs.getString("oauthRequestTokenURI");
    params["OAUTH_ACCESS_TOKEN_URL"] = prefs.getString("oauthAccessTokenURI");
    params["OAUTH_AUTHORIZATION_URL"] = prefs.getString("authorizationURI") +
        "?oauth_callback=" + getBasePath() + "/demogadgets/cqgadgets/oauth-callback.html";
    params["OAUTH_PROGRAMMATIC_CONFIG"] = "true";
    params["OAUTH_PARAM_LOCATION"] = "post-body";
    params[gadgets.io.RequestParameters.OAUTH_USE_TOKEN] = "always";
    return params;
}

/**
 * Send a proxied async GET request to the given URL using OAuth
 * @param {string} url - URL to send the request to. e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL/record/16777224-33602104
 * @param {requestCallback} callback - callback to process the response. Response will be in the form of json
 * @param {boolean} isOSLCv2 - flag to indicate which version of CQ OSLC API needs to be used. By default version 1 will be used if nothing is provided
 */
function doGet(url, callback, isOSLCv2) {
    DEBUG&&console.log("doGet url isOSLCv2", url, isOSLCv2);
    var params = initParams(isOSLCv2);
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    makeRequest(url, callback, params);
}

/**
 * Send a proxied async GET request to the given URL using OAuth
 * @param {string} url - URL to send the request to. e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL/record/16777224-33602104
 * @param {requestCallback} callback - callback to process the response. Response will be in the form of XML
 * @param {boolean} isOSLCv2 - flag to indicate which version of CQ OSLC API needs to be used. By default version 1 will be used if nothing is provided
 */
function doGetXML(url, callback, isOSLCv2) {
    DEBUG&&console.log("doGetXML url isOSLCv2", url, isOSLCv2);
    var params = initParams(isOSLCv2);
    params[gadgets.io.RequestParameters.HEADERS].Accept = "application/xml";
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    DEBUG&&console.log("doGetXML params[gadgets.io.RequestParameters.HEADERS].Accept", params[gadgets.io.RequestParameters.HEADERS].Accept);
    makeRequest(url, callback, params);
}

/**
 * Send a proxied async POST request to the given URL using OAuth
 * @param {string} url - URL to send the request to. e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL/record/16777224-33602104
 * @param {requestCallback} callback - callback to process the response. Response will be in the form of json
 * @param {boolean} postData - data for the POST body
 */
function doPost(url, callback, postData) {
    DEBUG&&console.log("doPost url, callback, postData ", url, callback, postData);
    var params = initParams();
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
    if (postData) {
            params[gadgets.io.RequestParameters.POST_DATA]= postData;
    }

    makeRequest(url, callback, params);
}

function makeRequest(url, callback, params) {
    DEBUG&&console.log("makeRequest url, params ", url, params);
    gadgets.io.makeRequest(url, function(response) {
            DEBUG&&console.log("makeRequest response", response);
            DEBUG&&console.log("makeRequest gadgets.io.makeRequest response" + response);
            setLoading(false);
            if (response.oauthApprovalUrl) {
                    // Called when the user opens the popup window.
                    var onOpen = function() {
                        // once OAuth popup appears, do not allow user to open up another dialog
                        document.getElementById('link').onclick = function(){
                            return false;
                        };
                    };

                    // Called when the user closes the popup window.
                    var onClose = function() {
                        // Provide message to inform user of failed authentication attempt
                        // At this point, the Login link should only display if the authentication failed or user closed
                        // the popup dialog.
                        // Check that the "Login" link is visible.  The 'onClose' event
                        // is sent to all open ClearQuest widgets, and processing should only be done for those that are not yet logged in.
                        if (getLoginMessageVisible()) {
                            setLoginErrorVisible(true);
                        // Hide login screen and reconnect the OAuth popup to the login link
                            setLoginMessageVisible(false);
                            document.getElementById('link').onclick = popup.createOpenerOnClick();
                            makeRequest(url, callback, params);
                        }
                    };

                    var popup = new gadgets.oauth.Popup(response.oauthApprovalUrl,
                                    "height=400,width=600", onOpen, onClose);

                    var icon = document.getElementById('link');
                    icon.onclick = popup.createOpenerOnClick();
                    setLoginMessageVisible(true);
            } else if (response.data) {
                    if (response.rc == 200 || response.rc == 201) {
                            callback(response);
                    } else {
                            handleError(response);
                    }
            } else {
                    handleError(response);
            }
    }, params);
}

function handleError(response) {
	DEBUG&&console.log("handleError response", response);
    var myMsg = "An unknown error occurred.";
    if (typeof response == "string") {
        myMsg = response;
    } else {
        var jsonText;
        if (response.data) {
            jsonText = response.data;
        } else if(response.text) {
            jsonText = response.text;
        }
        if (jsonText) {
            var json = gadgets.json.parse(jsonText);
            if (json['oslc_cm:message']) {
                myMsg = json['oslc_cm:message'];
                if(json['oslc_cm:statusCode'] == "404"){
                	myMsg = prefs.getMsg("noHits");
                }
            }
        }
    }
    showAlert(myMsg);
    DEBUG&&console.log("handleError message" + myMsg);
}

function showServers() {
    $("#servers-container").show();
}
function hideServers() {
    $("#servers-container").hide();
}
function showRepos() {
    $("#repositories-container").show();
}
function hideRepos() {
    $("#repositories-container").hide();
}
function showDatabases() {
    $("#databases-container").show();
}
function hideDatabases() {
    $("#databases-container").hide();
}

// server picked, now get the OAuth info and databases from it
function handlePickServer(rootServicesUrl) {
	DEBUG&&console.log("handlePickServer entry rootServicesUrl", rootServicesUrl);
    var rootServicesUrl = rootServicesUrl;
    var params = {};
    params[gadgets.io.RequestParameters.HEADERS] = {
            "Accept" : "application/xml"
    };

    gadgets.io.makeRequest(rootServicesUrl, handleOAuthFromServer, params);
}

function handleOAuthFromServer(response) {
    DEBUG&&console.log("handleOAuthFromServer entry response", response);
    var xmlDoc = $.parseXML( response.data );

    var $xml = $( xmlDoc );

    var oauthReqTokenUrl  = $xml.find( "jfs\\:oauthRequestTokenUrl" ).attr("rdf:resource");
    var oauthAuthUrl  = $xml.find( "jfs\\:oauthUserAuthorizationUrl" ).attr("rdf:resource");
    var oauthAccessTokenUrl  = $xml.find( "jfs\\:oauthAccessTokenUrl" ).attr("rdf:resource");


    saveOAuthConfig({
        "oslc:authorizationURI":{
                "rdf:resource":oauthAuthUrl
        },
        "oslc:oauthAccessTokenURI":{
            "rdf:resource":oauthAccessTokenUrl
        },
        "oslc:oauthRequestTokenURI":{
            "rdf:resource":oauthReqTokenUrl
        }
    });

    repo = $xml.find( "oslc_cm\\:cmServiceProviders" ).attr("rdf:resource");
    prefs.set("repo",  repo);

    //hideServers();

    // loadPrefs is defined by the gadget itself.
    if (loadPrefs && typeof loadPrefs === 'function') {
        loadPrefs();
    }
    loadDatabases();
}

function saveOAuthConfig(oAuthConfig){
	DEBUG&&console.log("saveOAuthConfig: oAuthConfig" + oAuthConfig);
	DEBUG&&console.log("saveOAuthConfig: authorizationURI" + oAuthConfig["oslc:authorizationURI"]["rdf:resource"]);
	DEBUG&&console.log("saveOAuthConfig: oauthAccessTokenURI" + oAuthConfig["oslc:oauthAccessTokenURI"]["rdf:resource"]);
	DEBUG&&console.log("saveOAuthConfig: oauthRequestTokenURI" + oAuthConfig["oslc:oauthRequestTokenURI"]["rdf:resource"]);
	prefs.set("authorizationURI", oAuthConfig["oslc:authorizationURI"]["rdf:resource"]);
	prefs.set("oauthAccessTokenURI", oAuthConfig["oslc:oauthAccessTokenURI"]["rdf:resource"]);
	prefs.set("oauthRequestTokenURI", oAuthConfig["oslc:oauthRequestTokenURI"]["rdf:resource"]);
}

function pickServer(servers) {
    showServers();
    var select = $("#servers");
    select.show();
    $.each(servers, function(index, item) {
        select.append($('<option></option').val(item.rootServicesUrl).text(item.name));
    });
    if (prefs.getString("cqweb")) {
        select.val(prefs.getString("cqweb"));
    }
}

// continue clicked for choose server
function choseServer() {
    //hideServers();
    var rootServices = $("#servers").val();
    if (rootServices) {
        handlePickServer(rootServices);
    }
}

function fetchOAuthFriends(){
    DEBUG&&console.log("fetchOAuthFriends entry");
    var url = getOAuthFriendsApiUrl();
    DEBUG&&console.log("fetchOAuthFriends OAuth friends api url: ", url);
    setLoading(true);
    $.getJSON(url, handleFetchOAuthFriends);
}

/**
 * Get the URL to fetch ClearQuest OAuthFriends
 * @returns URL to fetch ClearQuest OAuthFriends
 */
function getOAuthFriendsApiUrl() {
	   return window.parent.location.pathname.substring(0,  window.parent.location.pathname.indexOf("/", 1)) + "/app/api/rest/oAuthFriends?friendType=clearquest";
}

function getOAuthFriends(){
    DEBUG&&console.log("getOAuthFriends entry");
    var url = getOAuthFriendsApiUrl();
    DEBUG&&console.log("getOAuthFriends OAuth friends api url: ", url);
    setLoading(true);
    $.getJSON(url, function(){
    	DEBUG&&console.log("getOAuthFriends entry data", data);
        setLoading(false);
        if(data.length == 1){
            // only one, so use it.
            handlePickServer(data[0].rootServicesUrl);
        }else if(data.length > 0){
            //showTooManyCQWebOAuthFriends();
            pickServer(data);
        }else{
            showNoCQWebOAuthFriendAvlbl();
        }
    });
}

function showTooManyCQWebOAuthFriends()
{
    setLoading(false);
    $("#servers-msg").show().text(prefs.getMsg("tooManyServersAvailable"));
}

function showNoCQWebOAuthFriendAvlbl()
{
    setLoading(false);
    $("#servers-msg").show().text(prefs.getMsg("noCQWebServersAvailable"));
}

function handleFetchOAuthFriends(data){
	DEBUG&&console.log("handleFetchOAuthFriends entry data", data);
    setLoading(false);
    if(data.length == 1){
        // only one, so use it.
        handlePickServer(data[0].rootServicesUrl);
    }else if(data.length > 0){
        //showTooManyCQWebOAuthFriends();
        pickServer(data);
    }else{
        showNoCQWebOAuthFriendAvlbl();
    }
}

function loadDatabases(){
    setLoading(true);
    DEBUG&&console.log("loadDatabases repo: " + repo);
    if(repo){
        doGet(repo, handleLoadDatabases, true);
    }
}

function handleLoadDatabases(response){
    DEBUG&&console.log("handleLoadDatabases");
    var data = gadgets.json.parse(response.data);
    DEBUG&&console.log("handleRecords: data" + data);
    DEBUG&&console.log("data[oslc:serviceProvider]" + data["oslc:serviceProvider"]);
    DEBUG&&console.log("data[oslc:oauthConfiguration]" + data["oslc:oauthConfiguration"]);

    var databasesJQ = $("#databases");
    var databases = data["oslc:serviceProvider"];
    if (databases && databases.length) {
        showDatabases();
        $.each(databases, function(index, database) {
            databasesJQ.append($('<option></option').val(database["rdf:about"]).text(database["cq:label"]));
        });

        if(prefs.getString("db")){
            databasesJQ.val(prefs.getString("db"))
        }else{
            prefs.set("db", databasesJQ.val());
        }
    } else {
        hideDatabases();
        showAlert("There are no databases on the server.");
    }
    adjustHeight();
}

var onDatabaseChosen = null;

function databaseChosen()
{
    if (onDatabaseChosen && typeof onDatabaseChosen === 'function') {
        onDatabaseChosen();
    }
}

function ensureDatabaseChosen(onDbChosen) {
	DEBUG&&console.log("ensureDatabaseChosen entry onDbChosen", onDbChosen);
    onDatabaseChosen = onDbChosen;
    hideServers();
    hideDatabases();
    if (repo == null || repo == "") {
        fetchOAuthFriends();
    } else if (db == null || db == "") {
        loadDatabases();
    } else {
        databaseChosen();
    }
}

// Needs to be called when databases chosen (on click of button)
function choseDatabase() {
    hideServers();
    hideDatabases();
    db = $("#databases").val();
    prefs.set("db", db);
    databaseChosen();
}

/**
 * Checks if Full text search (FTS) is enabled
 * @param {string} dbUrl - The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL
 * @param {boolean} callback - callback to do handle the response
 */
function checkIfFTSenabled(dbUrl, callback){
    setLoading(true);
	DEBUG&&console.log("checkIfFTSenabled");
	if (dbUrl) {
		doGetXML(dbUrl, (function(callback){
			return function(response){
				_handleCheckIfFTSenabled(response, callback);
			}
		})(callback));
	}
}

//Does full text search in the given ClearQuest user db url, in the given scope (like Defect, Customer, Project etc.) using the searchStr and then executes the callback passing the results
function doFullTextSearch(dbUrl, scope, searchStr, callback){
	DEBUG&&console.log("doFullTextSearch: searchStr", searchStr);
	if(typeof scope != 'undefined'){
		url = dbUrl + "/record/?rcm.type=" + scope + "&oslc_cm.pageSize=200&oslc_cm.query=" + encodeURIComponent("oslc_cm:searchTerms=") + encodeURIComponent("\"" + searchStr + "\"");
	}else{
		url = dbUrl + "/record/?oslc_cm.pageSize=200&oslc_cm.query=" + encodeURIComponent("oslc_cm:searchTerms=") + encodeURIComponent("\"" + searchStr + "\"");
	}

	DEBUG&&console.log("doFullTextSearch: url", url);
	doGet(url, callback);
}

//Does a search in the given ClearQuest user db url, in the given scope (like Defect, Customer, Project etc.) by using searchStr as the ID
function searchById(dbUrl, scope, searchStr, callback){
	DEBUG&&console.log("searchById: searchStr", searchStr);
	var url;
	if(typeof scope != 'undefined'){
		url = dbUrl + "/record/?rcm.type=" + scope + "&rcm.name=" + encodeURIComponent(searchStr);
	}else{
		url = dbUrl + "/record/?rcm.name=" + encodeURIComponent(searchStr);
	}

	DEBUG&&console.log("searchById: url", url);
	doGet(url, callback);
}

function _handleCheckIfFTSenabled(response, callback) {
	DEBUG&&console.log("handleCheckIfFTSenabled response callback", response, callback);
	var xmlDoc = $.parseXML(response.data);
	DEBUG&&console.log("handleCheckIfFTSenabled xmlDoc", xmlDoc);
	var $xml = $(xmlDoc);

	var supportsOslcSearchTerms = $xml.find("oslc_cm\\:simpleQuery").attr(
			"cq:supportsOslcSearchTerms");
	DEBUG&&console.log("handleCheckIfFTSenabled supportsOslcSearchTerms", supportsOslcSearchTerms);
	if(supportsOslcSearchTerms == "true"){
		DEBUG&&console.log("FTS is enabled");
		callback(true);
	}else{
		DEBUG&&console.log("FTS is disabled");
		callback(false);
	}
}

function _doFetch(url, callback){
	DEBUG&&console.log("_doFetch: url", callback);
	doGet(url, function(response){
		DEBUG&&console.log("_doFetch response", response);
		var data = gadgets.json.parse(response.data);
		DEBUG&&console.log("_doFetch: data", data);
		var results = data["oslc_cm:results"];
		DEBUG&&console.log("_doFetch results", results);
		callback(results)
	});
}

/**
 * Get all schema repositories of CQWeb
 * @param {string} cqWebUrl - The url of CQWeb e.g. http://localhost:9080/cqweb
 * @param {arrayCallback} callback - callback to process the response. Response will contain an array of objects, each object representing a schema repository
 */
function getSchemaRepositories(cqWebUrl, callback){
	DEBUG&&console.log("getSchemaRepositories: cqWebUrl, callback", cqWebUrl, callback);
	var url = cqWebUrl + "/oslc";
	_doFetch(url, callback);
}

/**
 * Get all user databases of a schema repository
 * @param {string} repoUrl - The url of the schema repository e.g. http://localhost:9080/cqweb/oslc/repo/reponame
 * @param {arrayCallback} callback - callback to process the response. Response will contain an array of objects, each object representing a user database
 */
function getUserDatabases(repoUrl, callback){
	DEBUG&&console.log("getSchemaRepositories: repoUrl, callback", repoUrl, callback);
	var url = repoUrl;
	_doFetch(url, callback);
}

/**
 * Get all record types of a user database
 * @param {string} dbUrl - The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL
 * @param {arrayCallback} callback - callback to process the response. Response will contain an array of objects, each object representing a record type
 */
function getRecordTypes(dbUrl, callback){
	DEBUG&&console.log("getSchemaRepositories: dbUrl, callback", dbUrl, callback);
	var url = dbUrl + "/record-type";
	_doFetch(url, callback);
}

/**
 * Get a record by name.
 * @param {string} dbUrl - The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL
 * @param {string} recordType - type of record e.g. defect, customer etc.
 * @param {string} name - name of the record
 * @param {singleObjectCallback} callback - callback to process the response. Response will contain a single object representing the record
 */
function getRecord(dbUrl, recordType, name, callback){
	DEBUG&&console.log("getRecord: dbUrl, recordType, name, callback", dbUrl, recordType, name, callback);
	var url;
	if(typeof recordType != 'undefined'){
		url = dbUrl + "/record/?rcm.type=" + recordType + "&rcm.name=" + encodeURIComponent(name);
	}else{
		url = dbUrl + "/record/?rcm.name=" + encodeURIComponent(name);
	}
	_doFetch(url, callback);
}

function setLoginMessageVisible(visible) {
	DEBUG&&console.log("setLoginMessageVisible visible", visible);
        var loginMessageContainer = document.getElementById('loginMessage');
        loginMessageContainer.style.display = (visible) ? 'block' : 'none';
        if(currentSectionId){
        	var currentSection = $("#" + currentSectionId);
            (visible) ? currentSection.hide() : currentSection.show();
        }

        adjustHeight();
}

function getLoginMessageVisible() {
	DEBUG&&console.log("getLoginMessageVisible");
    var loginMessageContainer = document.getElementById('loginMessage');
    return (loginMessageContainer.style.display == 'block');
}

function setLoginErrorVisible(visible) {
	DEBUG&&console.log("setLoginErrorVisible visible", visible);
    var loginMessageContainer = document.getElementById('loginErrorMessage');
    loginMessageContainer.style.display = (visible) ? 'block' : 'none';
}

function loadPrefs(){
	DEBUG&&console.log("loadPrefs entry");
	repo = prefs.getString("repo");
	db = prefs.getString("db");
	DEBUG&&console.log("loadPrefs exit repo, db", repo, db);
}

if(typeof exports !== 'undefined') {
    exports.loadPrefs = loadPrefs;
    exports.getBasePath = getBasePath;
    exports.adjustHeight = adjustHeight;
    exports.setVisibilityOf = setVisibilityOf;
    exports.setLoading = setLoading;
}
