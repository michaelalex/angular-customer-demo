var customerControllerModule = angular.module("CustomerControllersModule", []);

customerControllerModule.controller('SetCustomerModalCtrl', ['$scope', '$uibModalInstance', 'Customers',
	function($scope, $uibModalInstance, Customers, customer){
		$scope.customer = customer;

		$scope.ok = function () {
			Customers.save($scope.customer).then(function(result){
				$uibModalInstance.close({
					success: result.success,
					data: result.data
				});
			}, function(error){
				$uibModalInstance.close({
					success: false,
					error: error
				});
			});
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
}]);

customerControllerModule.controller('CustomerListCtrl', ['$scope', '$uibModal', 'Customers', 'Alerts',
  function($scope, $uibModal, Customers, Alerts) {
  	$scope.customers = [];
  	$scope.alerts = Alerts;

  	Customers.getAll().then(function (response){
  		$scope.customers = response.data;
  	}, function (){
  		$scope.alerts.addErrorAlert('An error occurred loading customers');
  	});

  	function openCustomerModalDialog(customer, successCallback){
		var modalInstance = $uibModal.open({
		    animation: true,
		    templateUrl: 'setCustomer.html',
		    controller: 'SetCustomerModalCtrl',
		    resolve: {
		    	customer: function () {
		        	return customer;
		    	}
		    }
		});

		modalInstance.result.then(successCallback, function () { /* modal dismissed */ });
  	}

  	function onAddCustomerSuccess(result){
		if (result.success){
			$scope.customers.unshift(result.customer);
			$scope.alerts.addSuccessAlert('Customers successfully created.');
		}
		else {
			$scope.alerts.addErrorAlert(result.error);
		}
  	}

  	function findCustomer(customer){
  		for (var index = 0; index < $scope.customers.length; index++){
			if ($scope.customers[index].id === customer.id){
				return index;
			}
		}
		return -1;
  	}

  	function onEditCustomerSuccess(result){
		if (result.success){
			var index = findCustomer(result.customer);
			if (index !== -1){
				$scope.customers[index] = result.customer;
			}
			$scope.alerts.addSuccessAlert('Customer successfully saved.');
		}
		else {
			$scope.alerts.addErrorAlert(result.error);
		}
  	}

  	$scope.addCustomer = function(){
  		openCustomerModalDialog(undefined, onAddCustomerSuccess);
  	};

  	$scope.editCustomer = function(customer){
  		if (!customer){ return; }
		openCustomerModalDialog(customer, onEditCustomerSuccess);
  	};

  	$scope.removeCustomer = function(customer){
  		Customers.remove(customer.id).then(function (response){
  			var index = findCustomer(customer);
  			if (index !== -1){
  				$scope.customers.splice(index, 1);
  			}
  		}, function(){

  		});
   	};
}]);