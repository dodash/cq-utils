# JavaScript library for working with ClearQuest OSLC API [![Build Status](https://travis-ci.org/dodash/cq-utils.svg?branch=master)](https://travis-ci.org/dodash/cq-utils)
## Functions

<dl>
<dt><a href="#getBasePath">getBasePath()</a> ⇒ <code>string</code></dt>
<dd><p>Get base URL i.e. everything till the port number, e.g. <a href="http://localhost:8080">http://localhost:8080</a></p>
</dd>
<dt><a href="#adjustHeight">adjustHeight()</a></dt>
<dd><p>Adjusts the gadget height by calling the gadget api after adding a delay</p>
</dd>
<dt><a href="#setVisibilityOf">setVisibilityOf(divId, visible)</a></dt>
<dd><p>Sets the visibility of an element. Also adjusts the height of the gadget after changing the visibility</p>
</dd>
<dt><a href="#getRepoNameFromDbUrl">getRepoNameFromDbUrl(dbUrl)</a> ⇒ <code>string</code></dt>
<dd><p>Get name of the schema repository from user database URL</p>
</dd>
<dt><a href="#getDbNameFromDbUrl">getDbNameFromDbUrl(dbUrl)</a> ⇒ <code>string</code></dt>
<dd><p>Get name of the user database from its URL</p>
</dd>
<dt><a href="#getRecordPreviewHtml">getRecordPreviewHtml(recordUrl, callback)</a></dt>
<dd><p>Get the html preview of a record</p>
</dd>
<dt><a href="#doGet">doGet(url, callback, isOSLCv2)</a></dt>
<dd><p>Send a proxied async GET request to the given URL using OAuth</p>
</dd>
<dt><a href="#doGetXML">doGetXML(url, callback, isOSLCv2)</a></dt>
<dd><p>Send a proxied async GET request to the given URL using OAuth</p>
</dd>
<dt><a href="#doPost">doPost(url, callback, postData)</a></dt>
<dd><p>Send a proxied async POST request to the given URL using OAuth</p>
</dd>
<dt><a href="#getOAuthFriendsApiUrl">getOAuthFriendsApiUrl()</a> ⇒</dt>
<dd><p>Get the URL to fetch ClearQuest OAuthFriends</p>
</dd>
<dt><a href="#checkIfFTSenabled">checkIfFTSenabled(dbUrl, callback)</a></dt>
<dd><p>Checks if Full text search (FTS) is enabled</p>
</dd>
<dt><a href="#getSchemaRepositories">getSchemaRepositories(cqWebUrl, callback)</a></dt>
<dd><p>Get all schema repositories of CQWeb</p>
</dd>
<dt><a href="#getUserDatabases">getUserDatabases(repoUrl, callback)</a></dt>
<dd><p>Get all user databases of a schema repository</p>
</dd>
<dt><a href="#getRecordTypes">getRecordTypes(dbUrl, callback)</a></dt>
<dd><p>Get all record types of a user database</p>
</dd>
<dt><a href="#getRecord">getRecord(dbUrl, recordType, name, callback)</a></dt>
<dd><p>Get a record by name.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#singleObjectCallback">singleObjectCallback</a> : <code>function</code></dt>
<dd><p>A callback to process only a single object</p>
</dd>
<dt><a href="#arrayCallback">arrayCallback</a> : <code>function</code></dt>
<dd><p>A callback to process an array of objects</p>
</dd>
<dt><a href="#htmlCallback">htmlCallback</a> : <code>function</code></dt>
<dd><p>A callback to process html as a string</p>
</dd>
<dt><a href="#requestCallback">requestCallback</a> : <code>function</code></dt>
<dd><p>A callback to process response of a AJAX request</p>
</dd>
</dl>

<a name="getBasePath"></a>

## getBasePath() ⇒ <code>string</code>
Get base URL i.e. everything till the port number, e.g. http://localhost:8080

**Kind**: global function
**Returns**: <code>string</code> - base URL
<a name="adjustHeight"></a>

## adjustHeight()
Adjusts the gadget height by calling the gadget api after adding a delay

**Kind**: global function
<a name="setVisibilityOf"></a>

## setVisibilityOf(divId, visible)
Sets the visibility of an element. Also adjusts the height of the gadget after changing the visibility

**Kind**: global function

| Param | Type |
| --- | --- |
| divId | <code>string</code> |
| visible | <code>boolean</code> |

<a name="getRepoNameFromDbUrl"></a>

## getRepoNameFromDbUrl(dbUrl) ⇒ <code>string</code>
Get name of the schema repository from user database URL

**Kind**: global function
**Returns**: <code>string</code> - schema repository name

| Param | Type | Description |
| --- | --- | --- |
| dbUrl | <code>string</code> | The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL |

<a name="getDbNameFromDbUrl"></a>

