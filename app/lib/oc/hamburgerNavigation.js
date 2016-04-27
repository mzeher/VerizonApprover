angular.module('OrderCloud-HamburgerNavigation', []);

angular.module('OrderCloud-HamburgerNavigation')
    .directive('hamburgernavigation', hamburgernavigation)
    .directive('hamburgernavcategorytree', hamburgernavcategorytree)
    .directive('hamburgernavnode', hamburgernavnode)
    .directive('categorytree', categorytree)
    .directive('node', node)
    .controller('HamburgerNavigationCtrl', HamburgerNavigationCtrl)
;

function hamburgernavigation() {
    var directive = {
        restrict: 'E',
        template: template,
        controller: 'HamburgerNavigationCtrl'
    };
    return directive;

    function template() {
        return [
            '<style>',
            //color changes start
            '.navbar-hamburger .main-toggle i {color:#fff;}',
            'ul.burgers {margin:0; width:100%;}',
            //color changes end
            'accountnavigation {display:none !important;}',
            '.navbar { border:0; }',
            '.navbar-hamburger .main-toggle i {font-size:1.8em; left:10px; position:relative; top:10px;}',
            '.navbar.navbar-hamburger, .navbar.navbar-categories, .navbar.navbar-account, .navbar.navbar-all, .navbar.navbar-orders {min-height:40px; max-height:40px; padding-bottom:10px;}',
            'ul.burgers li {width:100%;}',
            'ul.burgers li a {padding: 0.5em 0.75em; width:100%; height:auto; line-height:auto;}',
            'ul.burgers li a:hover {text-decoration:none;}',
            'ul.burgers li a i {font-size:1.2em; min-width:25px;}',
            'ul.categories, ul.account, ul.subcategories, ul.orders {position:relative; top:0; z-index:1010;}',
            'ul.categories li, ul.account li, ul-subcategories li, ul.orders li {width:100%;}',
            'ul.categories li a, ul.account li a, ul-subcategories li a, ul.orders li a {padding:0.5em 0.75em; width:100%;}',
            'ul.subcategories li ul li a {padding:0.5em 1.25em; width:100%;}',
            'ul.categories li ul li a, ul.account li a, ul.subcategories li a, ul.orders li a {color:#fff; font-size:95%; text-indent:5px;}',
            'ul.categories a:hover, ul.account a:hover, ul.subcategories a:hover, ul.orders a:hover {text-decoration:none; background-color:#A80309;}',
            '#categories a:hover, #account a:hover, #orders a:hover, .help a:hover, .logout a:hover {background-color:#A80309;}',
            'ul.burgers .badge {margin-left:3px;}',
            '</style>',
            '<header class="header navbar navbar-inner hidden-sm hidden-md hidden-lg">',
            '<nav class="navbar navbar-default navbar-hamburger" role="navigation">',
            '<div>',
            '<a class="main-toggle" ng-click="isCollapsed = !isCollapsed" ng-class="{\'active\': !isCollapsed, \'\': isCollapsed}">',
            '<i class="fa fa-th-list" ng-show="isCollapsed"></i>',
            '<i class="fa fa-th" ng-show="!isCollapsed"></i>',
            '</a>',
            '</div>',
            '</nav>',
            '<div class="container">',
            '<div class="col-xs-12 col-collapse" collapse="isCollapsed">',
            '<ul class="navbar-nav navbar-default burgers">',
            //home
            '<li ng-class="{\'active\': isActive([\'orders\'])}">',
            '<a ng-click="retarget(\'orders\')">',
            '<i class="fa fa-clipboard"></i>',
            '<span>{{\'Home\' | r}}</span>',
            '</a>',
            '</li>',
            //account
            '<li id="account">',
            '<nav class="navbar-account" role="navigation" ng-show="user.Type == \'Customer\'">',
            '<div>',
            '<a ng-click="isCollapsedAccount = !isCollapsedAccount">',
            '<i class="fa fa-cog" ng-show="isCollapsedAccount"></i>',
            '<i class="fa fa-cogs" ng-show="!isCollapsedAccount"></i>',
            '<span>{{\'Account\' | r}}</span>',
            '</a>',
            '</div>',
            '</nav>',
            '<div class="col-xs-12 col-collapse" collapse="isCollapsedAccount">',
            '<ul class="navbar-nav account">',
            '<li ng-show="user.Type == \'Customer\' && user.Permissions.contains(\'ViewSelfAdmin\')">',
            '<a ng-click="retarget(\'admin\')">',
            '<i class="fa fa-user"></i>',
            '{{\'Profile\' | r}}',
            '</a>',
            '</li>',
            '</ul>',
            '</div>',
            '</li>',
            //logout
            '<li class="logout" ng-if="user.Type ==\'Customer\'">',
            '<a href="#" class="451_btn_logout" ng-click="Logout()">',
            '<i class="fa fa-sign-out"></i>',
            '<span>{{\'Log Out\' | r}}</span>',
            '</a>',
            '</li>',
            '</ul>',
            '</div>',
            '</div>',
            '</header>'
        ].join('');
    }
}

