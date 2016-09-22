﻿ (function () {
    var taskAngular = angular.module('taskAngular');

    taskAngular.controller('newInvoiceController', function ($scope, dataService) {

        $scope.newInvoice = {
            "id": 0,
            "date": "",
            "items": [],
            "status": "Issued",
            "customer": null,
            "customerName": "",
            "billTo": null,
            "shipTo": null,
            "isDeleted": false
        }
        $scope.newInvoice.date = new Date();
        $scope.newInvoice.date.toJSON();

        $scope.from = {
            "companyName": "XYZ",
            "streetAddress": "Somewhere",
            "city": "OfSomewhere",
            "zipCode": 79209,
            "phoneNumber": "5555-555-555-555"
        }

        $scope.selectedItem = null;

        $scope.listExists = false;
        $scope.isInList = false;
        $scope.itemList = [];
        $scope.purchasedQuantity = [];

        $scope.billTo = false;
        $scope.shipTo = false;

        $scope.pushItemToInvoice = function (i) {
            $scope.newInvoice.items.push({
                description: $scope.itemList[i].description,
                quantity: $scope.purchasedQuantity[i],
                invoiceId: $scope.newInvoice.id,
                itemId: $scope.itemList[i].id,
                price: $scope.itemList[i].unitPrice
            })
        }

        $scope.createNewInvoice = function () {
            if ($scope.newInvoice.billTo === null ||
                $scope.newInvoice.shipTo === null ||
                $scope.newInvoice.customer === null ||
                $scope.itemList.length < 1) {
                notificationsConfig.error("All fields must be filled in.");
            }
            else {
                dataService.create("invoices", $scope.newInvoice, function (data) {
                    if (data) {
                        $scope.newInvoice.id = data;
                        for (var i = 0; i < $scope.itemList.length; i += 1) {
                            $scope.pushItemToInvoice(i);
                            dataService.create("invoiceitems", $scope.newInvoice.items[i], function (data) {
                                if (data) {
                                    for (var j = 0; j < $scope.newInvoice.length; j += 1) {
                                        for (var k = 0; i < $scope.itemList.length; k += 1)
                                            if ($scope.itemList[k].id === $scope.newInvoice[j].id) {
                                                $scope.itemList[k].quantity = $scope.itemList[k].quantity - $scope.newInvoice[j].quantity
                                                dataService.update("items", $scope.itemList[i].id, $scope.itemList[i], function (data) {
                                                    if (data) {
                                                    }
                                                    else
                                                        notificationsConfig.error("Error updating item quantity!");
                                                })
                                            }
                                    }
                                }
                                else
                                    notificationsConfig.error("Error!");
                            })
                        }
                        notificationsConfig.success("Invoice successfully created");
                    }
                    else
                        notificationsConfig.error("Error in invoice!");
                })
            }
        }


        $scope.loadItemsInfo = function () {
            dataService.list("items", function (data) {
                if (data) {
                    $scope.items = data;
                }
                else {
                    notificationsConfig.error("Error!");
                }
            })
        };

        $scope.loadCustomersInfo = function () {
            dataService.list("customers", function (data) {
                if (data) {
                    //console.log(data);
                    $scope.customers = data;
                }
                else {
                    notificationsConfig.error("Error!");
                }
            })
        }

        $scope.getCustomerID = function (customer) {
            $scope.newInvoice.customer = customer.id;
        }

        $scope.switchBillTo = function () {
            $scope.billTo = true;
            $scope.shipTo = false;
        };

        $scope.switchShipTo = function () {
            $scope.billTo = false;
            $scope.shipTo = true;
        };

        $scope.customerTransferBillTo = function (customer) {
            $scope.newInvoice.billTo = customer;
        };
        $scope.customerTransferShipTo = function (customer) {
            $scope.newInvoice.shipTo = customer;
        };

        $scope.pushToItemList = function () {
            if ($scope.selectedItem === null) return;
            if (!$scope.listExists)
                $scope.listExists = true;
            for (var i = 0; i < $scope.itemList.length; i += 1)
                if ($scope.selectedItem === $scope.itemList[i]){
                    $scope.isInList = true;
                    $scope.purchasedQuantity[i] += 1;
                }
            if (!$scope.isInList) {
                if ($scope.selectedItem !== null) {
                    $scope.itemList.push($scope.selectedItem);
                    $scope.purchasedQuantity.push(1);
                }
            }
            $scope.isInList = false;
            $scope.selectedItem = null;
            $scope.calculateFinal();
        }

        $scope.removeFromItemList = function (item) {
            for (var i = 0; i < $scope.itemList.length; i += 1)
                if (item === $scope.itemList[i])
                {
                    $scope.itemList.splice(i, 1);
                    $scope.purchasedQuantity.splice(i, 1);
                }
            if ($scope.itemList.length === 0)
                $scope.listExists = false;
            $scope.calculateFinal();
        }

        $scope.calculateFinal = function () {

            $scope.subTotal = 0;
            $scope.total = 0;
            $scope.taxRate = 0.17;
            $scope.tax = 0;
            for (var i = 0; i < $scope.itemList.length; i+=1)
                $scope.subTotal = $scope.subTotal + $scope.purchasedQuantity[i] * $scope.itemList[i].unitPrice;
            $scope.tax = $scope.subTotal * $scope.taxRate;
            $scope.total = $scope.subTotal + $scope.tax;
        }

        $scope.loadItemsInfo();
        $scope.loadCustomersInfo();
    });
}());