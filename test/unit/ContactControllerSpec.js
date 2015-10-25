describe('When I visit the contact list page.', function() {
    var expect = chai.expect;
    beforeEach(module('ContactModule'));

    describe("And the user adds a new customer", function(){
        function fakeModelInstanceProvider(isSuccess, result){
          this.create = function(){
            var _success, _error;
            var fakeModalInstance = {
              close: function(response){
                if (isSuccess){ 
                    _success(result); 
                  }
                  else {
                    _error(result); 
                  }
              },
              result: {
                then: function(success, error){
                  _success = success;
                  _error = error;
                }
              }
            };

            return fakeModalInstance;
          }; 
        }

        function fakeModalProvider(options, fakeInstance){
          return {
            options: options,
            open: function(){
              return fakeInstance;
            }
          };
        }

      describe("And the customer is successfully created", function(){
        var ctrl, modalCtrl, scope, modalScope, $httpBackend, fakeModal, fakeModalInstance;
        var contacts = [
          { id: 1, name: 'Joe' }, 
          { id: 2, name: 'Mike' }];

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
          var contact = {
            id: 3,
            name: "Paul"
          };
          $httpBackend = _$httpBackend_;
          $httpBackend.expectGET('/contacts/').respond(contacts);
          $httpBackend.expectPOST('/contacts/').respond({
            success: true,
            data: contact
          });
          scope = $rootScope.$new();
          fakeModalInstance = new fakeModelInstanceProvider(true, {
              success: true,
              contact: contact
          }).create();
          fakeModal = new fakeModalProvider({}, fakeModalInstance);
          ctrl = $controller('ContactListCtrl', { $scope: scope, $uibModal: fakeModal });

          modalScope = $rootScope.$new();
          modalCtrl = $controller('SetContactModalCtrl', { $scope: modalScope, $uibModalInstance: fakeModalInstance, contact: undefined })
        }));

        it("Adds the new customer to the first in the list", function(){
          scope.addContact();
          modalScope.ok();
          $httpBackend.flush();

          expect(scope.contacts[0].id).to.equal(3);
        });

         afterEach(function() {
           $httpBackend.verifyNoOutstandingExpectation();
           $httpBackend.verifyNoOutstandingRequest();
         });

        it("Displays a success message to the user", function(){
          scope.addContact();
          modalScope.ok();
          $httpBackend.flush();

          expect(scope.alerts.data[0].type).to.equal("success");
          expect(scope.alerts.data[0].message).to.equal("Contact successfully created.");
        });
      });

      describe("And the customer is NOT created", function(){
        var ctrl, modalCtrl, scope, modalScope, $httpBackend, fakeModal, fakeModalInstance;
        var contacts = [
          { id: 1, name: 'Joe' }, 
          { id: 2, name: 'Mike' }];

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
          var contact = {
            id: 3,
            name: "Paul"
          };
          $httpBackend = _$httpBackend_;
          $httpBackend.expectGET('/contacts/').respond(contacts);
          $httpBackend.expectPOST('/contacts/').respond({
            success: false,
            error: "An error occurred"
          });
          scope = $rootScope.$new();
          fakeModalInstance = new fakeModelInstanceProvider(true, {
              success: false,
              error: "An error occurred"
          }).create();
          fakeModal = new fakeModalProvider({}, fakeModalInstance);
          ctrl = $controller('ContactListCtrl', { $scope: scope, $uibModal: fakeModal });

          modalScope = $rootScope.$new();
          modalCtrl = $controller('SetContactModalCtrl', { $scope: modalScope, $uibModalInstance: fakeModalInstance, contact: undefined })
        }));

         afterEach(function() {
           $httpBackend.verifyNoOutstandingExpectation();
           $httpBackend.verifyNoOutstandingRequest();
         });

        it("Displays an error message to the user", function(){
          scope.addContact();
          modalScope.ok();
          $httpBackend.flush();

          expect(scope.alerts.data[0].type).to.equal("danger");
          expect(scope.alerts.data[0].message).to.equal("An error occurred");
        });
      });
    });

    describe("And the user removes a valid customer", function(){
      var ctrl, scope, $httpBackend;
      var contacts = [
        { id: 1, name: 'Joe' }, 
        { id: 2, name: 'Mike' }];

      beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/contacts/').respond(contacts);
        $httpBackend.expectDELETE('/contacts/2').respond({});
        scope = $rootScope.$new();
        ctrl = $controller('ContactListCtrl', { $scope: scope, $uibModal: {} });
      }));

      afterEach(function() {
           $httpBackend.verifyNoOutstandingExpectation();
           $httpBackend.verifyNoOutstandingRequest();
      });

      it("Removes the customer from the list", function(){
        scope.removeContact(contacts[1]);
        $httpBackend.flush();
        expect(scope.contacts[0].id).to.equal(1);
        expect(scope.contacts.length).to.equal(1);
      });
    });
});