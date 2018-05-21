'use strict';
var expect = chai.expect;
chai.should();
describe(
		'cqutil',
		function() {
			describe('getBasePath', function() {
				console.log("hello1");
				it('should return "http:://localhost:9876"', function() {
					var basePath = getBasePath();
					expect(basePath).to.equal('http:://localhost:9876');
				});

			});

			describe('adjustHeight', function() {
				it('should call "gadgets.window.adjustHeight()"', function() {
					window.gadgets = {
						window : {
							adjustHeight : function() {
							}
						}
					}

					var spy = sinon.spy(gadgets.window, 'adjustHeight');
					var clock = sinon.useFakeTimers();
					adjustHeight();
					clock.tick(100);
					spy.should.have.been.calledOnce;
					clock.restore();
				});
			});

			describe('setVisibilityOf', function() {
				var show, hide;
				beforeEach(function() {
					window.$ = function(arg) {
						return {
							show : show,
							hide : hide
						};
					}

					show = sinon.stub();
					hide = sinon.stub();
				});

				it('should call "$.show(div1)"', function() {
					var spy$ = sinon.spy(window, '$');
					setVisibilityOf("div1", true);
					spy$.should.have.been.calledWith("#div1");
					show.should.have.been.calledWith({
						complete : adjustHeight
					});
				});

				it('should call "$.hide(div1)"', function() {
					var spy$ = sinon.spy(window, '$');
					setVisibilityOf("div1", false);
					spy$.should.have.been.calledWith("#div1");
					hide.should.have.been.calledWith({
						complete : adjustHeight
					});
				});
			});

			describe('setLoading', function() {
				it('should call "setVisibilityOf(loading, true)"', function() {
					var stub = sinon.stub(window, "setVisibilityOf");
					setLoading(true);
					stub.should.have.been.calledWith('loading', true);
				});
			});

			describe('loadPrefs', function() {
				var prefsMock;
				beforeEach(function() {
					var prefs = {};
					prefs.getString = function(prefName) {
						return 'prefValue';
					};

					window.prefs = prefs; // <-- set it here
					window.DEBUG = true;
				});

				it('should log "loadPrefs entry"', function() {
					var spy = sinon.spy(console, 'log');
					prefsMock = sinon.mock(prefs);
					prefsMock.expects('getString').withArgs('repo').returns(
							'myrepo');
					prefsMock.expects('getString').withArgs('db').returns(
							'mydb');
					loadPrefs();
					prefsMock.restore();
					prefsMock.verify();
				});
			});

			describe(
					'getRepoNameFromDbUrl',
					function() {
						it(
								'should return "9.0.0"',
								function() {
									var repoName = getRepoNameFromDbUrl("http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL");
									expect(repoName).to.equal('9.0.0');
								});
						it('should return ""', function() {
							var repoName = getRepoNameFromDbUrl("");
							expect(repoName).to.equal('');
						});

					});

			describe(
					'getDbNameFromDbUrl',
					function() {
						it(
								'should return "SAMPL"',
								function() {
									var dbName = getDbNameFromDbUrl("http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL");
									expect(dbName).to.equal('SAMPL');
								});
						it('should return ""', function() {
							var dbName = getDbNameFromDbUrl("");
							expect(dbName).to.equal('');
						});
					});

			describe(
					'getRecordPreviewHtml',
					function() {
						it(
								'should call makeRequest',
								function() {
									window.gadgets = {
										io : {
											RequestParameters : {
												METHOD : 'method'
											},
											MethodType : {
												GET : 'get'
											}
										}
									};

									var cbStub = sinon.stub();
									var initParamsStub = sinon.stub(window,
											"initParams");
									initParamsStub.callsFake(function() {
										console.log("fake");
										return {};
									});
									var makeRequestStub = sinon.stub(window,
											"makeRequest");
									getRecordPreviewHtml(
											'http://localhost:9080/cqweb/oslc/repo/MYREPO/db/SAMPL/record/16777223-33554438',
											cbStub);
									initParamsStub.should.have.been.calledOnce;
									makeRequestStub.should.have.been
											.calledWith('http://localhost:9080/cqweb/oslc/repo/MYREPO/db/SAMPL/record/16777223-33554438/preview?content=fragment');

									initParamsStub.restore();
									makeRequestStub.restore();
									window.gadgets = null;
								});
					});

			describe(
					'initParams',
					function() {
						before(function() {
							window.gadgets = {
									io : {
										RequestParameters : {
											AUTHORIZATION : 'authorization',
											HEADERS : 'headers',
											OAUTH_USE_TOKEN : 'oauth_use_token'
										},
										AuthorizationType : {
											OAUTH : 'oauth'
										}
									}
								};
							window.prefs = {
									getString : function(str) {
										return str;
									}
								}
						});

						it(
								'should set initial parameters for OSLC V1',
								function() {
									var params = initParams();
									expect(params[gadgets.io.RequestParameters.HEADERS]["Accept"]).to
											.equal("application/json");
									expect(params['OAUTH_REQUEST_TOKEN_URL']).to
											.equal('oauthRequestTokenURI');
									expect(params['OAUTH_ACCESS_TOKEN_URL']).to
											.equal('oauthAccessTokenURI');
									expect(params['OAUTH_AUTHORIZATION_URL']).to
											.equal('authorizationURI'
													+ "?oauth_callback="
													+ getBasePath()
													+ "/demogadgets/cqgadgets/oauth-callback.html");
									expect(params['OAUTH_PROGRAMMATIC_CONFIG']).to
											.equal('true');
									expect(params['OAUTH_PARAM_LOCATION']).to
											.equal('post-body');
									expect(params[gadgets.io.RequestParameters.OAUTH_USE_TOKEN]).to
											.equal('always');
								});
						it(
								'should set initial parameters for OSLC V2',
								function() {
									var params = initParams(true);
									expect(params[gadgets.io.RequestParameters.HEADERS]["Accept"]).to
											.equal("application/json");
									expect(params[gadgets.io.RequestParameters.HEADERS]["OSLC-Core-Version"]).to
											.equal("2.0");
									expect(params['OAUTH_REQUEST_TOKEN_URL']).to
											.equal('oauthRequestTokenURI');
									expect(params['OAUTH_ACCESS_TOKEN_URL']).to
											.equal('oauthAccessTokenURI');
									expect(params['OAUTH_AUTHORIZATION_URL']).to
											.equal('authorizationURI'
													+ "?oauth_callback="
													+ getBasePath()
													+ "/demogadgets/cqgadgets/oauth-callback.html");
									expect(params['OAUTH_PROGRAMMATIC_CONFIG']).to
											.equal('true');
									expect(params['OAUTH_PARAM_LOCATION']).to
											.equal('post-body');
									expect(params[gadgets.io.RequestParameters.OAUTH_USE_TOKEN]).to
											.equal('always');
								});

						after(function() {
							window.gadgets = null;
							window.prefs = null;
						});
					});

			describe(
					'doGet',
					function() {
						var cbStub;
						var initParamsStub;
						var makeRequestStub;

						before(function() {
							console.log("beforeall");
							cbStub = sinon.stub();
							initParamsStub = sinon.stub(window, "initParams");
							initParamsStub.callsFake(function() {
								return {};
							});
							makeRequestStub = sinon.stub(window, "makeRequest");
							window.gadgets = {
								io : {
									RequestParameters : {
										METHOD : 'method'
									},
									MethodType : {
										GET : 'get'
									}
								}
							};
						});

						it(
								'should call makeRequest with OSLCv1',
								function() {
									doGet(
											"http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL",
											cbStub, false);
									initParamsStub.should.have.been
											.calledWith(false);
									makeRequestStub.should.have.been
											.calledWith('http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL');
								});
						it(
								'should call makeRequest with OSLCv2',
								function() {
									doGet(
											"http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL",
											cbStub, true);
									initParamsStub.should.have.been
											.calledWith(true);
									makeRequestStub.should.have.been
											.calledWith('http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL');

								});

						after(function() {
							window.gadgets = null;
							initParamsStub.restore();
							makeRequestStub.restore();
						});
					});

			describe(
					'doGetXML',
					function() {
						var cbStub;
						var initParamsStub;
						var makeRequestStub;

						before(function() {
							console.log("beforeall");
							cbStub = sinon.stub();
							initParamsStub = sinon.stub(window, "initParams");
							initParamsStub.callsFake(function() {
								console.log("callsFake");
								return {
									headers: {
									}
								};
							});
							makeRequestStub = sinon.stub(window, "makeRequest");
							window.gadgets = {
								io : {
									RequestParameters : {
										METHOD : 'method',
										HEADERS : 'headers'
									},
									MethodType : {
										GET : 'get'
									}
								}
							};
						});

						it(
								'should call makeRequest with OSLCv1',
								function() {
									doGetXML(
											"http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL",
											cbStub, false);
									initParamsStub.should.have.been
											.calledWith(false);
									makeRequestStub.should.have.been
											.calledWith('http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL', cbStub, {
												headers: {
													Accept: "application/xml"
												},
												method: 'get'
											});
								});
						it(
								'should call makeRequest with OSLCv2',
								function() {
									doGetXML(
											"http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL",
											cbStub, true);
									initParamsStub.should.have.been
											.calledWith(true);
									makeRequestStub.should.have.been
											.calledWith('http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL', cbStub, {
												headers: {
													Accept: "application/xml"
												},
												method: 'get'
											});
								});

						after(function() {
							window.gadgets = null;
							initParamsStub.restore();
							makeRequestStub.restore();
						});
					});

			describe(
					'doPost',
					function() {
						var cbStub;
						var initParamsStub;
						var makeRequestStub;

						before(function() {
							console.log("beforeall");
							cbStub = sinon.stub();
							initParamsStub = sinon.stub(window, "initParams");
							initParamsStub.callsFake(function() {
								console.log("callsFake");
								return {
									};
							});
							makeRequestStub = sinon.stub(window, "makeRequest");
							window.gadgets = {
								io : {
									RequestParameters : {
										METHOD : 'method',
										POST_DATA : 'postData'
									},
									MethodType : {
										POST : 'post'
									}
								}
							};
						});

						it(
								'should call makeRequest with POST method and postData',
								function() {
									doPost(
											"http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL",
											cbStub, 'postData');
									initParamsStub.should.have.been
											.calledWith();
									makeRequestStub.should.have.been
											.calledWith('http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL', cbStub, {
												postData: 'postData',
												method: 'post'
											});
								});
						it(
								'should call makeRequest with POST method with postData ',
								function() {
									doPost(
											"http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL",
											cbStub);
									initParamsStub.should.have.been
											.calledWith();
									makeRequestStub.should.have.been
											.calledWith('http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL', cbStub, {
												method: 'post'
											});
								});

						after(function() {
							window.gadgets = null;
							initParamsStub.restore();
							makeRequestStub.restore();
						});
					});

			describe("getOAuthFriendsApiUrl", function(){
				it("should return ", function(){
					var oAuthFriendsApiUrl = getOAuthFriendsApiUrl();
					expect(oAuthFriendsApiUrl).to.be.equal("/app/api/rest/oAuthFriends?friendType=clearquest");
				})
			});

			describe("checkIfFTSenabled", function(){
				var cbStub;
				var doGetXMLStub;

				beforeEach(function() {
					cbStub = sinon.stub();
					doGetXMLStub = sinon.stub(window, 'doGetXML');
					doGetXMLStub.callsFake(function(dbUrl, callback) {
						callback();
					});
				});

				it("should call callback with true ", function(){
					var _handleCheckIfFTSenabledStub = sinon.stub(window, '_handleCheckIfFTSenabled');
					_handleCheckIfFTSenabledStub.callsFake(function(response, callback) {
						callback(true);
					});
					checkIfFTSenabled("http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL", cbStub);

					doGetXMLStub.should.have.been.calledOnce;
					_handleCheckIfFTSenabledStub.should.have.been.calledOnce;
					cbStub.should.have.been.calledWith(true);
					_handleCheckIfFTSenabledStub.restore();
				});
				it("should call callback with false ", function(){
					var _handleCheckIfFTSenabledStub = sinon.stub(window, '_handleCheckIfFTSenabled');
					_handleCheckIfFTSenabledStub.callsFake(function(response, callback) {
						callback(false);
					});

					checkIfFTSenabled("http://localhost:9080/cqweb/oslc/repo/9.0.0/db/SAMPL", cbStub);

					doGetXMLStub.should.have.been.calledOnce;
					_handleCheckIfFTSenabledStub.should.have.been.calledOnce;
					cbStub.should.have.been.calledWith(false);
					_handleCheckIfFTSenabledStub.restore();
				});

				afterEach(function() {
					doGetXMLStub.restore();
				});
			});
		});
