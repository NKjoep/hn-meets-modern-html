function display30Items(itemsArray) {

  var templateEl = document.querySelectorAll('template')[0];
  var template = templateEl.innerHTML;
  Mustache.parse(template);

  var renderedArticles = '';

  var items = itemsArray.slice(0, 30);
  for (var index = 0; index < items.length; index++) {
    var article = items[index];
    article.position = index + 1;
    var rendered = Mustache.render(template, article);
    renderedArticles = renderedArticles + '\n' + rendered;
  }

  templateEl.insertAdjacentHTML( 'afterEnd', renderedArticles);
}

function fetchHomepage() {
  var script = document.createElement('script');
  script.type = 'application/javascript';
  script.src = 'https://node-hnapi.herokuapp.com/news?page=1&callback=display30Items';
  document.head.appendChild(script);
}

function fetchItemData() {
  var q = document.location.href.split('?')[1];
  var id = /id=(\d+)/ig.exec(q)[1];
  var script = document.createElement('script');
  script.src = 'https://node-hnapi.herokuapp.com/item/' + id + '?callback=renderItem';
  document.head.appendChild(script);
}

function toggleComment({
  event,
  id,
  commentsCount
}) {
  event.preventDefault();
  var $blockquote = document.querySelector('[data-blockquote-id="' + id + '"]');
  var $comments = document.querySelector('[data-comments-id="' + id + '"]');

  var functionToggle = function ($el) {
    var displayValue = window.getComputedStyle($el).display;
    if (displayValue !== 'none') {
      $el.setAttribute('data-comment-display', displayValue);
      $el.style.display = 'none';
      return;
    }
    displayValue = $el.getAttribute('data-comment-display');
    $el.style.display = displayValue;
  }

  // toggle elements
  functionToggle($blockquote);
  functionToggle($comments);

  // toggle toggler text
  var $toggler = document.querySelector('[data-toggler-id="' + id + '"]');
  var collapseString = '"[-]"';
  var attributeName = '--text';
  var t = window.getComputedStyle($toggler).getPropertyValue(attributeName).trim();
  if (t === collapseString) {
    $toggler.style.setProperty(attributeName, `"[+${commentsCount+1}]"`);
  } else {
    $toggler.style.setProperty(attributeName, collapseString);
  }
}


function renderItem(article) {
  console.log('render', article);

  var templateEl = document.querySelector('template');
  var template = templateEl.innerHTML.replace(/\{\{&gt;/g, '{{>');

  var templateComments = document.body.querySelector('template[data-mustache="partial_comments"]').innerHTML.replace(/\{\{&gt;/g, '{{>');

  Mustache.parse(template);

  var rendered = Mustache.render(template, article, {
    partial_comments: templateComments
  });

  templateEl.insertAdjacentHTML('afterEnd', rendered);

  document.title = article.title + ' | ' + document.title;
}
