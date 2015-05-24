/// <reference path="typings/web.rx.d.ts" />
/// <reference path="typings/require.d.ts" />

//this.baseUrl = "/";
this.baseUrl = "/examples/";

requirejs.config({
    baseUrl: this.baseUrl,
    paths: {
        'text': 'js/text'
    }
});

// register animations
wx.app.animation('move-to-right-unfold-left-enter', wx.animation("pt-page-rotateUnfoldRight stopped", "running"));
wx.app.animation('move-to-right-unfold-left-leave', wx.animation("pt-page-moveToLeftFade stopped", "running"));

wx.app.animation('push-bottom-from-top-enter', wx.animation("pt-page-moveFromTop stopped", "running"));
wx.app.animation('push-bottom-from-top-leave', wx.animation("pt-page-rotatePushBottom stopped", "running"));

wx.app.animation('scale-down-from-top-enter', wx.animation("pt-page-moveFromTop pt-page-ontop stopped", "running"));
wx.app.animation('scale-down-from-top-leave', wx.animation("pt-page-scaleDown stopped", "running"));

wx.app.animation('fadeIn', wx.animation("fadeIn stopped", "running"));
wx.app.animation('fadeOut', wx.animation("fadeOut stopped", "running"));
wx.app.animation('fadeInFast', wx.animation("fadeInFast stopped", "running"));
wx.app.animation('fadeOutFast', wx.animation("fadeOutFast stopped", "running"));

// register shared components
wx.app.component('state-monitor', {
    viewModel: { require: "js/components/state-monitor/ViewModel" },
    template: { require: "text!components/state-monitor/index.html" }
});

wx.app.component('header', {
    template: { require: "text!components/header/index.html" }
});

wx.app.component('welcome', {
    template: { require: "text!components/welcome/index.html" }
});

// setup root state
wx.router.state({
    name: "$",
    url: this.baseUrl,
    views: {
        'main': {
            component: "welcome",
            animations: {
                enter: "move-to-right-unfold-left-enter",
                leave: "move-to-right-unfold-left-leave"
            }
        },
        'state': {
            component: "state-monitor",
            animations: {
                enter: "fadeIn",
                leave: "fadeOut"
            }
        },
        'header': "header"
    }
});

// configure examples
interface IExample {
    title: string;
    folder: string;
    hasViewModel?: boolean;
    params?: any;
}

var examples: Array<IExample> = [
    { title: "Hello World", folder: "hello" },
    { title: "Stateful Hello World", folder: "hello-stateful" },
    { title: "TodoMVC", folder: "todomvc" },
    { title: "Output-Properties", folder: "output-properties" },
    { title: "Observable-List", folder: "observable-list" },
    { title: "Observable-List-Projection", folder: "observable-list-projection" },
    { title: "Mini Search-Engine", folder: "search-engine" },
];

var transitions = ["push-bottom-from-top", "scale-down-from-top"];
var currentTransition = 0;
var defaultTitle = wx.app.title();

examples.forEach(x=> {
    if (x.hasViewModel) {
        wx.app.component(x.folder, {
            viewModel: { require: wx.formatString("js/components/{0}/ViewModel", x.folder) },
            template: { require: wx.formatString("text!components/{0}/index.html", x.folder) }
        });
    }
    else {
        wx.app.component(x.folder, {
            template: { require: wx.formatString("text!components/{0}/index.html", x.folder) }
        });
    }

    wx.app.component(x.folder + "-content", {
        viewModel: { require: wx.formatString("js/components/{0}/example", x.folder) },
        template: { require: wx.formatString("text!components/{0}/example.html", x.folder) }
    });

    wx.router.state({
        name: x.folder,
        params: x.params,
        views: {
            'main': {
                component: x.folder,
                animations: {
                    enter: transitions[currentTransition] + "-enter",
                    leave: transitions[currentTransition] + "-leave"
                }
            }
        },
        onEnter: (config) => {
            wx.app.title(defaultTitle + " - " + x.title)
        }
    });

    currentTransition++;
    if (currentTransition > transitions.length - 1)
        currentTransition = 0;
});

// helper observables for current source links
this.currentExampleViewSourceLink = wx.whenAny(wx.router.current, state=> state ? wx.formatString(
    "https://github.com/WebRxJS/WebRx-Examples/tree/master/src/components/{0}/example.html", state.name) : "")
    .toProperty();

this.currentExampleViewModelSourceLink = wx.whenAny(wx.router.current, state=> state ? wx.formatString(
    "https://github.com/WebRxJS/WebRx-Examples/tree/master/src/components/{0}/example.ts", state.name) : "")
    .toProperty();

// go
var syncUrl = wx.getSearchParameters()["rs"];

if (!syncUrl) {
    wx.router.go("$", {}, { location: wx.RouterLocationChangeMode.replace });
} else {
    wx.router.sync((<wx.IRoute> wx.router.get("$").url).stringify() + syncUrl);
}

wx.applyBindings(this);
