four51.app.controller('ApprovalOrderSearchCtrl', ['$scope', '$location', 'OrderSearchCriteria', 'OrderSearch', 'Order', 'Address',
    function ($scope,  $location, OrderSearchCriteria, OrderSearch, Order, Address) {


        $scope.settings = {
            pageSize: 10, /*100*/
            currentPage: 1
        };

        $scope.changeStep = function(x){
            if (x != 2){
                window.scrollTo(0, 0);
            }
            else {
                var top = $scope.isDesktop() ? 0 : $('#linetop').offset().top - 50;
                window.scrollTo(0, top);
            }
            $scope.viewToggle = x;
            $scope.$broadcast('event:changeStep');
        };

        $scope.sortOptions = [
            {"Label":"Order ID","Value":"ExternalID"},
            {"Label":"Order Date","Value":"DateCreated"},
            {"Label":"Creator","Value":"FromUserName"},
            {"Label":"Order Total","Value":"Total"}
        ];

        $scope.reverse = false;

        function getOrdersAwaitingApproval() {
            var criteria = {Type: "Standard", Status: "AwaitingApproval", DisplayName: "Awaiting Approval", LastN: 0, OrderID: null};
            $scope.orderLoadingIndicator = true;
            OrderSearch.search(criteria, function(list, count) {
                $scope.orderLoadingIndicator = true;
                $scope.orders = list;
                $scope.settings.listCount = count;
                $scope.showNoResults = list.length == 0;
                $scope.orderLoadingIndicator = false;
            }, $scope.settings.currentPage, $scope.settings.pageSize);
        }

        if ($scope.user && $scope.user.Type == 'Customer') {
            getOrdersAwaitingApproval();
        }

        $scope.$watch('settings.currentPage', function() {
            if ($scope.settings && $scope.settings.currentPage) //
            getOrdersAwaitingApproval($scope.settings.currentPage);
        });


        $scope.viewOrder = function(order) {
            $scope.orderLoadingIndicator = true;
            $scope.orderMessage = null;
            $scope.ApprovalComment = "";
            Order.get(order.ID, function(ordr) {
                $scope.selectedOrder = ordr;
                $scope.orderLoadingIndicator = false;
                if (ordr.IsMultipleShip()) {
                    angular.forEach(ordr.LineItems, function(item) {
                        if (item.ShipAddressID) {
                            Address.get(item.ShipAddressID, function(add) {
                                item.ShipAddress = add;
                            });
                        }
                    });
                }
                else {
                    Address.get(ordr.ShipAddressID || ordr.LineItems[0].ShipAddressID, function(add) {
                        ordr.ShipAddress = add;
                    });
                }
                Address.get($scope.selectedOrder.BillAddressID, function(add){
                    $scope.selectedOrder.BillAddress = add;
                });
            });

        };

        $scope.viewLineItem = function(item) {
            $scope.LineItem = item;
        };

        $scope.$on('event:approvalComplete', function(event, type) {
            $scope.selectedOrder = null;
            $scope.settings.currentPage = 1;
            $scope.orderMessage = (type == 'approve') ? 'Order approved successfully' : 'Order declined successfully';
            getOrdersAwaitingApproval($scope.settings.currentPage);
        });

        $scope.isPhone = function(){
            var isPhoneResult = true;
            if($(window).width() > 767)
                isPhoneResult = false;
            return isPhoneResult;
        };

        $scope.isDesktop = function(){
            var isDesktopResult = false;
            if($(window).width()>=1200)
                isDesktopResult = true;
            return isDesktopResult;
        };

        $scope.backToOrderList = function() {
            $scope.viewToggle = 0;
        }
    }]);