/// <reference path="typings/web.rx.d.ts" />

wx.app.animation('enter', wx.animation("enter", "start", "complete"));
wx.app.animation('leave', wx.animation("leave", "start", "complete"));

wx.app.component('home', {
    template: "<h1>dfdsf</h1>"
});
    
wx.router.state({
    name: "$",
    views: {
        'main': {
            component: "home",
            animations: {
                enter: "enter",
                leave: "leave"
            }
        }
    }
});


var syncUrl = wx.getSearchParameters()["rs"];

if(!syncUrl) {
    wx.router.go("$", {}, { location: wx.RouterLocationChangeMode.replace });
} else {
    wx.router.sync((<wx.IRoute> wx.router.get("$").url).stringify() + syncUrl);
}

wx.applyBindings(undefined);
