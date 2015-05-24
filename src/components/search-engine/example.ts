/// <reference path="../../typings/web.rx.d.ts" />
/// <reference path="../../typings/jquery.d.ts" />

function search(query) {
  if (!query)
    return Rx.Observable.return([]);

  return Rx.Observable.fromPromise(jQuery.ajax({
    dataType: "jsonp",
    url: "https://api.duckduckgo.com/",
    data: { q: query, format: 'json' }
  }).then(function(x) { return x.RelatedTopics; }))
}

class ViewModel {
  public query = wx.property();

  public results = this.query.changed
    .distinctUntilChanged()
    .throttle(200)
    .select((x) => search(x))
    .switch()
    .select((x) => x.filter((y) => y.Text && y.FirstURL))
    .select((x) => x.slice(0, 10))
    .toProperty();
}

export = ViewModel;
