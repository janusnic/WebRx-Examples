/// <reference path="typings/web.rx.d.ts" />
/// <reference path="typings/require.d.ts" />
/// <reference path="typings/highlightjs.d.ts" />

requirejs.config({
    baseUrl: "/",
    paths: {
        'text': 'js/text'
    }
});

// register animations
wx.app.animation('move-to-right-unfold-left-enter', wx.animation("pt-page-rotateUnfoldRight stopped", "running", undefined));
wx.app.animation('move-to-right-unfold-left-leave', wx.animation("pt-page-moveToLeftFade stopped", "running", undefined));

wx.app.animation('push-bottom-from-top-enter', wx.animation("pt-page-moveFromTop stopped", "running", undefined));
wx.app.animation('push-bottom-from-top-leave', wx.animation("pt-page-rotatePushBottom stopped", "running", undefined));

wx.app.animation('scale-down-from-top-enter', wx.animation("pt-page-moveFromTop pt-page-ontop stopped", "running", undefined));
wx.app.animation('scale-down-from-top-leave', wx.animation("pt-page-scaleDown stopped", "running", undefined));

wx.app.animation('fadeIn', wx.animation("fadeIn stopped", "running", undefined));
wx.app.animation('fadeOut', wx.animation("fadeOut stopped", "running", undefined));

// register components
wx.app.component('state-monitor', {
    viewModel: <wx.IComponentViewModelDescriptor> <any> { require: "js/components/state-monitor/ViewModel" },
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/state-monitor/index.html" }
});

wx.app.component('header', {
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/header/index.html" }
});

wx.app.component('state-monitor', {
    viewModel: <wx.IComponentViewModelDescriptor> <any> { require: "js/components/state-monitor/ViewModel" },
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/state-monitor/index.html" }
});

wx.app.component('header', {
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/header/index.html" }
});

wx.app.component('welcome', {
    template: <wx.IComponentTemplateDescriptor> <any> { require: "text!components/welcome/index.html" }
});

this.baseUrl = "/";

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

interface IExample {
    title: string;
    folder: string;
    hasViewModel: boolean;
    params?: any;
}

var examples:Array<IExample> = [
    { title: "Hello World", folder: "hello", hasViewModel: false },
    { title: "Stateful Hello World", folder: "hello-stateful", hasViewModel: false, params: { firstName: undefined, lastName: undefined } },
];

var transitions = ["push-bottom-from-top", "scale-down-from-top", "move-to-right-unfold-left"];
var currentTransition = 0;

// configure examples
examples.forEach(function (x) {
    if (x.hasViewModel) {
        wx.app.component(x.folder, {
            viewModel: <wx.IComponentViewModelDescriptor> <any> { require: wx.formatString("js/components/{0}/ViewModel", x.folder) },
            template: <wx.IComponentTemplateDescriptor> <any> { require: wx.formatString("text!/components/{0}/index.html", x.folder) }
        });
    }
    else {
        wx.app.component(x.folder, {
            template: <wx.IComponentTemplateDescriptor> <any> { require: wx.formatString("text!/components/{0}/index.html", x.folder) }
        });
    }

    wx.app.component(x.folder + "-content", {
        viewModel: <wx.IComponentViewModelDescriptor> <any> { require: wx.formatString("js/components/{0}/example", x.folder) },
        template: <wx.IComponentTemplateDescriptor> <any> { require: wx.formatString("text!/components/{0}/example.html", x.folder) }
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
        }
    });
    
    currentTransition++;
    if(currentTransition > transitions.length - 1)
        currentTransition = 0;
});

var defaultTitle = wx.app.title();

this.currentExampleViewSourceLink = wx.whenAny(wx.router.current, state=> state ? wx.formatString(
    "https://github.com/WebRxJS/WebRx-Examples/tree/master/src/components/{0}/example.html", state.name) : "")
.toProperty();

this.currentExampleViewModelSourceLink = wx.whenAny(wx.router.current, state=> state ? wx.formatString(
    "https://github.com/WebRxJS/WebRx-Examples/tree/master/src/components/{0}/example.ts", state.name) : "")
.toProperty();

// go
var syncUrl = wx.getSearchParameters()["rs"];

if(!syncUrl) {
    wx.router.go("$", {}, { location: wx.RouterLocationChangeMode.replace });
} else {
    wx.router.sync((<wx.IRoute> wx.router.get("$").url).stringify() + syncUrl);
}

wx.applyBindings(this);
