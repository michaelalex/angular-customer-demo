var contactModule = angular.module('ContactModule', []);

contactModule.service("Contacts", ["$http", function($http){
	this.save = function(contact){
		return $http.post("/contacts/");
	};

	this.getAll = function(){
		return $http.get("/contacts/");
	};

	this.get = function(id){
		return $http.get("/contacts/" + id);
	};

	this.remove = function(id){
		return $http.delete("/contacts/" + id);
	};
}]);

contactModule.factory("Alerts", function(){
	var data = [];

	return {
		data: data,
		addSuccessAlert: function(message){
			data.push({ type: 'success', message: message });
		},
		addErrorAlert: function(message){
			data.push({ type: 'danger', message: message });
		},
		closeAlert: function(error){
			var index = data.indexOf(error);
			if (index !== -1){
				data.splice(index, 1);
			}
		}
	};
});

contactModule.controller('SetContactModalCtrl', ['$scope', '$uibModalInstance', 'Contacts',
	function($scope, $uibModalInstance, Contacts, contact){
		$scope.contact = contact;

		$scope.ok = function () {
			Contacts.save($scope.contact).then(function(result){
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

contactModule.controller('ContactListCtrl', ['$scope', '$uibModal', 'Contacts', 'Alerts',
  function($scope, $uibModal, Contacts, Alerts) {
  	$scope.contacts = [];
  	$scope.alerts = Alerts;

  	Contacts.getAll().then(function (response){
  		$scope.contacts = response.data;
  	}, function (){
  		$scope.alerts.addErrorAlert('An error occurred loading contacts');
  	});

  	function openContactModalDialog(contact, successCallback){
		var modalInstance = $uibModal.open({
		    animation: true,
		    templateUrl: 'setContact.html',
		    controller: 'SetContactModalCtrl',
		    resolve: {
		    	contact: function () {
		        	return contact;
		    	}
		    }
		});

		modalInstance.result.then(successCallback, function () { /* modal dismissed */ });
  	}

  	function onAddContactSuccess(result){
		if (result.success){
			$scope.contacts.unshift(result.contact);
			$scope.alerts.addSuccessAlert('Contact successfully created.');
		}
		else {
			$scope.alerts.addErrorAlert(result.error);
		}
  	}

  	function findContact(contact){
  		for (var index = 0; index < $scope.contacts.length; index++){
			if ($scope.contacts[index].id === contact.id){
				return index;
			}
		}
		return -1;
  	}

  	function onEditContactSuccess(result){
		if (result.success){
			var index = findContact(result.contact);
			if (index !== -1){
				$scope.contacts[index] = result.contact;
			}
			$scope.alerts.addSuccessAlert('Contact successfully saved.');
		}
		else {
			$scope.alerts.addErrorAlert(result.error);
		}
  	}

  	$scope.addContact = function(){
  		openContactModalDialog(undefined, onAddContactSuccess);
  	};

  	$scope.editContact = function(contact){
  		if (!contact){ return; }
		openContactModalDialog(contact, onEditContactSuccess);
  	};

  	$scope.removeContact = function(contact){
  		Contacts.remove(contact.id).then(function (response){
  			var index = findContact(contact);
  			if (index !== -1){
  				$scope.contacts.splice(index, 1);
  			}
  		}, function(){

  		});
   	};
}]);