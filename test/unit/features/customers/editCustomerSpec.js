describe('When I visit the customer list page.', function() {
    var expect = chai.expect;
    beforeEach(module('CustomerModule'));
    beforeEach(module('CustomerControllersModule'));

    describe("And the user edits an existing customer", function(){
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

      describe("And the customer is successfully saved", function(){
        var ctrl, modalCtrl, scope, modalScope, $httpBackend, fakeModal, fakeModalInstance;
        var customers = [
          { id: 1, name: 'Joe' }, 
          { id: 2, name: 'Mike' }];

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
          var customer = {
            id: 2,
            name: "Paul"
          };
          $httpBackend = _$httpBackend_;
          $httpBackend.expectGET('/customers/').respond(customers);
          $httpBackend.expectPOST('/customers/').respond({});
          scope = $rootScope.$new();
          fakeModalInstance = new fakeModelInstanceProvider(true, {
              success: true,
              customer: customer
          }).create();
          fakeModal = new fakeModalProvider({}, fakeModalInstance);
          ctrl = $controller('CustomerListCtrl', { $scope: scope, $uibModal: fakeModal });

          modalScope = $rootScope.$new();
          modalCtrl = $controller('SetCustomerModalCtrl', { $scope: modalScope, $uibModalInstance: fakeModalInstance, customer: undefined })
        }));

        it("Then updates the customer in the list", function(){
          scope.editCustomer(customers[1]);
          modalScope.ok();
          $httpBackend.flush();

          expect(scope.customers[1].name).to.equal("Paul");
        });

         afterEach(function() {
           $httpBackend.verifyNoOutstandingExpectation();
           $httpBackend.verifyNoOutstandingRequest();
         });

        it("Then a success message is displayed to the user", function(){
          scope.editCustomer(customers[1]);
          modalScope.ok();
          $httpBackend.flush();

          expect(scope.alerts.data[0].type).to.equal("success");
          expect(scope.alerts.data[0].message).to.equal("Customer successfully saved.");
        });
      });

      describe("And the customer is NOT saved", function(){
        var ctrl, modalCtrl, scope, modalScope, $httpBackend, fakeModal, fakeModalInstance;
        var customers = [
          { id: 1, name: 'Joe' }, 
          { id: 2, name: 'Mike' }];

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
          var customer = {
            id: 2,
            name: "Paul"
          };
          $httpBackend = _$httpBackend_;
          $httpBackend.expectGET('/customers/').respond(customers);
          $httpBackend.expectPOST('/customers/').respond({
            success: false,
            error: "An error occurred"
          });
          scope = $rootScope.$new();
          fakeModalInstance = new fakeModelInstanceProvider(true, {
              success: false,
              error: "An error occurred"
          }).create();
          fakeModal = new fakeModalProvider({}, fakeModalInstance);
          ctrl = $controller('CustomerListCtrl', { $scope: scope, $uibModal: fakeModal });

          modalScope = $rootScope.$new();
          modalCtrl = $controller('SetCustomerModalCtrl', { $scope: modalScope, $uibModalInstance: fakeModalInstance, contact: undefined })
        }));

         afterEach(function() {
           $httpBackend.verifyNoOutstandingExpectation();
           $httpBackend.verifyNoOutstandingRequest();
         });

        it("Then an error message is displayed to the user", function(){
          scope.editCustomer(customers[1]);
          modalScope.ok();
          $httpBackend.flush();

          expect(scope.alerts.data[0].type).to.equal("danger");
          expect(scope.alerts.data[0].message).to.equal("An error occurred");
        });
      });
    });
});