/* ng-infinite-scroll - v1.0.0 - 2013-09-03 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled, scrollWatchTimer, watchScrollPosition, windowScrollPosition;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseFloat(value);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elemBottom, elemHeight, elemTop, remaining, shouldScroll, windowBottom, windowHeight, windowScrollTop;
          windowHeight = $window[0].document.documentElement.clientHeight;
          windowScrollTop = $window[0].pageYOffset;
          windowBottom = windowHeight + windowScrollTop;
          elemHeight = parseFloat(elem[0].ownerDocument.defaultView.getComputedStyle(elem[0], null)['height']);
          elemTop = elem[0].getBoundingClientRect().top + windowScrollTop - elem[0].ownerDocument.documentElement.clientTop;
          elemBottom = elemTop + elemHeight;
          remaining = elemBottom - windowBottom;
          shouldScroll = remaining <= windowHeight * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        scrollWatchTimer = null;
        windowScrollPosition = 0;
        watchScrollPosition = function() {
          if (windowScrollPosition !== $window[0].pageYOffset) {
            handler();
          }
          windowScrollPosition = $window[0].pageYOffset;
          if (typeof scrollWatchTimer === 'object') {
            $timeout.cancel(scrollWatchTimer);
          }
          return scrollWatchTimer = $timeout((function() {
            return watchScrollPosition();
          }), 250);
        };
        watchScrollPosition();
        return scope.$on('$destroy', function() {
          return $timeout.cancel(scrollWatchTimer);
        });
      }
    };
  }
]);
