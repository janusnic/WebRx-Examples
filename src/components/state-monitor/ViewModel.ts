/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
	constructor(params: any) {
        var self = this;
        wx.router.current.changed.startWith(wx.router.current()).subscribe(function(x) {
            self.name(x.name);
            self.route(typeof x.url === "string"? x.url : (<wx.IRoute> <any> x.url).stringify(x.params));
            self.params(x.params ? JSON.stringify(x.params) : "");
        });
	}

    public name = wx.property();
    public route = wx.property();
    public params = wx.property();
}

export = ViewModel;