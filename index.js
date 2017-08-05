/**
 * Created by arswarog on 04.08.17.
 */

export default angular.module("arswarog.draganddrop", [])
  .directive('draggable', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'A',
      scope: {
        draggable: '='
      },
      link: function (scope, el, attrs, controller) {
        angular.element(el).attr("draggable", "true");

        var id = angular.element(el).attr("id");

        if (!id) {
          id = Math.random().toString(36).replace(/[^a-z]+/g, '');
          angular.element(el).attr("id", id);
        }
        el.bind("dragstart", function (e) {
          if (!scope.draggable) {
            console.warn("Graggable parameter must be object or string but ", scope.draggable);
            return false;
          }
          let data = JSON.stringify(scope.draggable);
          e.dataTransfer.setData('object', data);
          $rootScope.$emit("DRAG-START");
        });

        el.bind("dragend", function (e) {
          $rootScope.$emit("DRAG-END");
        });
      }
    };
  }])
  .directive('dropTarget', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'A',
      scope: {
        dropTarget: '&'
      },
      link: function (scope, el, attrs, controller) {
        var id = angular.element(el).attr("id");
        if (!id) {
          id = Math.random().toString(36).replace(/[^a-z]+/g, '');
          angular.element(el).attr("id", id);
        }

        el.bind("dragover", function (e) {
          if (e.preventDefault) {
            e.preventDefault();
          }

          e.dataTransfer.dropEffect = 'move';
          return false;
        });

        el.bind("dragenter", function (e) {
          angular.element(this).addClass('draganddrop-over');
        });

        el.bind("dragleave", function (e) {
          angular.element(this).removeClass('draganddrop-over');
        });

        el.bind("drop", function (e) {
          if (e.preventDefault) {
            e.preventDefault();
          }

          if (e.stopPropagation) {
            e.stopPropagation();
          }

          if (!e.dataTransfer.getData("object")) {
            console.warn("Grag data not exists. Drop event canceled");
            return false;
          }

          var data = JSON.parse(e.dataTransfer.getData("object"));

          scope.dropTarget({data: data});
        });

        $rootScope.$on("DRAG-START", function () {
          var el = document.getElementById(id);
          angular.element(el).addClass("draganddrop-target");
        });

        $rootScope.$on("DRAG-END", function () {
          var el = document.getElementById(id);
          angular.element(el).removeClass("draganddrop-target");
          angular.element(el).removeClass("draganddrop-over");
        });
      }
    };
  }]).name;
