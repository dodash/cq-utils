'use strict';
var expect = chai.expect;
chai.should();
describe('cqutil', function() {
	describe('getBasePath', function() {
		it('should return "http:://localhost:9876"', function() {
			/*global.window = {
				       location: {
				    	   protocol: 'http',
				    	   hostname: 'xyz.com',
				    	   port: 8080
				       },
				   };*/

			var basePath = getBasePath();
			expect(basePath).to.equal('http:://localhost:9876');
		});

		/*it('should return "http://xyz.com"', function() {
			global.window = {
				       location: {
				    	   protocol: 'http',
				    	   hostname: 'xyz.com',
				    	   port: 0
				       },
				   };

			var basePath = getBasePath();
			expect(basePath).to.equal('http://xyz.com');
		});

		it('should return "https://xyz.com"', function() {
			global.window = {
				       location: {
				    	   protocol: 'https',
				    	   hostname: 'xyz.com',
				    	   port: ''
				       },
				   };

			var basePath = getBasePath();
			expect(basePath).to.equal('https://xyz.com');
		});

		it('should return "https://xyz.com"', function() {
			global.window = {
				       location: {
				    	   protocol: 'https',
				    	   hostname: 'xyz.com',
				    	   port: null
				       },
				   };

			var basePath = getBasePath();
			expect(basePath).to.equal('https://xyz.com');
		});

		it('should return "http://xyz.com"', function() {
			global.window = {
				       location: {
				    	   protocol: 'http',
				    	   hostname: 'xyz.com',
				       },
				   };

			var basePath = getBasePath();
			expect(basePath).to.equal('http://xyz.com');
		});*/
	});

	describe('adjustHeight', function(){
		it('should call "gadgets.window.adjustHeight()"', function() {
			window.gadgets = {
					window: {
						adjustHeight: function(){
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

	describe('setVisibilityOf', function(){
		var show, hide;
		beforeEach(function(){
			window.$ = function(arg){
				return {
					show: show,
					hide: hide
				};
		}

		show = sinon.stub();
		hide = sinon.stub();
		});

		it('should call "$.show(div1)"', function() {
			var spy$ = sinon.spy(window, '$');
			setVisibilityOf("div1", true);
			spy$.should.have.been.calledWith("#div1");
			show.should.have.been.calledWith({complete: adjustHeight});
		});

		it('should call "$.hide(div1)"', function() {
			var spy$ = sinon.spy(window, '$');
			setVisibilityOf("div1", false);
			spy$.should.have.been.calledWith("#div1");
			hide.should.have.been.calledWith({complete: adjustHeight});
		});
	});

	describe('setLoading', function(){
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

		/*afterEach(function() {
			delete global.prefs; // <-- clean up here
		});*/
		it('should log "loadPrefs entry"', function() {
			var spy = sinon.spy(console, 'log');
			prefsMock = sinon.mock(prefs);
			prefsMock.expects('getString').withArgs('repo').returns('myrepo');
			prefsMock.expects('getString').withArgs('db').returns('mydb');
			loadPrefs();
			prefsMock.restore();
			prefsMock.verify();
		});
	});
});
