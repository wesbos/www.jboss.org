---
interpolate: true
---

var dcp = angular.module('dcp', []);

dcp.service('materialService',function($http, $q) {

  var query = {
    "field"  : ["sys_author", "contributors", "duration", "github_repo_url", "level", "sys_contributors",  "sys_created", "sys_description", "sys_title", "sys_url_view", "thumbnail", "sys_type", "sys_rating_num", "sys_rating_avg", "experimental"], "query" : "developer AND sys_type:(jbossdeveloper_bom jbossdeveloper_quickstart jbossdeveloper_archetype video rht_knowledgebase_article rht_knowledgebase_solution jbossdeveloper_example)",
    "size" : 500,
    // "query" : searchTerms,
    "content_provider" : ["jboss-developer", "rht"]
  };

  this.getMaterials = function() {
    var deferred = $q.defer();
    $http.get(app.dcp.url.search, { params : query }).success(function(data){
      deferred.resolve(data);
    });
    return deferred.promise;
  }

});

/*
  Filter to determine which thumbnail to return
*/
dcp.filter('thumbnailURL',function(){
  return function(item) {
    var thumbnails = {
      // jboss
      "jbossdeveloper_quickstart" : "#{cdn( site.base_url + '/images/design/get-started/jbossdeveloper_quickstart.png')}",
      "jbossdeveloper_archetype" : "#{cdn( site.base_url + '/images/design/get-started/jbossdeveloper_archetype.png')}",
      "jbossdeveloper_bom" : "#{cdn( site.base_url + '/images/design/get-started/jbossdeveloper_bom.png')}",
      // futurerproof for when jboss goes unprefixed
      "quickstart" : "#{cdn( site.base_url + '/images/design/get-started/jbossdeveloper_quickstart.png')}",
      "archetype" : "#{cdn( site.base_url + '/images/design/get-started/jbossdeveloper_archetype.png')}",
      "bom" : "#{cdn( site.base_url + '/images/design/get-started/jbossdeveloper_bom.png')}",
      "demo" : "#{cdn( site.base_url + '/images/design/get-started/jbossdeveloper_demo.png')}",
      // redhat
      "solution" : "#{cdn( site.base_url + '/images/design/get-started/solution.png')}",
      "article" : "#{cdn( site.base_url + '/images/design/get-started/article.png')}"
    };
    if(item.fields.thumbnail) {
      return item.fields.thumbnail;
    }
    else {
      return thumbnails[item._type];
    }
  }

});

/*
  Filter to return whether or not an item is premium
*/
dcp.filter('isPremium',function() {
  return function(url) {
    return !!url.match("access.redhat.com");
  }
});

/*
  Filter to format time
*/
dcp.filter('HHMMSS',function() {
  return function(seconds) {
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    var time    = minutes+':'+seconds;
    // only show hours if there are some
    if(parseInt(hours) > 0) {
      time = hours+':'+ time;
    }
    return time;
  }
});

/*
  Filter to return human readable time ago
*/
dcp.filter('timeAgo',function() {
  return function(timestamp){
    var date = new Date(timestamp);
    return $.timeago(date);
  }
});

/*
  Filter to trim whitespace
*/
dcp.filter('trim',function() {
  return function(str){
    return str.trim();
  }
});

/*
  Pagination Directive
*/

dcp.directive('pagination',function() {
  return {
    restrict : 'E',
    compile: function(element, attrs){
      element.replaceWith("Testing testing 123");
    }
  }
});

