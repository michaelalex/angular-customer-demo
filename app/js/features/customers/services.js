var customerServiceModule = angular.module("CustomerServicesModule", []);

customerServiceModule.service("Customers", ["$http", function($http){
	this.save = function(customer){
		return $http.post("/customers/");
	};

	this.getAll = function(){
		return $http.get("/customers/");
	};

	this.get = function(id){
		return $http.get("/customers/" + id);
	};

	this.remove = function(id){
		return $http.delete("/customers/" + id);
	};
}]);

customerServiceModule.factory("Alerts", function(){
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