## getDbNameFromDbUrl(dbUrl) ⇒ <code>string</code>
Get name of the user database from its URL

**Kind**: global function
**Returns**: <code>string</code> - user database name

| Param | Type | Description |
| --- | --- | --- |
| dbUrl | <code>string</code> | The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL |

<a name="getRecordPreviewHtml"></a>

## getRecordPreviewHtml(recordUrl, callback)
Get the html preview of a record

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| recordUrl | <code>string</code> | The record URL e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL/record/16777224-33602104 |
| callback | [<code>htmlCallback</code>](#htmlCallback) | callback to process the response. Response will contain the HTML representing the record |

<a name="doGet"></a>

## doGet(url, callback, isOSLCv2)
Send a proxied async GET request to the given URL using OAuth

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL to send the request to. e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL/record/16777224-33602104 |
| callback | [<code>requestCallback</code>](#requestCallback) | callback to process the response. Response will be in the form of json |
| isOSLCv2 | <code>boolean</code> | flag to indicate which version of CQ OSLC API needs to be used. By default version 1 will be used if nothing is provided |

<a name="doGetXML"></a>

## doGetXML(url, callback, isOSLCv2)
Send a proxied async GET request to the given URL using OAuth

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL to send the request to. e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL/record/16777224-33602104 |
| callback | [<code>requestCallback</code>](#requestCallback) | callback to process the response. Response will be in the form of XML |
| isOSLCv2 | <code>boolean</code> | flag to indicate which version of CQ OSLC API needs to be used. By default version 1 will be used if nothing is provided |

<a name="doPost"></a>

## doPost(url, callback, postData)
Send a proxied async POST request to the given URL using OAuth

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL to send the request to. e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL/record/16777224-33602104 |
| callback | [<code>requestCallback</code>](#requestCallback) | callback to process the response. Response will be in the form of json |
| postData | <code>boolean</code> | data for the POST body |

<a name="getOAuthFriendsApiUrl"></a>

## getOAuthFriendsApiUrl() ⇒
Get the URL to fetch ClearQuest OAuthFriends

**Kind**: global function
**Returns**: URL to fetch ClearQuest OAuthFriends
<a name="checkIfFTSenabled"></a>

## checkIfFTSenabled(dbUrl, callback)
Checks if Full text search (FTS) is enabled

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| dbUrl | <code>string</code> | The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL |
| callback | <code>boolean</code> | callback to do handle the response |

<a name="getSchemaRepositories"></a>

## getSchemaRepositories(cqWebUrl, callback)
Get all schema repositories of CQWeb

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| cqWebUrl | <code>string</code> | The url of CQWeb e.g. http://localhost:9080/cqweb |
| callback | [<code>arrayCallback</code>](#arrayCallback) | callback to process the response. Response will contain an array of objects, each object representing a schema repository |

<a name="getUserDatabases"></a>

## getUserDatabases(repoUrl, callback)
Get all user databases of a schema repository

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| repoUrl | <code>string</code> | The url of the schema repository e.g. http://localhost:9080/cqweb/oslc/repo/reponame |
| callback | [<code>arrayCallback</code>](#arrayCallback) | callback to process the response. Response will contain an array of objects, each object representing a user database |

<a name="getRecordTypes"></a>

## getRecordTypes(dbUrl, callback)
Get all record types of a user database

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| dbUrl | <code>string</code> | The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL |
| callback | [<code>arrayCallback</code>](#arrayCallback) | callback to process the response. Response will contain an array of objects, each object representing a record type |

<a name="getRecord"></a>

## getRecord(dbUrl, recordType, name, callback)
Get a record by name.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| dbUrl | <code>string</code> | The url of the user database in which the record is stored e.g. http://localhost:9080/cqweb/oslc/repo/reponame/db/SAMPL |
| recordType | <code>string</code> | type of record e.g. defect, customer etc. |
| name | <code>string</code> | name of the record |
| callback | [<code>singleObjectCallback</code>](#singleObjectCallback) | callback to process the response. Response will contain a single object representing the record |

<a name="singleObjectCallback"></a>

## singleObjectCallback : <code>function</code>
A callback to process only a single object

**Kind**: global typedef

| Param | Type |
| --- | --- |
| object | <code>Object</code> |

<a name="arrayCallback"></a>

## arrayCallback : <code>function</code>
A callback to process an array of objects

**Kind**: global typedef

| Param | Type |
| --- | --- |
| arr | <code>Array.&lt;Object&gt;</code> |

<a name="htmlCallback"></a>

## htmlCallback : <code>function</code>
A callback to process html as a string

**Kind**: global typedef

| Param | Type |
| --- | --- |
| html | <code>string</code> |

<a name="requestCallback"></a>

## requestCallback : <code>function</code>
A callback to process response of a AJAX request

**Kind**: global typedef

| Param | Type |
| --- | --- |
| response | <code>object</code> |