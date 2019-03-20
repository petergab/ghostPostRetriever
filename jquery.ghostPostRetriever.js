/*global jQuery, ghost*/
/*eslint max-statements: ["error", 25]*/
/*eslint no-use-before-define: ["error", { "variables": false }]*/

/**
* ghostPostRetriever - 1.1.3
 * for Ghost Version: 0.11.7
 * Copyright (C) 2019 Piotr Gabara (skyweb.piotr.gabara@gmail.com)
 * https://github.com/petergab/ghostPostRetriever
 * MIT Licensed
 * @license
*/
(function($) {

  $.fn.ghostPostRetriever = function(options) {
    var opts = $.extend({}, $.fn.ghostPostRetriever.defaults, options);
    pluginMethods.init(this, opts);
    return pluginMethods;
  };

  $.fn.ghostPostRetriever.defaults = {
    postTemplate: '<a href="{{link}}">{{title}}</a>',
    tagTemplate: '<a href="/tag/{{slug}}">{{name}}</a>',
    authorTemplate: '<a href="/author/{{slug}}">{{name}}</a>',
    paginationContainerTemplate: '' +
      '<div class="extra-pagination inner">' +
        '<nav class="pagination">' +
          '{{prevTemplate}}' +
          '<span> Page {{page}} of {{pages}}</span> ' +
          '{{nextTemplate}}' +
        '</nav>' +
      '</div>',
    paginationPrevTemplate: '<a id="pagination-prev" href="{{urlPrev}}">&larr; Newer Posts</a>',
    paginationNextTemplate: '<a id="pagination-next" href="{{urlNext}}">Older Posts &rarr;</a>',
    paginationContainer: false,
    paginationShow: true,
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
    zeroResultsInfo: 'There are no posts that meet specified criteria.',
    clearTargetBeforeInserting: true
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
      this.paginationShow = opts.paginationShow;
      this.before = opts.before;
      this.onComplete = opts.onComplete;
      this.page = opts.page || 1;
      this.postsLimit = opts.postsLimit;
      this.toLocaleDateStringLocale = opts.toLocaleDateStringLocale;
      this.toLocaleDateStringOptions = opts.toLocaleDateStringOptions;
      this.exerptLimit = opts.exerptLimit;
      this.zeroResultsInfo = opts.zeroResultsInfo;
      this.clearTargetBeforeInserting = opts.clearTargetBeforeInserting;

      var getPostOptionsDefault = {
        limit: this.postsLimit,
        page: parseInt(this.page) || 1
      };
      this.getPostOptions = $.extend({}, getPostOptionsDefault, opts.getAdditionalPostOptions);
      this.setObservers();

      if (this.before) {
        this.before();
      }

      this.getAndShowPosts();
    },

    setObservers: function() {
      if (this.paginationShow) {
        var paginationWrapper;
        if (this.paginationContainer && this.paginationContainer.length > 0) {
          paginationWrapper = this.paginationContainer;
        } else {
          paginationWrapper = this.target;
        }
        // The observer is set on the paginationContainer if it exists, if not it is set on whole module target container
        $(paginationWrapper).on('click', '#pagination-prev, #pagination-next', this.paginationClick.bind(this));
      }

      window.onpopstate = function(event) {
        this.getPostOptions.page = ((event.state && event.state.page) ? event.state.page : 1);
        this.getAndShowPosts();
      }.bind(this);
    },

    paginationClick: function(e) {
      e.preventDefault();
      if (($(e.target).attr('id') === 'pagination-prev') && (parseInt(this.page) > 1)) {
        this.page = parseInt(this.page) - 1;
      }
      if (($(e.target).attr('id') === 'pagination-next') && (parseInt(this.page) > 0)) {
        this.page = parseInt(this.page) + 1;
      }
      this.getPostOptions.page = this.page;
      this.getAndShowPosts();
      window.history.pushState({page: this.page}, '', `${window.location.pathname}?page=${this.page}`);
      return false;
    },

    getAndShowPosts: function() {
      if (this.clearTargetBeforeInserting) {
        this.clear();
      }
      $.get(ghost.url.api('posts', this.getPostOptions)).done(function(data) {
        var resultHtml = '';

        data.posts.forEach(function(post) {
          if (post.html) {
            post.exerpt = this.createExcerpt(post.html);
          }
          if (post.published_at) {
            post.prettyPubDate = this.prettyDate(post.published_at);
          }
          if (post.author) {
            post.authorViaTemplate = this.format(this.authorTemplate, post.author);
          }
          if (post.tags) {
            var tagsArray = post.tags.map(function(t) {
              return (t.visibility === 'public' ? this.format(this.tagTemplate, t) : '');
            }.bind(this));
            post.tagList = (tagsArray.length > 0 ? tagsArray.filter(Boolean).join(', ') : '');
          }
          resultHtml += this.format(this.postTemplate, post);
        }.bind(this));

        var pagination = data.meta.pagination;
        if (pagination.total > 0) {
          if (this.paginationShow) {
            pagination.urlPrev = (pagination.prev ? window.location.pathname + '?page=' + pagination.prev : '');
            pagination.urlNext = (pagination.next ? window.location.pathname + '?page=' + pagination.next : '');
            pagination.prevTemplate = (pagination.urlPrev ? this.format(this.paginationPrevTemplate, pagination) : '');
            pagination.nextTemplate = (pagination.urlNext ? this.format(this.paginationNextTemplate, pagination) : '');

            if (this.paginationContainer) {
              $(this.paginationContainer).html(this.format(this.paginationContainerTemplate, pagination));
            } else {
              resultHtml += this.format(this.paginationContainerTemplate, pagination);
            }
          }
        } else {
          resultHtml = this.zeroResultsInfo;
        }

        $(this.target).append(resultHtml);

        if (this.onComplete) {
          this.onComplete();
        }
      }.bind(this)).fail(function(err) {
        $(this.target).append(`Error ${err} occured. Please try again.`);
      });
    },

    clear: function() {
      // Setting the container min-height so it doesn't jump on switching content
      $(this.target).css('min-height', `${$(this.target).height()}px`);
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
      return template.replace(/{{([^{}]*)}}/g, function(a, b) {
        var r = data[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      });
    }
  };

})( jQuery );
