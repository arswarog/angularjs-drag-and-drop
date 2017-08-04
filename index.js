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
        console.log(id);
        el.bind("dragstart", function (e) {
          let data = JSON.stringify(scope.draggable);
          e.dataTransfer.setData('object', data);
          $rootScope.$emit("DRAG-START");
          console.log('DRAG-START');
        });

        el.bind("dragend", function (e) {
          console.log('DRAG-END');
          $rootScope.$emit("DRAG-END");
        });
      }
    };
  }])
  .directive('dropTarget', ['$rootScope', function ($rootScope) {
    return {
      // priority: 1001,
      restrict: 'A',
      scope: {
        dropTarget: '&'
      },
      link: function (scope, el, attrs, controller) {
        console.log('link');
        var id = angular.element(el).attr("id");
        if (!id) {
          id = Math.random().toString(36).replace(/[^a-z]+/g, '');
          angular.element(el).attr("id", id);
        }

        el.bind("dragover", function (e) {
          // console.log('dragover', e)
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
          return false;
        });

        el.bind("dragenter", function (e) {
          console.log("dragenter", e.dataTransfer.getData("object"));
          angular.element(this).addClass('draganddrop-over');
        });

        el.bind("dragleave", function (e) {
          angular.element(this).removeClass('draganddrop-over');  // this / e.target is previous target element.
        });

        el.bind("drop", function (e) {
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          if (e.stopPropagation) {
            e.stopPropagation(); // Necessary. Allows us to drop.
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