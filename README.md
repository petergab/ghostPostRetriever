![Version](https://img.shields.io/badge/Version-0.1-brightgreen.svg)
![GhostVersion](https://img.shields.io/badge/GhostVersion-0.11.7-red.svg)
![LastUpdate](https://img.shields.io/eclipse-marketplace/last-update/:name.svg)

# ghostPostRetriever
A Ghost blog js posts retrieve engine


**Original developer:** [skyweb.piotr.gabara@gmail.com](mailto:skyweb.piotr.gabara@gmail.com)

ghostPostRetriever is a Javascript engine for retrieving posts using [Ghost API](https://api.ghost.org/v0.1/docs).

## Basic setup

```txt
  git clone https://github.com/petergab/ghostPostRetriever.git --recursive
```

After cloning, the ghostPostRetriever module will be located at `ghostPostRetriever/jquery.ghostPostRetriever.js`. Remember to minify it for production use.

To test the module in your template, add the following line, after JQuery is loaded. Typically this will be near the bottom of a file `default.hbs`, in the top folder of the theme directory.

````html
<script type="text/javascript" src="{{asset "js/ghostPostRetriever/jquery.ghostPostRetriever.js"}}"></script>
````

You will need to add a container for filtered posts with the specified id to your pages.

````html
<section id="posts-container"></section>
````

Implement ghostPostRetriever with a block of JQuery code.

````html
  <script>
    $("#posts-container").ghostPostRetriever();
  </script>
````


### GhostPostRetriever options

GhostPostRetriever offers a set of options when the plugin is invoked.

:arrow_right: **postTemplate**
> A simple Handlebars template used to render retrieved posts. The template uses variable substitution only. Helpers and conditional insertion constructs are ignored and will be rendered verbatim.
>
> Default template is just simple <code><a href='{{link}}'>{{title}}</a></code>

:arrow_right: **tagTemplate**
> A Handlebars template used to display Tags (if included in getAdditionalPostOptions).
>
> Default template is <code><a href="/tag/{{slug}}">{{name}}</a></code>

:arrow_right: **authorTemplate**
> A Handlebars template used to display Authors (if included in getAdditionalPostOptions).
>
> Default template is <code><a href="/tag/{{slug}}">{{name}}</a></code>

:arrow_right: **paginationContainerTemplate**
> A Handlebars template used to display pagination.
>
> Default template is <code><div class="extra-pagination inner">
  <nav class="pagination">
    {{prevTemplate}}
    <span>Page {{page}} of {{pages}}</span>
    {{nextTemplate}}
  </nav>
</div></code>

:arrow_right: **paginationPrevTemplate**
> A Handlebars template used to display link for previous page in pagination template.
>
> Default template is <code><a href="{{urlPrev}}">&larr; Newer Posts</a></code>

:arrow_right: **paginationNextTemplate**
> A Handlebars template used to display link for next page in pagination template.
>
> Default template is <code><a href="{{urlNext}}">Older Posts &rarr;</a></code>

