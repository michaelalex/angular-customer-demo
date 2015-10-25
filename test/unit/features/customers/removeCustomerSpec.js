describe('When I visit the customer list page.', function(){
    var expect = chai.expect;
    beforeEach(module('CustomerModule'));
    beforeEach(module('CustomerControllersModule'));

   describe("And the user removes a valid customer", function(){
      var ctrl, scope, $httpBackend;
      var customers = [
        { id: 1, name: 'Joe' }, 
        { id: 2, name: 'Mike' }];

      beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/customers/').respond(customers);
        $httpBackend.expectDELETE('/customers/2').respond({});
        scope = $rootScope.$new();
        ctrl = $controller('CustomerListCtrl', { $scope: scope, $uibModal: {} });
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it("Then the customer is removed from the list.", function(){
        scope.removeCustomer(customers[1]);
        $httpBackend.flush();
        expect(scope.customers[0].id).to.equal(1);
        expect(scope.customers.length).to.equal(1);
      });
    });
});