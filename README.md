![Version](https://img.shields.io/badge/Version-1.0-brightgreen.svg)
![GhostVersion](https://img.shields.io/badge/GhostVersion-0.11.7-red.svg)

# ghostPostRetriever
A Ghost blog's posts retrieve engine. Shows posts with pagination. Optionally pages are switched without reloading and with keeping the browser history.


**Original developer:** [skyweb.piotr.gabara@gmail.com](mailto:skyweb.piotr.gabara@gmail.com)

ghostPostRetriever is a Javascript engine for retrieving posts using [Ghost API](https://api.ghost.org/v0.1/docs).

## Basic setup

```txt
git clone https://github.com/petergab/ghostPostRetriever.git --recursive
```

After cloning, the ghostPostRetriever module will be located at `ghostPostRetriever/jquery.ghostPostRetriever.js`. Remember to minify it for production use.

To test the module in your template, add the following line, after JQuery is loaded. Typically this will be near the bottom of a file `default.hbs`, in the top folder of the theme directory.

```html
<script type="text/javascript" src="{{asset "js/ghostPostRetriever/jquery.ghostPostRetriever.js"}}"></script>
```

You will need to add a container for filtered posts with the specified id to your pages.

```html
<section id="posts-container"></section>
```

Implement ghostPostRetriever with a block of JQuery code.

```html
<script type="text/javascript">
  $("#posts-container").ghostPostRetriever();
</script>
```


### GhostPostRetriever options

GhostPostRetriever offers a set of options when the plugin is invoked.

:arrow_right: **postTemplate**
> A simple Handlebars template used to render retrieved posts. The template uses variable substitution only. Helpers and conditional insertion constructs are ignored and will be rendered verbatim.
>
> Default template is just simple:
```html
 <a href="{{link}}">{{title}}</a>
```

:arrow_right: **tagTemplate**
> A Handlebars template used to display Tags (if included in getAdditionalPostOptions).
>
> Default usage: Just put ``{{tagList}}`` somewhere in your template
>
> Default template is:
```html
<a href="/tag/{{slug}}">{{name}}</a>
```

:arrow_right: **authorTemplate**
> A Handlebars template used to display Authors (if included in getAdditionalPostOptions).
>
> Default usage: Just put ``{{authorViaTemplate}}`` somewhere in your template
>
> Default template is:
```html
<a href="/tag/{{slug}}">{{name}}</a>
```

:arrow_right: **paginationContainerTemplate**
> A Handlebars template used to display pagination.
>
> Default template is:
```html
<div class="extra-pagination inner">
  <nav class="pagination">
    {{prevTemplate}}
    <span>Page {{page}} of {{pages}}</span>
    {{nextTemplate}}
  </nav>
</div>
```

:arrow_right: **paginationPrevTemplate**
> A Handlebars template used to display link for previous page in pagination template.
>
> Default template is:
```html
<a href="{{urlPrev}}">&larr; Newer Posts</a>
```

:arrow_right: **paginationNextTemplate**
> A Handlebars template used to display link for next page in pagination template.
>
> Default template is:
```html
<a href="{{urlNext}}">Older Posts &rarr;</a>
```

:arrow_right: **paginationContainer**
> JQuery ID of the DOM object into which pagination container should be inserted. If not set the pagination container will be inserted at the end of the posts results.
>
> Default value is: ``false``

:arrow_right: **before**
> Use to optionally set a callback function that is executed before the list of results is displayed. The callback function takes no arguments.
>
> Default value is: ``false``
>
> Example:
```javascript
$("#posts-container").ghostPostRetriever({
  before: function() {
    alert("Posts are about to be rendered");
  }
});
```

:arrow_right: **onComplete**
> Use to optionally set a callback function that is executed after the list of results is displayed. The callback function takes no arguments.
>
> Default value is: ``false``

:arrow_right: **page**
> The page number that you'd like to display
>
> Default value is: ``1``

:arrow_right: **postsLimit**
> The posts limit on single page
>
> Default value is: ``6``

:arrow_right: **toLocaleDateStringLocale**
> A string with a BCP 47 language tag, or an array of such strings used in [The toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) method to show publication date.
>
> Default value is: ``'en-US'``
>
> Default usage: Just put ``{{prettyPubDate}}`` somewhere in your template instead of ``published_at``

:arrow_right: **toLocaleDateStringOptions**
> An object with additional properties used in [The toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) method.
>
> Default value is:
```javascript
{
  year: 'numeric',
  month: 'long',
  day: '2-digit'
}
```

:arrow_right: **getAdditionalPostOptions**
> You can make your API queries more selective using a range of parameters described in the [TGhost API documentation](https://api.ghost.org/docs/parameters).
>
> Default value is: ``{}``
>
> Example
```javascript
{
  include: 'author, tags',
  filter: 'tags:[your-tag]'
}
```

:arrow_right: **exerptLimit**
> If you'd like to present only sneak peak of your post you can set the number of letters to take from the html value
>
> Default value is: ``200``
>
> Default usage: Just put ``{{exerpt}}`` somewhere in your template

:arrow_right: **zeroResultsInfo**
> Information to be shown when there are no posts to be shown (also the pagination container is not presented)
>
> Default value is: ``'There are no posts that meet specified criteria.'``
