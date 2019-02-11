/**
* ghostPostRetriever - 0.1.1
 * for Ghost Version: 0.11.7
 * Copyright (C) 2019 Piotr Gabara (skyweb.piotr.gabara@gmail.com)
 * MIT Licensed
 * @license
*/
(function( $ ) {

  $.fn.ghostPostRetriever = function(options) {
    var opts = $.extend({}, $.fn.ghostPostRetriever.defaults, options);
    pluginMethods.init(this, opts);
    return pluginMethods;
  };

  $.fn.ghostPostRetriever.defaults = {
    postTemplate: "<a href='{{link}}'>{{title}}</a>",
    tagTemplate: '<a href="/tag/\{\{slug\}\}">\{\{name\}\}</a>',
    authorTemplate: '<a href="/author/\{\{slug\}\}">\{\{name\}\}</a>',
    paginationContainerTemplate: '\
      <div class="extra-pagination inner">\
        <nav class="pagination">\
          {{prevTemplate}}\
          <span>Page {{page}} of {{pages}}</span>\
          {{nextTemplate}}\
        </nav>\
      </div>\
    ',
    paginationPrevTemplate: '<a target="_self" href="{{urlPrev}}">&larr; Newer Posts</a>',
    paginationNextTemplate: '<a target="_self" href="{{urlNext}}">Older Posts &rarr;</a>',
    paginationContainer: false,
    before: false,
    onComplete: false,
    page: 1,
    postsLimit: 6,
    toLocaleDateStringLocale: 'en-US',
    toLocaleDateStringOptions: {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    },
    getAdditionalPostOptions: {},
    exerptLimit: 200,
    zeroResultsInfo: 'There are no posts that meet specified criteria.'
  };

  var pluginMethods = {

    init: function(target, opts) {
      this.target = target;
      this.postTemplate = opts.postTemplate;
      this.tagTemplate = opts.tagTemplate;
      this.authorTemplate = opts.authorTemplate;
      this.paginationContainerTemplate = opts.paginationContainerTemplate;
      this.paginationPrevTemplate = opts.paginationPrevTemplate;
      this.paginationNextTemplate = opts.paginationNextTemplate;
      this.paginationContainer = opts.paginationContainer;
      this.before = opts.before;
      this.onComplete = opts.onComplete;
      this.page = opts.page;
      this.postsLimit = opts.postsLimit;
      this.toLocaleDateStringLocale = opts.toLocaleDateStringLocale;
      this.toLocaleDateStringOptions = opts.toLocaleDateStringOptions;
      this.getAdditionalPostOptions = opts.getAdditionalPostOptions;
      this.exerptLimit = opts.exerptLimit;
      this.zeroResultsInfo = opts.zeroResultsInfo;

      this.printPosts();
    },

    printPosts: function() {
      this.clear();

      if (this.before) {
        this.before();
      };

      var getPostOptionsDefault = {
        limit: this.postsLimit,
        page: parseInt(this.page) || 1
      };
      var getPostOptions = $.extend({}, getPostOptionsDefault, this.getAdditionalPostOptions);

      $.get(ghost.url.api('posts', getPostOptions)).done(function (data) {
        var resultsData = '';

        data.posts.forEach(function(post) {
          post.exerpt = this.createExcerpt(post.html);
          post.prettyPubDate = this.prettyDate(post.published_at);
          if (post.author) {
            post.authorViaTemplate = this.format(this.authorTemplate, post.author);
          }
          if (post.tags) {
            var tagArr = post.tags.map(function(t) {
              return (t.visibility == 'public' ? this.format(this.tagTemplate, t) : '');
            }.bind(this))
            var tagList = (tagArr.length > 0 ? tagArr.filter(Boolean).join(', ') : '');
            post.tagList = tagList;
          }
          var html = this.format(this.postTemplate, post);
          resultsData += html;
        }.bind(this));

        var pagination = data.meta.pagination;
        if (pagination.total > 0) {
          pagination.urlPrev = (pagination.prev ? window.location.pathname + '?page=' + pagination.prev : '');
          pagination.urlNext = (pagination.next ? window.location.pathname + '?page=' + pagination.next : '');
          pagination.prevTemplate = (pagination.urlPrev ? this.format(this.paginationPrevTemplate, pagination) : '');
          pagination.nextTemplate = (pagination.urlNext ? this.format(this.paginationNextTemplate, pagination) : '');

          if (this.paginationContainer) {
            $(this.paginationContainer).html(this.format(this.paginationContainerTemplate, pagination));
          } else {
            resultsData += this.format(this.paginationContainerTemplate, pagination);
          }
        } else {
          resultsData = this.zeroResultsInfo;
        }

        $(this.target).append(resultsData);

        if (this.onComplete) {
          this.onComplete();
        };
      }.bind(this)).fail(function(err) {
        console.log(err);
      });
    },

    clear: function() {
      $(this.target).empty();
    },

    prettyDate: function(date) {
      var d = new Date(date);
      return d.toLocaleDateString(this.toLocaleDateStringLocale, this.toLocaleDateStringOptions);
    },

    createExcerpt: function(text) {
      return text.replace(/<\/?[^>]+(>|$)/g, '').replace(/\n/, ' ').substring(0, this.exerptLimit) + '...';
    },

    format: function(template, data) {
      return template.replace(/{{([^{}]*)}}/g, function (a, b) {
        var r = data[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      });
    }
  };

})( jQuery );