function hamburgernavcategorytree() {
    var directive = {
        restrict: 'E',
        replace: true,
        template: template,
        controller: 'HamburgerNavigationCtrl',
        scope: {
            tree: '=',
            current: '='
        }
    };
    return directive;

    function template() {
        return [
            '<ul class="subcategories">',
            '<hamburgernavnode class="nav" ng-repeat="node in tree" node="node" current="current"></hamburgernavnode>',
            '</ul>'
        ].join('');
    }
}

function hamburgernavnode() {
    var directive = {
        restrict: 'E',
        replace: true,
        template: template,
        controller: 'HamburgerNavigationCtrl',
        scope: {
            node: '=',
            current: '='
        }
    };
    return directive;

    function template() {
        return [
            '<li ng-class="{\'active\':  current.InteropID == node.InteropID}">',
            '<nav class="navbar-default navbar-{{node.InteropID}}" role="navigation">',
            '<div ng-init="isCollapsedSubCategory = true">',
            '<a ng-show="node.SubCategories" ng-click="isCollapsedSubCategory = !isCollapsedSubCategory">',
            '<i class="fa fa-plus-square" ng-show="isCollapsedSubCategory"></i>',
            '<i class="fa fa-minus-square" ng-show="!isCollapsedSubCategory"></i>',
            '<span>{{node.Name}}</span>',
            '</a>',
            '<a ng-hide="node.SubCategories" ng-click="retarget(\'catalog/{{node.InteropID}}\')" ng-bind-html="node.Name"></a>',
            '</div>',
            '</nav>',
            '<div class="col-xs-12 col-collapse" collapse="isCollapsedSubCategory">',
            '<ul class="navbar-nav">',
            '<categorytree tree=\'node.SubCategories\' current=\'current\'/>',
            '</ul>',
            '</div>',
            '</li>'
        ].join('');
    }
}

function categorytree() {
    var directive = {
        restrict: 'E',
        replace: true,
        template: template,
        controller: 'HamburgerNavigationCtrl',
        scope: {
            tree: '=',
            current: '='
        }
    };
    return directive;

    function template() {
        return [
            '<ul>',
            '<node class="nav" ng-repeat="node in tree" node="node" current="current"></node>',
            '</ul>'
        ].join('');
    }
}

node.$inject = ['$compile'];
function node($compile) {
    var directive = {
        restrict: 'E',
        replace: true,
        template: template,
        controller: 'HamburgerNavigationCtrl',
        scope: {
            node: '=',
            current: '='
        },
        link: function(scope, element) {
            if (angular.isArray(scope.node.SubCategories)) {
                element.append("<categorytree tree='node.SubCategories' current='current'/>");
                $compile(element.contents())(scope);
            }
        }
    };
    return directive;

    function template() {
        return [
            '<li class="451_cat_item">',
            '<a ng-click="retarget(\'catalog/{{node.InteropID}}\')" ng-bind-html="node.Name"></a>',
            '</li>'
        ].join('');
    }
}

HamburgerNavigationCtrl.$inject = ['$location', '$scope', '$rootScope'];
function HamburgerNavigationCtrl($location, $scope, $rootScope) {

    $scope.isCollapsed = true;
    $scope.isCollapsedCategory = true;
    $scope.isCollapsedSubCategory = true;
    $scope.isCollapsedAccount = true;
    $scope.isCollapsedOrders = true;

    $scope.retarget = function(url) {
        $scope.target = url;
        $location.path($scope.target);
        $rootScope.$broadcast('clicked');
    };

    $scope.$on('clicked', function() {
        $scope.isCollapsedCategory = true;
        $scope.isCollapsedSubCategory = true;
        $scope.isCollapsed = true;
        $scope.isCollapsedAccount = true;
        $scope.isCollapsedOrders = true;
    });
}