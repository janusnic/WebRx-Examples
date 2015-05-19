/// <reference path="typings/web.rx.d.ts" />
/// <reference path="typings/require.d.ts" />

requirejs.config({
    baseUrl: "/",
    paths: {
        text: 'js/text'
    }
});

// Move to right / unfold left
wx.app.animation('move-to-right-unfold-left-enter', wx.animation("pt-page-rotateUnfoldRight paused", "running", undefined));
wx.app.animation('move-to-right-unfold-left-leave', wx.animation("pt-page-moveToLeftFade paused", "running", undefined));

// Push bottom / from top
wx.app.animation('push-bottom-from-top-enter', wx.animation("pt-page-moveFromTop paused", "running", undefined));
wx.app.animation('push-bottom-from-top-leave', wx.animation("pt-page-rotatePushBottom paused", "running", undefined));

wx.app.component('welcome', {
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/welcome/index.html" }
});

wx.app.component('hello', {
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/hello/index.html" }
});
    
wx.router.state({
    name: "$",
    views: {
        'main': {
            component: "welcome",
            animations: {
                enter: "move-to-right-unfold-left-enter",
                leave: "move-to-right-unfold-left-leave"
            }
        }
    }
}).state({
    name: "hello",
    views: {
        'main': {
            component: "hello",
            animations: {
                enter: "push-bottom-from-top-enter",
                leave: "push-bottom-from-top-leave"
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
