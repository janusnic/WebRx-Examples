/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
    constructor(params: any) {
        var self = this;
        wx.router.current.changed.startWith(wx.router.current()).subscribe((x) => {
            self.name(x.name);
            self.route(typeof x.url === "string" ? x.url : (<wx.IRoute> <any> x.url).stringify(x.params));
            self.params(x.params ? JSON.stringify(x.params) : "");

            var views = {};
            if (x.views) {
                Object.keys(x.views).forEach(key=> {
                    var view = x.views[key];
                    if (typeof view === "string") {
                        views[key] = view;
                    } else {
                        views[key] = view.component;
                    }
                });
            }
            self.views(JSON.stringify(views));
        });
    }

    public name = wx.property<string>();
    public route = wx.property<string>();
    public params = wx.property<Object>();
    public views = wx.property<Object>();
}

export = ViewModel;