dcp.controller('developerMaterialsController', function($scope, materialService) {

  window.scope = $scope;
  $scope.data = {};
  $scope.filters = {};
  $scope.pagination = {
    size : 9
  };

  /*
    Get latest materials on page load
  */
  materialService.getMaterials().then(function(data){
    $scope.data.materials = data.hits.hits;
    // $scope.data.displayedMaterials = $scope.data.materials.slice(0,$scope.pagination.size);
    $scope.paginate(1);
  });

  /*
    Handle Pagination
  */
  $scope.paginate = function(page) {
    var startAt = (page * $scope.pagination.size) - $scope.pagination.size;
    var endAt = page * $scope.pagination.size;
    var pages = Math.ceil($scope.data.materials.length / $scope.pagination.size);

    // do nothing if we have no more pages
    if(page > pages || page < 1 || typeof page === "string") {
      return;
    }

    $scope.paginate.pages = pages;
    // $scope.paginate.pagesArray = new Array(pages);
    $scope.paginate.currentPage = page;

    // $scope.data.displayedMaterials = [];
    $scope.data.displayedMaterials = $scope.data.materials.slice(startAt,endAt);

    // pagination display logic
    $scope.paginate.pagesArray = app.utils.diplayPagination($scope.paginate.currentPage, pages, 4);
    console.log($scope.paginate.pagesArray);
  }

  /*
    Handle Filters
  */
  $scope.filters = {};
  $scope.data.availableTopics = #{site.dev_mat_techs.flatten.uniq.sort};

  $scope.data.availableFormats = [
    { value : "jbossdeveloper_quickstart" , "name" : "Quickstart" },
    { value : "video" , "name" : "Video" },
    { value : "demo" , "name" : "Demo" },
    { value : "jbossdeveloper_example" , "name" : "Tutorial" },
    { value : "jbossdeveloper_archetype" , "name" : "Archetype" },
    { value : "jbossdeveloper_bom" , "name" : "BOM" },
    { value : "jbossdeveloper_sandbox" , "name" : "Early Access" },
    { value : "article" , "name" : "Articles (Premium)" },
    { value : "solution" , "name" : "Solutions (Premium)" }
  ];

  $scope.filters.sys_tags = [];
  $scope.filters.sys_type = [];
  $scope.filters.toggleSelection = function toggleSelection(itemName, selectedArray) {
      var idx = $scope.filters[selectedArray].indexOf(itemName);

      // is currently selected
      if (idx > -1) {
        $scope.filters[selectedArray].splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.filters[selectedArray].push(itemName);
      }
  };

  /*
    Update skill level when the range input changes
  */
  $scope.filters.updateSkillLevel = function() {
    var n = parseInt($scope.data.skillNumber);
    var labels = ["All", "Beginner", "Intermediate", "Advanced"];
    $scope.data.displaySkill = labels[n];
    switch (n) {
      case 0 :
        delete $scope.filters.level;
        break;
      case 1 :
        $scope.filters.level = "Beginner";
        break;
      case 2 :
        $scope.filters.level = "Intermediate";
        break;
      case 3 :
        $scope.filters.level = "Advanced";
        break;
    }
  }

  /*
    Update date when the range input changes
  */
  $scope.filters.updateDate = function() {
    var n = parseInt($scope.data.dateNumber);
    var d = new Date();
    var labels = ["All", "Within 1 Year", "Within 30 days", "Within 7 days", "Within 24hrs"];
    $scope.data.displayDate = labels[n];

    switch(n) {
      case 0 :
        delete $scope.filters.sys_created;
        break;
      case 1 :
        //Within 1 Year
        d.setFullYear(d.getFullYear() - 1);
        break;
      case 2 :
        //Within 30 days
        d.setDate(d.getDate() - 30);
        break;
      case 3 :
        //Within 7 days
        d.setDate(d.getDate() - 7);
        break;
      case 4 :
        //Within 24 hours
        d.setDate(d.getDate() - 1);
        break;
    }

    if(n) {
      $scope.filters.sys_created = ">=" + d.getDate() + "-" + ( d.getMonth() + 1 ) + "-" + d.getFullYear();
    }
  }

  $scope.filters.clear = function() {
    $scope.filters.sys_tags = [];
    $scope.filters.sys_type = [];
    delete $scope.filters.query;
    delete $scope.filters.sys_rating_avg;
    delete $scope.filters.level;
    delete $scope.filters.sys_created;
  }


  $scope.filters.createString = function() {
    var searchTerms = [];

    if($scope.filters.query){
      searchTerms.push($scope.filters.query);
    }

    if($scope.filters.sys_rating_avg) {
      searchTerms.push("sys_rating_avg:>="+$scope.filters.sys_rating_avg);
    }

    if($scope.filters.sys_tags){
      for (var i = 0; i < $scope.filters.sys_tags.length; i++) {
        searchTerms.push("sys_tags:(\""+$scope.filters.sys_tags[i]+"\")");
      };
    }

    if($scope.filters.sys_type){
      for (var i = 0; i < $scope.filters.sys_type.length; i++) {
        searchTerms.push("sys_type:("+$scope.filters.sys_type[i]+")");
      };
    }

    if($scope.filters.level){
      searchTerms.push("level:"+$scope.filters.level);
    }

    if($scope.filters.sys_created){
      searchTerms.push("sys_created:"+$scope.filters.sys_created);
    }

    searchTerms = searchTerms.join(" AND ");
    searchTerms = searchTerms.replace(/\s/gi,'+');
    return searchTerms;
  }

});
